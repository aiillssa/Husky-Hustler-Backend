import { NextFunction, Request, Response } from "express";
import { Products } from "../models/Products";

/** Middleware to upload products to the products table
 * @returns
 * - 400 if products is not an array
 * - 400 if caption or price do not exist or are not strings
 */
export const prepareProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //
  const { products } = req.body;
  // Check that if products exists, it is an array
  if (products && (!Array.isArray(products) || products.length === 0)) {
    console.warn(
      `[uploadProducts] products is not an array / is an empty array`
    );
    res.status(400).json({ error: `Products must be an array of json` });
    return;
  }

  if (products) {
    const validatedProducts: Products[] = [];
    for (const product of products) {
      const { caption, price } = product;
      // Check that caption exists and is a string
      if (!caption || typeof caption !== "string") {
        console.warn(
          `[uploadProducts] caption must be provided with each product`
        );
        res
          .status(400)
          .json({ error: `Each product must have a valid caption` });
        return;
      }

      // Check that price exists and is a string
      if (!price || typeof price !== "string") {
        console.warn(
          `[uploadProducts] price must be provided with each product`
        );
        res.status(400).json({ error: `Each product must have a valid price` });
        return;
      }

      // Add product to the array
      const newProduct = Products.create({ caption: caption, price: price });
      validatedProducts.push(newProduct);
    }
    // Prepare for the next middleware
    req.body.validatedProducts = validatedProducts;
  }

  // Proceed to the middleware
  next();
};
