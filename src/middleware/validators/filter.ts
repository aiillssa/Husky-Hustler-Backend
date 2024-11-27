import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

dotenv.config();
const genAI = new GoogleGenerativeAI(String(process.env.GEMINI_API_KEY));
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const checkInappropriate = (fields: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const arr: string[] = [];
    for (const field of fields) {
      const val = req.body[field];
      if (val) {
        arr.push(val);
      }
    }
    if (arr.length === 0) {
      next(); // No fields to check, proceed to the next middleware
      return;
    }
    try {
      console.log(`${arr}`);
      const response = await model.generateContent(
        `Determine if the following array contains inappropriate content: "${arr}". Respond with "true" if inappropriate, "false" otherwise.`
      );
      const aiRes = response.response.text().trim().toLowerCase();
      if (aiRes == "true") {
        res
          .status(400)
          .json({ error: `Some fields had inappropriate entries` });
        return;
      }
    } catch (err) {
      console.warn(
        `[Validator - filter] Error while interacting with Gemini API: ${err}`
      );
      res.status(500).json({ error: String(err) });
      return;
    }
    next();
  };
};
