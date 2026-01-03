import express from "express"
import { signIn, signUp } from "../controller/authController.js";

const authRouter = express.Router();

authRouter.post("/register", signUp)

authRouter.post("/sign-in", signIn)

export default authRouter ;

