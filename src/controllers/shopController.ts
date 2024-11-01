import { Request, Response } from "express";
import { Shops } from "../models/Shop";
import { Users } from "../models/Users";
import { AppDataSource } from "../config/data-source";
import { Categories } from "../models/Categories";
export const createShop = async (req: Request, res: Response) => {
  const {
    shopName,
    shopDescription,
    ownerName,
    contactInformation,
    userIdUsers,
    category1Name,
    category2Name,
    category3Name, // Might want to pass this through params
  } = req.body;

  try {
    const user = await Users.findOneBy({ idUsers: parseInt(userIdUsers) });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const cat1 = await Categories.findOneBy({ categoryName: category1Name });
    const cat2 = await Categories.findOneBy({ categoryName: category2Name });
    const cat3 = await Categories.findOneBy({ categoryName: category3Name });
    console.log(cat1, cat2, cat3);
    //categories should be an array!!!
    const shop = Shops.create({
      shopName: shopName,
      shopDescription: shopDescription,
      ownerName: ownerName,
      contactInformation: contactInformation,
      categories: [],
      user: user,
    });

    shop.categories = [...shop.categories, cat1!, cat2!, cat3!];

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

export const getAllShops = async (req: Request, res: Response) => {
  try {
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

export const deleteShop = async (req: Request, res: Response) => {
  const shop_id = req.params.id;
  if (!shop_id) {
    res.status(400).json({ error: `Shop ID is required` });
    return;
  }
  try {
    const result = await Shops.delete({ idshops: parseInt(shop_id) });
    if (result.affected === 0) {
      res.sendStatus(204);
      return;
    }
    res.status(200).json({ msg: `Shop successfully deleted` });
    return;
  } catch (err) {
    console.warn(
      `[Controller - deleteShop] failed trying to delete shop from table\nError:${err}`
    );
    res.status(500).json({ error: String(err) });
  }
};
