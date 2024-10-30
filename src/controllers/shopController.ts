import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Shops } from "../models/Shop";
export const createShop = async (req: Request, res: Response) => {
  try {
    const response = await AppDataSource.createQueryBuilder()
      .insert()
      .into(Shops)
      .values({
        shopName: "Ailsa's shop",
        shopDescription:
          "this shop sells pickles that are really delicious and yummy",
        ownerName: "Ailsa <3",
        contactInformation: "ailsaspickles@pickle.com",
        user: { idUsers: 1 },
      })
      .execute();
    console.log(`Created Shop: ${response}`);
    res.status(201).json({ msg: "Success" });
  } catch (err) {
    console.warn(
      `[Controller - createShop] failed trying to access Shops table\nError: ${err}`
    );
    res.status(400).json({ error: err });
  }
};

export const getShop = async (req: Request, res: Response) => {};

export const getAllShops = async (req: Request, res: Response) => {};

export const updateShops = async (req: Request, res: Response) => {};
