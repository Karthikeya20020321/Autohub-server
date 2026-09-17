const Booking = require("../models/Booking");
const Car = require("../models/Car");

const createBooking = async (req, res) => {
	try {
		const { car, startDate, endDate, notes } = req.body;

		if (!car || !startDate || !endDate) {
			return res.status(400).json({
				success: false,
				message: "Car, start date and end date are required",
			});
		}

		const bookingStart = new Date(startDate);
		const bookingEnd = new Date(endDate);

		if (
			Number.isNaN(bookingStart.getTime()) ||
			Number.isNaN(bookingEnd.getTime()) ||
			bookingStart >= bookingEnd
		) {
			return res.status(400).json({
				success: false,
				message: "End date must be after start date",
			});
		}

		const selectedCar = await Car.findById(car);

		if (!selectedCar) {
			return res.status(404).json({
				success: false,
				message: "Car not found",
			});
		}

		if (selectedCar.available === false) {
			return res.status(409).json({
				success: false,
				message: "Car is not currently available",
			});
		}

		const totalDays = Math.ceil(
			(bookingEnd.getTime() - bookingStart.getTime()) / (1000 * 60 * 60 * 24)
		);

		const conflictingBooking = await Booking.findOne({
			car,
			status: { $in: ["pending", "confirmed"] },
			startDate: { $lt: bookingEnd },
			endDate: { $gt: bookingStart },
		});

		if (conflictingBooking) {
			return res.status(409).json({
				success: false,
				message: "Car is already booked for the selected dates",
			});
		}

		const booking = await Booking.create({
			user: req.user._id,
			car,
			startDate: bookingStart,
			endDate: bookingEnd,
			totalDays,
			totalPrice: totalDays * selectedCar.price,
			pickupLocation: selectedCar.location,
			notes: notes || "",
		});

		res.status(201).json({
			success: true,
			message: "Booking created successfully",
			booking,
		});
	} catch (error) {
		console.error("Create booking error:", error);

		res.status(500).json({
			success: false,
			message: "Unable to create booking",
		});
	}
};

const getMyBookings = async (req, res) => {
	try {
		const bookings = await Booking.find({ user: req.user._id })
			.populate("car")
			.sort({ createdAt: -1 });

		res.json({
			success: true,
			count: bookings.length,
			bookings,
		});
	} catch (error) {
		console.error("Get bookings error:", error);

		res.status(500).json({
			success: false,
			message: "Unable to fetch bookings",
		});
	}
};

const cancelBooking = async (req, res) => {
	try {
		const booking = await Booking.findOne({
			_id: req.params.id,
			user: req.user._id,
		});

		if (!booking) {
			return res.status(404).json({
				success: false,
				message: "Booking not found",
			});
		}

		if (!["pending", "confirmed"].includes(booking.status)) {
			return res.status(400).json({
				success: false,
				message: "This booking cannot be cancelled",
			});
		}

		booking.status = "cancelled";
		await booking.save();

		res.json({
			success: true,
			message: "Booking cancelled successfully",
			booking,
		});
	} catch (error) {
		console.error("Cancel booking error:", error);

		res.status(500).json({
			success: false,
			message: "Unable to cancel booking",
		});
	}
};

const getAllBookings = async (req, res) => {
	try {
		const bookings = await Booking.find()
			.populate("user", "name email phone")
			.populate("car")
			.sort({ createdAt: -1 });

		res.json({
			success: true,
			count: bookings.length,
			bookings,
		});
	} catch (error) {
		console.error("Get all bookings error:", error);

		res.status(500).json({
			success: false,
			message: "Unable to fetch all bookings",
		});
	}
};

const updateBookingStatus = async (req, res) => {
	try {
		const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];
		const { status } = req.body;

		if (!allowedStatuses.includes(status)) {
			return res.status(400).json({
				success: false,
				message: `Status must be one of: ${allowedStatuses.join(", ")}`,
			});
		}

		const booking = await Booking.findByIdAndUpdate(
			req.params.id,
			{ status },
			{ new: true, runValidators: true }
		)
			.populate("user", "name email phone")
			.populate("car");

		if (!booking) {
			return res.status(404).json({
				success: false,
				message: "Booking not found",
			});
		}

		res.json({
			success: true,
			message: "Booking status updated successfully",
			booking,
		});
	} catch (error) {
		console.error("Update booking status error:", error);

		res.status(500).json({
			success: false,
			message: "Unable to update booking status",
		});
	}
};

module.exports = {
	createBooking,
	getMyBookings,
	cancelBooking,
	getAllBookings,
	updateBookingStatus,
};
