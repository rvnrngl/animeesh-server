import express from "express";
import { UserModel } from "../models/Users.js";

const router = express.Router();

// get user info based on userID
router.get("/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);

    if (!user) {
      return res.json({ isSuccess: false, message: "User doesn't exist!" });
    }

    res.json({
      username: user.username,
      joinDate: user.joinDate,
      watchList: user.watchList,
    });
  } catch (error) {
    res.json(error);
  }
});

export { router as userRouter };
