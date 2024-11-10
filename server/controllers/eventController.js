const Event = require("../models/event");
const { events } = require("../models/user");
const mongoose = require("mongoose");
const { populateDay } = require("../services/eventServices");
const { restart } = require("nodemon");

// create an event
const createEvent = async (req, res) => {
  const { location, date, eventManager, ageRange, users } = req.body;

  try {
    const newEvent = await Event.create({
      location,
      date,
      eventManager,
      ageRange,
      users,
    });
    res.status(200).json(newEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ mssg: error.message });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mssg: error.message });
  }
};

const randomEvent = async (req, res) => {
  try {
    populateDay("90278");
    res.status(200).json({ mssg: "Populate was called" });
  } catch (error) {
    res.status(500).json({ mssg: error.message });
  }
};

const getEventIdsByDate = async (req, res) => {
  const { date } = req.body;
  try {
    // Ensure the date is valid
    if (!Date.parse(date)) {
      throw new Error("Invalid date format. Use YYYY-MM-DD.");
    }

    // Convert the input date to the start and end of the day
    const queryDate = new Date(date);

    // Query events within the date range
    const events = await Event.find({
      date: {
        $gte: queryDate.setHours(0, 0, 0, 0), // Start of the day
        $lt: queryDate.setHours(23, 59, 59, 999), // End of the day
      },
    }).select("_id"); // Only select the _id field

    // Extract and return the event IDs
    const eventIds = events.map((event) => event._id.toString());
    res.status(200).json({ mssg: eventIds });
  } catch (error) {
    res.status(500).json({ mssg: error.message });
  }
};

module.exports = {
  createEvent,
  getEvent,
  randomEvent,
  getEventIdsByDate,
};
