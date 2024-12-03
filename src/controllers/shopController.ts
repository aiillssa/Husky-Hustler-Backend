import { Request, Response } from "express";
import { Shops } from "../models/Shop";
import { Users } from "../models/Users";
import { Categories } from "../models/Categories";
import { In } from "typeorm";

/**
 * POST request for creating a new shop
 * @returns
 * - 404 if userIdUsers not in users table
 * - 400 if categories[i] not in categories table
 * - 201 w/ shop_id if shop successfully created
 * - 500 if server error
 */
export const createShop = async (req: Request, res: Response) => {
  // Extract fields from request body
  const {
    shopName,
    shopDescription,
    ownerName,
    contactInformation,
    userIdUsers, // Might want to pass this through params
    categories,
    necessaryDescription,
  } = req.body;

  try {
    // Validate that user exists in the user table
    const user = await Users.findOne({
      relations: ["shop"],
      where: { idUsers: parseInt(userIdUsers) },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Validate that user does not already own a shop
    if (user.shop) {
      res.status(400).json({
        error: `User already has a shop: ${user.shop}`,
        shop: user.shop,
      });
      return;
    }

    // Validate categories[i] exists in categories table
    const categoryEntities = await Categories.findBy({
      categoryName: In(categories),
    });

    if (categoryEntities.length !== categories.length) {
      res.status(400).json({
        error: `At least one category passed in does not exist in the table`,
      });
      return;
    }

    // Create shop
    const shop = Shops.create({
      shopName: shopName,
      shopDescription: shopDescription,
      ownerName: ownerName,
      contactInformation: contactInformation,
      categories: categoryEntities,
      user: user,
      necessaryDescription: necessaryDescription ?? null,
    });

    const savedShop = await shop.save();
    console.log(`Created Shop: ${savedShop}`);
    res.status(201).json({ msg: "Success", shop_id: savedShop.idshops });
    return;
  } catch (err) {
    console.warn(
      `[Controller - createShop] failed trying to access Shops table\nError: ${err}`
    );
    res.status(500).json({ error: err });
    return;
  }
};

/**
 * GET request for retrieving a shop w shop_id from database
 * @returns
 * - 200 w/ the shop if successful
 * - 400 if shop ID not provided
 * - 404 if shop w shop_id not found
 * - 500 if server error
 */
export const getShop = async (req: Request, res: Response) => {
  const shop_id = req.params.id;
  if (!shop_id) {
    res.status(400).json({ error: `Shop ID is required` });
    return;
  }
  try {
    // Get shop
    const shop = await Shops.findOne({
      relations: ["categories"],
      where: { idshops: parseInt(shop_id) },
    });

    // No shop w shop_id found
    if (!shop) {
      res
        .status(404)
        .json({ error: `Shop ID ${shop_id} not found in Shops table` });
      return;
    }
    // Return
    res.status(200).json({ shop: shop });
    return;
  } catch (err) {
    console.warn(
      `[Controller - getShop] failed trying to get shop from table\nError:${err}`
    );
    res.status(500).json({ error: String(err) });
  }
};

/**
 * GET request for retrieving a shop w user_id from database
 * @returns
 * - 200 w/ the shop if successful
 * - 400 if user ID not provided
 * - 404 if shop w user_id not found
 * - 500 if server error
 */
export const getShopWithUserId = async (req: Request, res: Response) => {
  const user_id = req.params.userId;
  if (!user_id) {
    res.status(400).json({ error: `User ID is required` });
    return;
  }
  try {
    const shop = await Shops.findOne({
      where: { user: { idUsers: parseInt(user_id) } },
    });
    if (!shop) {
      res
        .status(404)
        .json({
          error: `User ID ${user_id} does not have a shop`,
          hasShop: false,
        });
      return;
    }
    res
      .status(200)
      .json({ msg: `User ${user_id} has a shop`, hasShop: true, shop: shop });
  } catch (err) {
    console.warn(
      `[Controller - getShopWithUserId] failed trying to get shop from table\nError:${err}`
    );
    res.status(500).json({ error: String(err) });
  }
};

/**
 * GET request for retrieving all shops from database
 * @returns
 * - 200 w/ an array of the shops if successful
 * - 500 if server error
 */
export const getAllShops = async (req: Request, res: Response) => {
  try {
    // Get all shops
    const shops = await Shops.find({ relations: ["categories"] });
    console.log(shops);
    res.status(200).json({ shops });
  } catch (err) {
    console.warn(
      `[Controller - getAllShops] failed trying to access Shops table\nError:${err}`
    );
    res.status(500).json({ error: err });
    return;
  }
};

/**
 * PATCH request to update fields for an existing shop in the Shops table
 * @returns
 * - 400 if shop_id is not provided in request
 * - 204 if no fields to update in request body
 * - 404 if shop with shop_id not found in the Shops table
 * - 200 with the updated shop if update is successful
 * - 500 if server error
 */
export const updateShops = async (req: Request, res: Response) => {
  const shop_id = req.params.id;
  if (!shop_id) {
    res.status(400).json({ error: `Shop ID is required` });
    return;
  }
  const {
    shopName,
    shopDescription,
    ownerName,
    contactInformation,
    categories,
    necessaryDescription,
  } = req.body;
  const changes = new Map<string, any>();
  if (shopName) changes.set("shopName", shopName);
  if (shopDescription) changes.set("shopDescription", shopDescription);
  if (ownerName) changes.set("ownerName", ownerName);
  if (contactInformation) changes.set("contactInformation", contactInformation);
  if (categories) changes.set("categories", categories);
  if (necessaryDescription)
    changes.set("necessaryDescription", necessaryDescription);
  if (changes.size === 0) {
    res.sendStatus(204);
    console.log(`No changes made`);
    return;
  }

  if (contactInformation && typeof contactInformation !== "object") {
    res.status(400).json({
      error: `contactInformation must be a json`,
    });
    return;
  }

  if (necessaryDescription && typeof necessaryDescription !== "object") {
    res.status(400).json({
      error: `necessaryDescription must be a json`,
    });
    return;
  }

  try {
    const shop = await Shops.findOne({
      relations: ["categories"],
      where: { idshops: parseInt(shop_id) },
    });
    if (!shop) {
      res.status(404).json({ error: "Shop not found" });
      return;
    }
    changes.forEach((value, key) => {
      (shop as any)[key] = value;
    });
    if (categories) {
      const categoryEntities = await Categories.findBy({
        categoryName: In(categories),
      });
      if (categoryEntities.length !== categories.length) {
        res.status(400).json({
          error: `At least one category passed in does not exist in the table`,
        });
        return;
      }
      shop.categories = categoryEntities;
    }

    await shop.save();
    res.status(200).json({ shop: shop });
    console.log(`[Controller - updateShops] Shop updated successfully`);
  } catch (err) {
    console.warn(
      `[Controller - updateShops] failed trying to update shop from table\nError: ${err}`
    );
    res.status(500).json({ error: String(err) });
  }
};

/**
 * DELETE request for deleting a shop
 * @returns
 * - 400 if shop_id not included
 * - 204 if already deleted
 * - 200 if successfully deleted
 * - 500 if server error
 */
export const deleteShop = async (req: Request, res: Response) => {
  // Check if shop_id provided
  const shop_id = req.params.id;
  if (!shop_id) {
    res.status(400).json({ error: `Shop ID is required` });
    return;
  }
  try {
    // Delete shop
    const result = await Shops.delete({ idshops: parseInt(shop_id) });

    // If nothing got deleted (already deleted/not present)
    if (result.affected === 0) {
      res.sendStatus(204);
      return;
    }
    // Deleted successfully
    res.status(200).json({ msg: `Shop successfully deleted` });
    return;
  } catch (err) {
    console.warn(
      `[Controller - deleteShop] failed trying to delete shop from table\nError:${err}`
    );
    res.status(500).json({ error: String(err) });
  }
};

/**
 * GET request to retrieve shops of a specific category
 * @returns
 * - 400 if categoryName not provided
 * - 404 if no shops of that category
 * - 200 w/ an array of all the shops of that category
 * - 500 if server array
 */
export const getShopsWithCategory = async (req: Request, res: Response) => {
  // Extract and validate categoryName from params
  const { categoryName } = req.params;
  if (!categoryName) {
    res.status(400).json({ error: `Category Name is required` });
    return;
  }
  console.log(categoryName);
  try {
    // Retrieve array of shops fitting that category
    const shops = await Shops.find({
      relations: ["categories"],
      where: { categories: { categoryName } },
    });

    // Empty array retrieved
    if (shops.length === 0) {
      res.status(404).json({ msg: `No shops found for this category` });
      return;
    } else {
      res.status(200).json({ shops: shops });
      return;
    }
  } catch (err) {
    console.warn(
      `[Controller - getShopsWithCategory] failed trying to access Shops table\nError:${err}`
    );
    res.status(500).json({ error: err });
    return;
  }
};
