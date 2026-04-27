const express = require("express");
const router = express.Router();
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require("../controllers/eventController");
const { registerForEvent } = require("../controllers/registrationController");
const protect = require("../middleware/authMiddleware");
const upload = require("../config/multer");

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/:id/register", protect, registerForEvent);
router.post("/", protect, upload.single("bannerImage"), createEvent);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

module.exports = router;