const express = require("express");
const router = express.Router();
const { getMyTickets, cancelRegistration } = require("../controllers/registrationController");
const protect = require("../middleware/authMiddleware");

router.get("/my-tickets", protect, getMyTickets);
router.delete("/:id", protect, cancelRegistration);

module.exports = router;