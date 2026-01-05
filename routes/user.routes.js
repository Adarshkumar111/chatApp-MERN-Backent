import express from "express";
import { checkAuth, login, signup, upadateProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const userRouter=express.Router();

userRouter.post("/signup", signup)
userRouter.post("/login", login)
userRouter.put("/update-profile",protectRoute ,upadateProfile)
userRouter.get("/check", protectRoute, checkAuth)

export default userRouter;