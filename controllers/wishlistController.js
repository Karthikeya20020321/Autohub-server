const Wishlist = require("../models/Wishlist");

const getWishlist = async (req, res) => {
	try {
		const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("cars");

		res.json({
			success: true,
			cars: wishlist ? wishlist.cars : [],
		});
	} catch (error) {
		console.error("Get wishlist error:", error);

		res.status(500).json({
			success: false,
			message: "Unable to fetch wishlist",
		});
	}
};

const addToWishlist = async (req, res) => {
	try {
		const { carId } = req.body;

		if (!carId) {
			return res.status(400).json({
				success: false,
				message: "carId is required",
			});
		}

		const wishlist = await Wishlist.findOneAndUpdate(
			{ user: req.user._id },
			{ $addToSet: { cars: carId } },
			{ new: true, upsert: true, runValidators: true }
		).populate("cars");

		res.json({
			success: true,
			message: "Car added to wishlist",
			cars: wishlist.cars,
		});
	} catch (error) {
		console.error("Add to wishlist error:", error);

		res.status(500).json({
			success: false,
			message: "Unable to add car to wishlist",
		});
	}
};

const removeFromWishlist = async (req, res) => {
	try {
		const { carId } = req.params;

		const wishlist = await Wishlist.findOneAndUpdate(
			{ user: req.user._id },
			{ $pull: { cars: carId } },
			{ new: true }
		).populate("cars");

		if (!wishlist) {
			return res.status(404).json({
				success: false,
				message: "Wishlist not found",
			});
		}

		res.json({
			success: true,
			message: "Car removed from wishlist",
			cars: wishlist.cars,
		});
	} catch (error) {
		console.error("Remove from wishlist error:", error);

		res.status(500).json({
			success: false,
			message: "Unable to remove car from wishlist",
		});
	}
};

const checkWishlist = async (req, res) => {
	try {
		const wishlist = await Wishlist.findOne({
			user: req.user._id,
			cars: req.params.carId,
		}).select("_id");

		res.json({
			success: true,
			isWishlisted: Boolean(wishlist),
		});
	} catch (error) {
		console.error("Check wishlist error:", error);

		res.status(500).json({
			success: false,
			message: "Unable to check wishlist",
		});
	}
};

module.exports = {
	getWishlist,
	addToWishlist,
	removeFromWishlist,
	checkWishlist,
};
