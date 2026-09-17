const express = require("express");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} = require("../controllers/wishlistController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getWishlist);
router.post("/add", protect, addToWishlist);
router.delete("/:carId", protect, removeFromWishlist);
router.get("/check/:carId", protect, checkWishlist);

module.exports = router;
