import { NextFunction, Request, Response } from "express";
import { Categories } from "../../models/Categories";
import { Users } from "../../models/Users";
import { In } from "typeorm";

/**
 * Middleware which validates requests for the createShop endpoint
 * If any validation check fails, it returns a 400 Bad Request
 * Expected fields for the request body (all required except necessaryDescription and products):
 * - shopName (string): nonempty
 * - shopDescription (string)
 * - ownerName (string)
 * - userIdUsers
 *    1. string or number, otherwise 400
 *    2. Must exist, otherwise 404
 *    3. Must not have a shop already, otherwise 400
 * - categories (array): 0 < len(categories) <= 3, categories[i] must be in categories table
 * - contactInformation (json)
 * - necessaryDescription (json)
 * - products (array of json)
 * @returns
 * - 400 error if validation fails
 * - 404 if user for whom shop is being created does not exist
 * - 400 if user already has a shop
 * - 500 if error accessing database tables
 * - Otherwise forwards to the createShop endpoint
 */
export const createShopValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);

  // Extract fields from request body
  const {
    shopName,
    shopDescription,
    ownerName,
    contactInformation,
    userIdUsers,
    categories,
    necessaryDescription,
  } = req.body;

  // Check for missing fields
  if (
    !shopName ||
    !shopDescription ||
    !ownerName ||
    !contactInformation ||
    !userIdUsers ||
    !categories
  ) {
    res.status(400).json({
      error: `At least one missing field: shopName: ${shopName}, ownerName: ${ownerName}, contactInformation: ${contactInformation}, userIdUsers = ${userIdUsers}, categories = ${categories}. Please try again`,
    });
    return;
  }

  // Check if shopName is an empty string
  if (shopName === "") {
    res.status(400).json({
      error: `Invalid shopName, cannot be an empty string. Please try again`,
    });
    return;
  }

  // Check if categories is an array
  if (typeof categories !== "object") {
    res.status(400).json({
      error: `Invalid categories, should be an array. Please try again`,
    });
    return;
  }

  // Checking length constraints on categories array
  if (categories.length === 0) {
    res
      .status(400)
      .json({ error: `Should be at least one category. Please try again` });
    return;
  }
  if (categories.length > 3) {
    res
      .status(400)
      .json({ error: `Cannot have more than 3 categories. Please try again` });
    return;
  }

  // Check if contactInformation is a json
  if (typeof contactInformation !== "object" || contactInformation === null) {
    console.warn(
      `[Validator - createShopValidator] contactInformation is not a json`
    );
    res.status(400).json({
      error: `contactInformation must be a json type. Please try again`,
    });
    return;
  }

  // Check that if necessaryDescription exists, it is a json
  if (necessaryDescription && typeof necessaryDescription !== "object") {
    console.warn(
      `[Validator - createShopValidator] necessaryDescription is not a json`
    );
    res.status(400).json({
      error: `necessaryDescription must be a json`,
    });
    return;
  }

  try {
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

    // Prepare to pass onto the next function
    req.body.validatedUser = user;
    req.body.validatedCategories = categoryEntities;
  } catch (err) {
    console.warn(
      `[Validator - createShopValidator] error while accessing tables.\nError:${err}`
    );
    res.status(500).json({ err: String(err) });
  }
  // Proceed to createShop
  next();
};
