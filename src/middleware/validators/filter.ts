import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

dotenv.config();

// Accessing Gemini AI API
const genAI = new GoogleGenerativeAI(String(process.env.GEMINI_API_KEY));
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Given fields, this method returns a middleware which analyzes
 * the given fields for any inappropriate content.
 * @param fields fields to be validated for inappropriate content
 * @returns A middleware which returns
 * - 400 if there was any inappropriate information
 * - moves onto next otherwise, and also in the case where there were
 *   no valid fields
 */
export const checkInappropriate = (fields: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const arr: string[] = [];
    for (const field of fields) {
      const val = req.body[field];
      if (val) {
        arr.push(val); // Push only defined body fields
      }
    }
    if (arr.length === 0) {
      next(); // No fields to check, proceed to the next middleware
      return;
    }
    try {
      const response = await model.generateContent(
        `Determine if the following array contains inappropriate content: "${arr}". Respond with "true" if inappropriate, "false" otherwise.`
      );
      const aiRes = response.response.text().trim().toLowerCase();
      if (aiRes == "true") {
        res.status(400).json({
          error: `Some fields had inappropriate entries. Please try again.`,
          isInappropriate: true, // To be used on the frontend
        });
        return;
      }
    } catch (err) {
      console.warn(
        `[Validator - filter] Error while interacting with Gemini API: ${err}`
      );
      res.status(500).json({ error: String(err) });
      return;
    }

    // Proceed to the next middleware
    next();
  };
};
