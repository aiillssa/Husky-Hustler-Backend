import { Request, Response } from "express";
import { Categories } from "../models/Categories";

export const createCategory = async (req: Request, res: Response) => {
  const { categoryName } = req.body;
  if (!categoryName) {
    res.status(400).json({ error: "categoryName required" });
  }
  try {
    const category = Categories.create({ categoryName: categoryName });
    const savedCategory = await category.save();
    console.log(`Created Category: ${savedCategory}`);
    res.status(201).json({ msg: "Success" });
    return;
  } catch (err) {
    console.warn(
      `[Controller - createCategory] failed trying to create a category\nError: ${err}`
    );
    res.status(500).json({ error: String(err) });
  }
};
