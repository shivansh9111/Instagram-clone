import express from "express";
import {editprofile, followerFollowing, getProfile,login,logout,register, suggestedUser,} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/:id/profile").get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated,upload.single('profilePicture'),editprofile)
router.route("/suggested").get(isAuthenticated,suggestedUser);
router.route("/followorunfollow/:id").post(isAuthenticated, followerFollowing);


export default router