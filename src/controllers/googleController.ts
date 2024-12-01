// controllers/googleController.ts
import { OAuth2Client } from "google-auth-library";
import { Request, Response } from "express";
import axios from "axios";
import { Users } from "../models/Users";

const jwt = require("jsonwebtoken");

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage"
);

/**
 * - Exchanges the authorization code from the front end with Google's OAuth Server to access user info
 * @param code 
 * - Contains the code to exchange for user info with Google OAuth server
 * @returns 
 * - The email and name of the user associated with the UW Google account
 */
export const getGoogleUserInfo = async (
  code: string
): Promise<{email: string; name: string} | null> => {
  try {
    // Exchange authorization code for token
    const { tokens } = await oAuth2Client.getToken(code);
    const idToken = tokens.id_token;

    // Check if idToken is available
    if (!idToken) {
      throw new Error("ID token not found");
    }

    // Verify the ID token with Google
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: idToken,
      audience: process.env.CLIENT_ID,
    });

    // Get user info from the ticket
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("Invalid Google token payload");
    }
    const { email, name } = payload;

    if (!email || !name) {
      throw new Error("Missing email or name in Google token payload");
    }

    return {email, name};
  } catch (error) {
    console.error("[Utility - getGoogleUserInfo] Error getting user info:", error);
    return null;
  }
};

/**
 * Handles signing users up using their UW Google account
 * @param req 
 * - contains the code to exchange for user info with Google OAuth server
 * @param res 
 * - The status code as well as usserId of created user on success and 
 *   error message on failture
 * @returns 
 * - 201 if user is added successfully to the database
 * - 400 if adding the user to the database returns an unexpected error
 * - 401 if getGoogleUserInfo fails to retreive the info of the Goolge user
 * - 409 if the user already exists in the database
 * - 500 if there are any unexpected errors
 */
export const handleGoogleSignUp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try{
    const { code } = req.body;
    // Attempts to get user info from Google OAuth server
    const userInfo = await getGoogleUserInfo(code);
    if (!userInfo) {
      res.status(401).json({ error: "Failed to retrieve Google user info" });
      return;
    }

    const { email, name } = userInfo;

    // Tries adding the user to the database
    try {
      const createUserResponse = await axios.post("http://localhost:8088/users", {
        name,
        email,
      });

      if (createUserResponse.status === 201) {
        res.status(201).json({
          message: "User created successfully",
          user_id: createUserResponse.data.user_id,
        });
        return;
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        res.status(409).json({ error: "User already exists" });
        return;
      } else if (error.response?.status === 400) {
        res.status(400).json({ error: error.response?.data?.error });
        return;
      }
      throw error; 
    }
  } catch (error) {
    console.error("Error during Google sign-up:", error);
    res.status(500).json({ error: "Failed to sign up with Google" });
  }
};

/**
 * Handles logging users in using their UW Google account
 * @param req 
 * - contains the code to exchange for user info with Google OAuth server
 * @param res 
 * - The status code as well as auth, JWT, userId, email, and name of logged in user on success and 
 *   error message on failture
 * @returns 
 * - 200 if user is successfully retreived from the database
 * - 400 if user did not exist in the database
 * - 401 if getGoogleUserInfo fails to retreive the info of the Goolge user
 * - 500 if there are any unexpected errors
 */
export const handleGoogleLogIn = async (
  req: Request,
  res: Response
): Promise<void> => {
  try{
    const { code } = req.body;
    // Attempts to get user info from Google OAuth server
    const userInfo = await getGoogleUserInfo(code);
    if (!userInfo) {
      res.status(401).json({ error: "Failed to retrieve Google user info" });
      return;
    }

    const { email, name } = userInfo;

    // Tries to find the user in the database using email
    const existingUser = await Users.findOne({ where: { email: email } });
    if (existingUser) {

    // If the user exists, get their userID for the front end
    const user_id = existingUser.idUsers;

    // Create the auth JWT
    const token = jwt.sign(
      { id: user_id },
      process.env.APP_SECRET!,
      { expiresIn: "10s" }
    );

    const refreshToken = jwt.sign(
      { id: user_id },
      process.env.APP_SECRET!,
      { expiresIn: "1h" }
    );
    const refreshToken2 = "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15"

    // Set refresh token as an HttpOnly cookie
    res.cookie( "refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60, // expire after 60 minutes
      httpOnly: true, // Cookie will not be exposed to client side code
      sameSite: 'none', // If client and server origins are different
      secure: true, // use with HTTPS only
      domain: 'localhost',
    });
    
    res.status(200).json({
      auth: true, 
      token: token,
      id: user_id,
      email: userInfo.email,
      name: userInfo.name,
    });
    return;
    }
    res.status(400).json({error: "User did not exist in the table"});
    return;
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(500).json({ error: "Failed to log in with Google" });
  }
}


