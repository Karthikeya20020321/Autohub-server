const express = require("express");

const {
  listCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
} = require("../controllers/carController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", listCars);
router.get("/:id", getCar);
router.post("/", protect, createCar);
router.put("/:id", protect, updateCar);
router.delete("/:id", protect, deleteCar);

module.exports = router;
