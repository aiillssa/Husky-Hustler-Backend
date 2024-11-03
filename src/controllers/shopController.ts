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
  } = req.body;

  try {
    // Validate that user exists in the user table
    const user = await Users.findOneBy({ idUsers: parseInt(userIdUsers) });
    if (!user) {
      res.status(404).json({ error: "User not found" });
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

export const getShop = async (req: Request, res: Response) => {};

/**
 * GET request for retrieving all shops from database
 * @returns
 * - 200 w/ an array of the shops if successful
 * - 500 if server error
 */
export const getAllShops = async (req: Request, res: Response) => {
  try {
    // Get all shops
    const shops = await Shops.find();
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

export const updateShops = async (req: Request, res: Response) => {};

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
