import { Request, Response } from "express";
import { Categories } from "../models/Categories";

// TODO (Ailsa): How to get this working?
// Confused!
export const getShopsWithCategory = async (req: Request, res: Response) => {
  const category = req.params.category;
  if (!category) {
    res.status(400).json({ error: `Shop ID is required` });
    return;
  }
  console.log(category);
  try {
    const shopsWithCategory = await Categories.findOne({
      relations: { shops: true },
    });
    if (shopsWithCategory) {
      res.status(200).json({ shops: shopsWithCategory.shops });
      return;
    } else {
      res.status(200).json({ shops: [] });
      return;
    }
  } catch (err) {
    console.warn(
      `[Controller - getShopsWithCategory] failed trying to access Categories table\nError:${err}`
    );
    res.status(500).json({ error: err });
    return;
  }
};
