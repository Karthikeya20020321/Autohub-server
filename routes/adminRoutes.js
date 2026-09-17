const express = require("express");

const {
  getUsers,
  updateUserBlockStatus,
  deleteUser,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/users", protect, adminOnly, getUsers);
router.patch("/users/:id/block", protect, adminOnly, updateUserBlockStatus);
router.delete("/users/:id", protect, adminOnly, deleteUser);

module.exports = router;
