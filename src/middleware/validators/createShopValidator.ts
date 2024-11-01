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
    category1Name,
    category2Name,
    category3Name,
  } = req.body;
  if (
    !shopName ||
    !shopDescription ||
    !ownerName ||
    !contactInformation ||
    !userIdUsers ||
    !category1Name ||
    !category2Name ||
    !category3Name
  ) {
    res.status(400).json({
      error: `At least one missing field: shopName: ${shopName}, ownerName: ${ownerName}, contactInformation: ${contactInformation}, userIdUsers = ${userIdUsers}`,
    });
    return;
  }
  if (shopName === "") {
    res
      .status(400)
      .json({ error: `Invalid shopName, cannot be an empty string` });
    return;
  }
  next();
};
