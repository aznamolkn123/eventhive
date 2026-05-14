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
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.date <= new Date()) {
            return res.status(400).json({ message: "Event has already passed" });
        }

        if (event.registeredCount >= event.capacity) {
            return res.status(400).json({ message: "Event is full" });
        }

        const existingRegistration = await Registration.findOne({
            event: req.params.id,
            attendee: req.user.id,
        });
        if (existingRegistration) {
            return res.status(409).json({ message: "Already registered" });
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

        res.status(201).json(registration);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getMyTickets = async (req, res) => {
  try {
    const registrations = await Registration.find({ attendee: req.user.id }).populate("event");
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      event: req.params.id,
      attendee: req.user.id,
    });
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    registration.status = "cancelled";
    await registration.save();

    await Event.findByIdAndUpdate(req.params.id, { $inc: { registeredCount: -1 } });

    res.json({ message: "Registration cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerForEvent, getMyTickets, cancelRegistration };