const Car = require("../models/Car");

const listCars = async (req, res) => {
	try {
		const { search, brand, minPrice, maxPrice, available } = req.query;
		const filter = {};

		if (search) {
			const searchRegex = new RegExp(search, "i");
			filter.$or = [
				{ title: searchRegex },
				{ brand: searchRegex },
				{ model: searchRegex },
			];
		}

		if (brand) filter.brand = brand;
		if (available !== undefined) filter.available = available === "true";

		if (minPrice !== undefined || maxPrice !== undefined) {
			filter.price = {};
			if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
			if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
		}

		const cars = await Car.find(filter).populate("seller", "name email").sort({ createdAt: -1 });

		res.json({
			success: true,
			count: cars.length,
			cars,
		});
	} catch (error) {
		console.error("List cars error:", error);

		res.status(500).json({
			success: false,
			message: "Unable to fetch cars",
		});
	}
};

const getCar = async (req, res) => {
	try {
		const car = await Car.findById(req.params.id).populate("seller", "name email phone");

		if (!car) {
			return res.status(404).json({
				success: false,
				message: "Car not found",
			});
		}

		res.json({ success: true, car });
	} catch (error) {
		console.error("Get car error:", error);

		res.status(500).json({
			success: false,
			message: "Unable to fetch car",
		});
	}
};

const createCar = async (req, res) => {
	try {
		if (!['seller', 'admin'].includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: 'Only sellers and admins can create car listings',
			});
		}

		const { title, brand, model, year, price, description, images, available } = req.body;

		if (!title || !brand || !model || year === undefined || price === undefined) {
			return res.status(400).json({
				success: false,
				message: "Title, brand, model, year and price are required",
			});
		}

		if (Number(year) < 1886 || Number(price) < 0) {
			return res.status(400).json({
				success: false,
				message: "Year or price is invalid",
			});
		}

		const car = await Car.create({
			seller: req.user._id,
			title,
			brand,
			model,
			year: Number(year),
			price: Number(price),
			description: description || "",
			images: Array.isArray(images) ? images : [],
			available: available !== false,
		});

		res.status(201).json({
			success: true,
			message: "Car listed successfully",
			car,
		});
	} catch (error) {
		console.error("Create car error:", error);

		res.status(500).json({
			success: false,
			message: "Unable to create car listing",
		});
	}
};

const updateCar = async (req, res) => {
	try {
		const car = await Car.findById(req.params.id);

		if (!car) {
			return res.status(404).json({
				success: false,
				message: "Car not found",
			});
		}

		const isOwner = car.seller.toString() === req.user._id.toString();
		const isAdmin = req.user.role === "admin";

		if (!isOwner && !isAdmin) {
			return res.status(403).json({
				success: false,
				message: "You can only update your own car listings",
			});
		}

		const updates = { ...req.body };
		delete updates.seller;

		if (updates.year !== undefined) updates.year = Number(updates.year);
		if (updates.price !== undefined) updates.price = Number(updates.price);

		if (updates.year < 1886 || updates.price < 0) {
			return res.status(400).json({
				success: false,
				message: "Year or price is invalid",
			});
		}

		const updatedCar = await Car.findByIdAndUpdate(
			req.params.id,
			updates,
			{ new: true, runValidators: true }
		).populate("seller", "name email");

		res.json({
			success: true,
			message: "Car updated successfully",
			car: updatedCar,
		});
	} catch (error) {
		console.error("Update car error:", error);

		res.status(500).json({
			success: false,
			message: "Unable to update car",
		});
	}
};

const deleteCar = async (req, res) => {
	try {
		const car = await Car.findById(req.params.id);

		if (!car) {
			return res.status(404).json({
				success: false,
				message: "Car not found",
			});
		}

		const isOwner = car.seller.toString() === req.user._id.toString();
		const isAdmin = req.user.role === "admin";

		if (!isOwner && !isAdmin) {
			return res.status(403).json({
				success: false,
				message: "You can only delete your own car listings",
			});
		}

		await car.deleteOne();

		res.json({
			success: true,
			message: "Car deleted successfully",
		});
	} catch (error) {
		console.error("Delete car error:", error);

		res.status(500).json({
			success: false,
			message: "Unable to delete car",
		});
	}
};

module.exports = {
	listCars,
	getCar,
	createCar,
	updateCar,
	deleteCar,
};
