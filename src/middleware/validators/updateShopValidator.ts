import { NextFunction, Request, Response } from "express";
import { Shops } from "../../models/Shop";
import { Categories } from "../../models/Categories";
import { In } from "typeorm";

/**
 * Middleware which validates requests for the updateShop endpoint
 * If any validation check fails, it returns a 400 Bad Request
 * Expected fields for the request body (all optional):
 * - shopName (string): nonempty
 * - shopDescription (string)
 * - ownerName (string)
 * - categories (array): 0 < len(categories) <= 3, categories[i] must be in categories table
 * - contactInformation (json)
 * - necessaryDescription (json)
 * @returns
 * - 400 error if validation fails
 * - 404 if user for whom shop is being updated does not exist
 * - 500 if error accessing database tables
 * - Otherwise forwards to the createShop endpoint
 */
export const updateShopValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const shop_id = req.params.id;
  if (!shop_id) {
    console.warn(`[Validator - updateShopValidator] no shop id was provided`);
    res.status(400).json({ error: `Shop ID is required` });
    return;
  }
  const { shopName, contactInformation, necessaryDescription, categories } =
    req.body;

  if (shopName && (typeof shopName !== "string" || shopName === "")) {
    console.warn(
      `[Validator - updateShopValidator] shopName is either not a string or is an empty string`
    );
    res.status(400).json({
      error: `Invalid shopName, cannot be an empty string. Please try again.`,
    });
    return;
  }

  if (contactInformation && typeof contactInformation !== "object") {
    console.warn(
      `[Validator - updateShopValidator] contactInformation is not a json`
    );
    res.status(400).json({
      error: `contactInformation must be a json`,
    });
    return;
  }

  if (necessaryDescription && typeof necessaryDescription !== "object") {
    console.warn(
      `[Validator - updateShopValidator] necessaryDescription is not a json`
    );
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
      console.warn(`[Validator - updateShopValidator] the shop does not exist`);
      res.status(404).json({ error: "Shop not found" });
      return;
    }
    if (categories) {
      const categoryEntities = await Categories.findBy({
        categoryName: In(categories),
      });
      if (categoryEntities.length !== categories.length) {
        console.warn(
          `[Validator - updateShopValidator] at least one category passed in does not exist in the table`
        );
        res.status(400).json({
          error: `At least one category passed in does not exist in the table`,
        });
        return;
      }
      shop.categories = categoryEntities;
    }
    req.body.validatedShop = shop;
  } catch (err) {
    console.warn(
      `[Validator - updateShopValidator] error while accessing tables.\nError:${err}`
    );
    res.status(500).json({ err: String(err) });
    return;
  }
  next();
};
