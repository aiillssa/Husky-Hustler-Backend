import { Request, Response } from "express";
import { Shops } from "../models/Shop";

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
    validatedUser,
    validatedCategories,
    necessaryDescription,
    validatedProducts,
  } = req.body;

  try {
    // Create shop
    const shop = Shops.create({
      shopName: shopName,
      shopDescription: shopDescription,
      ownerName: ownerName,
      contactInformation: contactInformation,
      categories: validatedCategories,
      user: validatedUser,
      necessaryDescription: necessaryDescription ?? null,
      products: validatedProducts ?? null,
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
      relations: ["categories", "products"],
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
      relations: ["products"],
      where: { user: { idUsers: parseInt(user_id) } },
    });
    if (!shop) {
      res.status(404).json({
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
    const shops = await Shops.find({ relations: ["categories", "user"] });
    //console.log(shops);
    console.log("Accessed all shops successfully");
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
  const {
    shopName,
    shopDescription,
    ownerName,
    contactInformation,
    categories,
    necessaryDescription,
    validatedShop,
    validatedProducts,
  } = req.body;

  // Record which values are being changed
  const changes = new Map<string, any>();
  if (shopName) changes.set("shopName", shopName);
  if (shopDescription) changes.set("shopDescription", shopDescription);
  if (ownerName) changes.set("ownerName", ownerName);
  if (contactInformation) changes.set("contactInformation", contactInformation);
  if (categories) changes.set("categories", categories);
  if (necessaryDescription)
    changes.set("necessaryDescription", necessaryDescription);
  if (validatedProducts) changes.set("products", validatedProducts);

  // If no changes, then return 204 No Content
  if (changes.size === 0) {
    res.sendStatus(204);
    console.log(`No changes made`);
    return;
  }

  try {
    changes.forEach((value, key) => {
      console.log(value);
      (validatedShop as any)[key] = value;
    });
    await validatedShop.save();
    res.status(200).json({ shop: validatedShop });
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
      relations: ["categories", "user"],
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
