import express from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";

const router = express.Router();

/*----------------get user info--------------*/
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

/*----------------update username--------------*/
router.put("/update/username", async (req, res) => {
  const { userID, newUsername } = req.body;

  try {
    const user = await UserModel.findById(userID);

    // check if new username is equal to old username
    if (user.username === newUsername) {
      return res.json({ message: "Username already exist!" });
    }

    user.username = newUsername;
    await user.save();
    return res.json({ message: "Username updated successfully!" });
  } catch (error) {
    res.json(error);
  }
});

/*----------------update passsword--------------*/
router.put("/update/password", async (req, res) => {
  const { userID, currentPassword, newPassword } = req.body;
  try {
    const user = await UserModel.findById(userID);

    // check if current password is not equal to user's password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.json({ message: "Enter correct current password!" });
    }

    // hashed the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    return res.json({ message: "Password updated successfully!" });
  } catch (error) {
    res.json(error);
  }
});

/*----------------Delete User--------------*/
router.delete("/:userID", async (req, res) => {
  const userID = req.params.userID;
  try {
    const user = await UserModel.findById(userID);

    // check if user is not found
    if (!user) {
      return res.json({ message: "User not found!" });
    }

    // if found
    await UserModel.findByIdAndDelete(userID);

    return res.json({ message: "User successfully deleted!" });
  } catch (error) {
    res.json(error);
  }
});

export { router as userRouter };
