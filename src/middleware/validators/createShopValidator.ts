import { NextFunction, Request, Response } from "express";

/**
 * Middleware which validates requests for the createShop endpoint
 * If any validation check fails, it returns a 400 Bad Request
 * Expected fields for the request body (all required):
 * - shopName (string): nonempty
 * - shopDescription (string)
 * - ownerName (string)
 * - userIdUsers (string or number)
 * - categories (array): 0 < len(categories) <= 3, categories[i] must be in categories table
 * @returns
 * - 400 error if validation fails
 * - Otherwise forwards to the createShop endpoint
 */
export const createShopValidator = (
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
      error: `At least one missing field: shopName: ${shopName}, ownerName: ${ownerName}, contactInformation: ${contactInformation}, userIdUsers = ${userIdUsers}, categories = ${categories}`,
    });
    return;
  }

  // Check if shopName is an empty string
  if (shopName === "") {
    res
      .status(400)
      .json({ error: `Invalid shopName, cannot be an empty string` });
    return;
  }

  // Check if categories is an array
  if (typeof categories !== "object") {
    res.status(400).json({ error: `Invalid categories, should be an array` });
    return;
  }

  // Checking length constraints on categories array
  if (categories.length === 0) {
    res.status(400).json({ error: `Should be at least one category` });
    return;
  }
  if (categories.length > 3) {
    res.status(400).json({ error: `Cannot have more than 3 categories` });
    return;
  }

  // Proceed to createShop
  next();
};
