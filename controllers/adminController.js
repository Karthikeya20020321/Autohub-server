const User = require("../models/User");

const getUsers = async (req, res) => {
	try {
		const users = await User.find().select("-password").sort({ createdAt: -1 });

		res.json({
			success: true,
			count: users.length,
			users,
		});
	} catch (error) {
		console.error("Get users error:", error);

		res.status(500).json({
			success: false,
			message: "Unable to fetch users",
		});
	}
};

const updateUserBlockStatus = async (req, res) => {
	try {
		const { isBlocked } = req.body;

		if (typeof isBlocked !== "boolean") {
			return res.status(400).json({
				success: false,
				message: "isBlocked must be a boolean",
			});
		}

		if (req.params.id === req.user.id) {
			return res.status(400).json({
				success: false,
				message: "You cannot block your own account",
			});
		}

		const user = await User.findByIdAndUpdate(
			req.params.id,
			{ isBlocked },
			{ new: true, runValidators: true }
		).select("-password");

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		res.json({
			success: true,
			message: isBlocked ? "User blocked" : "User unblocked",
			user,
		});
	} catch (error) {
		console.error("Update user block status error:", error);

		res.status(500).json({
			success: false,
			message: "Unable to update user status",
		});
	}
};

const deleteUser = async (req, res) => {
	try {
		if (req.params.id === req.user.id) {
			return res.status(400).json({
				success: false,
				message: "You cannot delete your own account",
			});
		}

		const user = await User.findByIdAndDelete(req.params.id);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		res.json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		console.error("Delete user error:", error);

		res.status(500).json({
			success: false,
			message: "Unable to delete user",
		});
	}
};

module.exports = {
	getUsers,
	updateUserBlockStatus,
	deleteUser,
};
