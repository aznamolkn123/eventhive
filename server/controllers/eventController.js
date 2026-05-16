const Event = require("../models/Event");

const getEvents = async (req, res) => {
  try {
    const filter = {};

    if (req.query.organiser) {
      filter.organiser = req.query.organiser;
    }

    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: "i" };
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.dateFrom) {
      filter.date = { ...filter.date, $gte: new Date(req.query.dateFrom) };
    }

    if (req.query.dateTo) {
      filter.date = { ...filter.date, $lte: new Date(req.query.dateTo) };
    }

    if (req.query.free === "true") {
      filter.price = 0;
    }

    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Failed to fetch events. Please try again." });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found. It may have been deleted or never existed." });
    }
    res.json(event);
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ message: "Failed to fetch event details." });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, category, date, location, capacity, price } = req.body;

    const eventData = {
      title,
      description,
      category,
      date,
      location,
      capacity,
      price,
      organiser: req.user.id,
    };

    if (req.file) {
      eventData.bannerImage = req.file.path.replace(/^public/, "");
    }

    const event = new Event(eventData);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error("Create event error:", error);

    if (error.name === "ValidationError") {
      const field = Object.keys(error.errors)[0];
      const fieldNames = {
        title: "Event title",
        description: "Event description",
        category: "Event category",
        date: "Event date",
        location: "Event location",
        capacity: "Event capacity",
        price: "Ticket price",
      };
      const niceField = fieldNames[field] || field;
      return res.status(400).json({ message: `${niceField} is required or invalid.` });
    }

    res.status(500).json({ message: "Failed to create event. Please try again." });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found. It may have been deleted." });
    }

    if (event.organiser.toString() !== req.user.id) {
      return res.status(403).json({ message: "You don't have permission to edit this event." });
    }

    const { title, description, category, date, location, capacity, price } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (category) event.category = category;
    if (date) event.date = date;
    if (location) event.location = location;
    if (capacity) event.capacity = parseInt(capacity);
    if (price !== undefined) event.price = parseFloat(price);

    if (req.file) {
      event.bannerImage = req.file.path.replace(/^public/, "");
    }

    await event.save();
    res.json(event);
  } catch (error) {
    console.error("Update event error:", error);

    if (error.name === "ValidationError") {
      const field = Object.keys(error.errors)[0];
      const fieldNames = {
        title: "Event title",
        description: "Event description",
        category: "Event category",
        date: "Event date",
        location: "Event location",
        capacity: "Event capacity",
        price: "Ticket price",
      };
      const niceField = fieldNames[field] || field;
      return res.status(400).json({ message: `Invalid ${niceField.toLowerCase()}.` });
    }

    res.status(500).json({ message: "Failed to update event. Please try again." });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found. It may have already been deleted." });
    }

    if (event.organiser.toString() !== req.user.id) {
      return res.status(403).json({ message: "You don't have permission to delete this event." });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Failed to delete event. Please try again." });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};