import express from "express";
import routes from "../routes";

const userRouter = express.Router();

userRouter.get(routes.editProfile, (req, res) => res.send("Edit profile"));
userRouter.get(routes.changePassword, (req, res) => res.send("Change Password"));
userRouter.get(routes.userDetail, (req, res) => res.send("User Detail"));

export default userRouter;