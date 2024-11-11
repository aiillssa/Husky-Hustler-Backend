// controllers/googleController.ts
import { OAuth2Client } from "google-auth-library";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import { AppDataSource } from "../config/data-source";
import { Users } from "../models/Users";

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage"
);

export const handleGoogleLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code } = req.body;

    // Exchange authorization code for tokens
    const { tokens } = await oAuth2Client.getToken(code);
    const idToken = tokens.id_token;

    // Check if idToken is available
    if (!idToken) {
      console.error("ID token not found");
      res.status(500).json({ error: "ID token not found" });
      return;
    }

    // Verify the ID token with Google
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: idToken,
      audience: process.env.CLIENT_ID,
    });

    // Get user info from the ticket
    const payload = ticket.getPayload();
    if (!payload) {
      console.error("Invalid Google token payload");
      res.status(401).json({ error: "Invalid Google token" });
      return;
    }

    const { email, name } = payload;

    // Check if the user already exists in the database
    const existingUser = await AppDataSource.getRepository(Users)
      .createQueryBuilder("user")
      .where("user.email = :email", { email })
      .getOne();

    let user_id;
    if (existingUser) {
      // If user exists, retrieve their ID
      user_id = existingUser.idUsers;
    } else {
      // If user does not exist, call createUser to add them to the database
      const response = await axios.post("http://localhost:8088/users", {
        name,
        email,
      });
      // Something went wrong here
      if (response.status !== 201) {
        res.status(400).json({ error: `Invalid format` });
        return;
      }
      user_id = response.data.user_id;
    }

    // Generate JWT for the user
    const appJwt = jwt.sign(
      { id: user_id, email, name },
      process.env.APP_SECRET!,
      { expiresIn: "1h" }
    );

    // Return the JWT, name, and email to the front end
    res.status(200).json({ appJwt, name, email, user_id });
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(500).json({ error: "Failed to authenticate with Google" });
  }
};
