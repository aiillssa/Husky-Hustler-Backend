import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Shops } from "../models/Shop";
import { Users } from "../models/Users";
export const createShop = async (req: Request, res: Response) => {
  const {
    shopName,
    shopDescription,
    ownerName,
    contactInformation,
    userIdUsers,
  } = req.body;
  // let parsedContactInformation = JSON.parse(contactInformation);
  try {
    const user = await AppDataSource.getRepository(Users).findOneBy({
      idUsers: userIdUsers,
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const newShop = AppDataSource.getRepository(Shops).create({
      shopName,
      shopDescription,
      ownerName,
      contactInformation,
      user,
    });

    // Extremely sus and kinda strange, i dont think we should do this
    const savedShop = await AppDataSource.getRepository(Shops).save(newShop);

    user.shop = savedShop;
    await AppDataSource.getRepository(Users).save(user);

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

export const getAllShops = async (req: Request, res: Response) => {
  try {
    const allShops = await AppDataSource.getRepository(Shops)
      .createQueryBuilder("shop")
      .getMany();
    console.log(allShops);
    res.status(200).json({ shops: allShops });
  } catch (err) {
    console.warn(
      `[Controller - getAllShops] failed trying to access Shops table\nError:${err}`
    );
    res.status(500).json({ error: err });
    return;
  }
};

export const updateShops = async (req: Request, res: Response) => {};
