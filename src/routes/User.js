const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");
const {
  login,
  register,
  getById,
  getFavoriteDecks,
  logout,
  getUserToken,
} = require("../controllers/User");

router.get("/usertoken", getUserToken);
router.get("/:id/favorite", getFavoriteDecks);
router.get("/:id", getById);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
