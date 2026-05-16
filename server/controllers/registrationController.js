const Event = require("../models/Event");
const Registration = require("../models/Registration");
const User = require("../models/User");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const { sendEmail } = require("../utils/sendEmail");
const { ticketConfirmationHTML } = require("../utils/emailTemplates");

const registerForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found. It may have been deleted." });
        }

        if (new Date(event.date) <= new Date()) {
            return res.status(400).json({ message: "This event has already passed and is no longer accepting registrations." });
        }

        if (event.registeredCount >= event.capacity) {
            return res.status(400).json({ message: `This event is fully booked (${event.capacity} spots). No more tickets available.` });
        }

        const existingRegistration = await Registration.findOne({
            event: req.params.id,
            attendee: req.user.id,
        });
        if (existingRegistration) {
            return res.status(409).json({ message: "You are already registered for this event. Check 'My Tickets' to view your booking." });
        }

        const ticketId = uuidv4();
        const qrCodeData = await QRCode.toDataURL(ticketId);

        const registration = new Registration({
            event: req.params.id,
            attendee: req.user.id,
            ticketId,
            qrCodeData,
        });
        await registration.save();

        event.registeredCount += 1;
        await event.save();

        const attendee = await User.findById(req.user.id);
        const qrCodeBase64 = qrCodeData.replace(/^data:image\/png;base64,/, "");

        (async () => {
            try {
                await sendEmail(attendee.email, "Your Ticket Confirmation", ticketConfirmationHTML(
                    attendee.name,
                    event.title,
                    event.date,
                    event.location,
                    ticketId,
                    qrCodeBase64
                ));
            } catch (emailError) {
                console.error("Failed to send confirmation email:", emailError);
            }
        })();

        res.status(201).json({ 
            message: "Registration successful!",
            ticketId,
            registration 
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Failed to register for event. Please try again." });
    }
};

const getMyTickets = async (req, res) => {
  try {
    const registrations = await Registration.find({ attendee: req.user.id }).populate("event");
    res.json(registrations);
  } catch (error) {
    console.error("Get tickets error:", error);
    res.status(500).json({ message: "Failed to fetch your tickets. Please try again." });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      event: req.params.id,
      attendee: req.user.id,
    });
    if (!registration) {
      return res.status(404).json({ message: "No registration found for this event." });
    }

    registration.status = "cancelled";
    await registration.save();

    await Event.findByIdAndUpdate(req.params.id, { $inc: { registeredCount: -1 } });

    res.json({ message: "Registration cancelled successfully. Your spot has been released." });
  } catch (error) {
    console.error("Cancel registration error:", error);
    res.status(500).json({ message: "Failed to cancel registration. Please try again." });
  }
};

module.exports = { registerForEvent, getMyTickets, cancelRegistration };