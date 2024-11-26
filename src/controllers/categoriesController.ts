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

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Categories.find();
    console.log(
      `Categories given as follows: ${categories.map((category) => category.categoryName)}`
    );
    res.status(200).json(categories);
  } catch (err) {
    console.warn(
      `[Controller - getAllCategories] failed trying to get all categories\nError: ${err}`
    );
    res.status(500).json({ error: String(err) });
  }
};
