const User = require("../model/userModel");
const Event = require("../model/eventModel");
const Notice = require("../model/noticeModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

// create token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "3d" });
};

// create admin
const createAdmin = async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  if (!email) {
    return res.json({ error: "please enter the email" });
  }
  if (!password) {
    return res.json({ error: "please enter the password" });
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // create user
  const user = await User.create({ email, password: hash });
  if (!user) {
    return res.json({ error: "user cannot be created" });
  }

  // create token
  try {
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// login admin

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: "please enter your email" });
  }
  if (!password) {
    return res.status(400).json({ error: "please enter your email" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "please enter the valid email" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (match) {
    // create a token
    const token = createToken(user._id);
    return res.status(200).json({ email, token });
  } else {
    return res.status(400).json({ error: "please enter valid password" });
  }
};

// create events
const createEvents = async (req, res) => {
  const { date, heading, description } = req.body;
  // console.log(date, heading, description);
  const createEvent = await Event.create({ date, heading, description });
  if (!createEvent) {
    return res.status(401).json({ error: "events could not be created" });
  }
  res.status(200).json({ msg: "event created successfully" });
};

// get all events

const getAllEvents = async (req, res) => {
  try {
    const getEvents = await Event.find({});
    res.json(getEvents);
  } catch (error) {
    console.log("error fetching events", error);
    res.status(401).json({ error: "could not fetch events" });
  }
};

const deleteEvents = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  try {
    const deleteEvent = await Event.findByIdAndDelete(id);
    if (!deleteEvent) {
      return res.status(401).json({ error: "events could not be found" });
    }
    res.status(200).json({ msg: "deleted event successfully" });
  } catch (error) {
    // console.log("error deleting events", error);
    res.status(200).json({ error: "internal server error" });
  }
};

// get a single event
const getEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const getEvent = await Event.findById(id);
    res.json(getEvent);
  } catch (error) {
    // console.log("error fetching events", error);
    res.status(401).json({ error: "could not fetch events" });
  }
};

const updateEvents = async (req, res) => {
  const { id } = req.params;
  const { date, heading, description } = req.body;
  try {
    const updateEvent = await Event.findByIdAndUpdate(
      id,
      {
        date,
        heading,
        description,
      },
      { new: true }
    );
    if (!updateEvent) {
      return res.status(401).json({ error: "events could not be found" });
    }
    res.status(200).json({ msg: "updated event successfully" });
  } catch (error) {
    // console.log("error updating events", error);
    res.status(401).json({ error: "internal server error" });
  }
};

// create notice
const createNotice = async (req, res) => {
  const { heading, description } = req.body;

  try {
    const createNotice = await Notice.create({
      heading,
      description,
      image: req.file.filename,
    });

    if (!createNotice) {
      res.status(401).json({ error: "notice could not be created" });
    }

    res.status(200).json({ msg: "notice created successfully" });
  } catch (error) {
    res.status(401).json({ error: "internal server error" });
  }
};

// get all notice

const getAllNotice = async (req, res) => {
  const getNotice = await Notice.find({});
  res.json(getNotice);
};

// get a notice
const getNotice = async (req, res) => {
  const { id } = req.params;

  try {
    const getNotice = await Notice.findById(id);
    res.json(getNotice);
  } catch (error) {
    console.log("error fetching notice", error);
    res.status(401).json({ error: "could not fetch notice" });
  }
};

// delete notice
const deleteNotice = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  // console.log(req.file);

  try {
    const imageName = await Notice.findById(id);
    // console.log(imageName.image);
    const filePath = path.join("./uploads", imageName.image);

    const deleteNotice = await Notice.findByIdAndDelete(id);
    if (!deleteNotice) {
      return res.status(401).json({ error: "notice could not be found" });
    }
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log("error deleting files");
      }
      // console.log("image deleted successfully");
      res.status(200).json({ msg: "deleted notice successfully" });
    });
  } catch (error) {
    // console.log("error deleting notices", error);
    res.status(200).json({ error: "internal server error" });
  }
};

// edit notice

const updateNotice = async (req, res) => {
  const { id } = req.params;

  const { heading, description } = req.body;

  try {
    const updateNotice = await Notice.findByIdAndUpdate(
      id,
      {
        heading,
        description,
        image: req.file.filename,
      },
      { new: true }
    );
    if (!updateNotice) {
      return res.status(401).json({ error: "notice could not be found" });
    }
    res.status(200).json({ msg: "updated noticec successfully" });
  } catch (error) {
    // console.log("error updating notice", error);
    res.status(401).json({ error: "internal server error" });
  }
};

module.exports = {
  createAdmin,
  loginAdmin,
  createEvents,
  getAllEvents,
  deleteEvents,
  updateEvents,
  getEvent,
  createNotice,
  getAllNotice,
  deleteNotice,
  getNotice,
  updateNotice,
};
