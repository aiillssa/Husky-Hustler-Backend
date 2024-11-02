import { NextFunction, Request, Response } from "express";

export const createShopValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  const {
    shopName,
    shopDescription,
    ownerName,
    contactInformation,
    userIdUsers,
    categories,
  } = req.body;
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
  if (shopName === "") {
    res
      .status(400)
      .json({ error: `Invalid shopName, cannot be an empty string` });
    return;
  }
  if (typeof categories !== "object") {
    res.status(400).json({ error: `Invalid categories, should be an array` });
    return;
  }
  if (categories.length === 0) {
    res.status(400).json({ error: `Should be at least one category` });
    return;
  }
  if (categories.length > 3) {
    res.status(400).json({ error: `Cannot have more than 3 categories` });
    return;
  }
  next();
};
