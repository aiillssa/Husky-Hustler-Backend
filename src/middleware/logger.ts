import { NextFunction, Request, Response } from "express";
import { PathLike, existsSync } from "fs";
import { appendFile, mkdir } from "fs/promises";
import path from "path";
/**
 * Middleware which logs the date, time and category when a
 * getShopByCategory is called
 */
export const logger = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { categoryName } = req.params;
  const currDate: string = new Date().toLocaleDateString();
  const currTime: string = new Date().toLocaleTimeString();
  const logPath: PathLike = path.join(__dirname, "..", "logs");
  const filePath: PathLike = path.join(logPath, "log-data.csv");
  try {
    console.log(req);
    if (!existsSync(logPath)) {
      await mkdir(logPath);
      await appendFile(filePath, "Date, Time, Category\n");
    }
    const data: string = `${currDate}, ${currTime}, ${categoryName ?? null}\n`;
    await appendFile(filePath, data);
  } catch (err) {
    console.error(`[Logger] failure while logging results: ${err}`);
  }
  next();
};
