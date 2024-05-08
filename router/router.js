const {
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
} = require("../controller/route-controller");
const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../backend/uploads");
  },
  filename: function (req, file, cb) {
    // Generate a unique filename with the original extension
    const uniqueFilename = Date.now() + "--" + file.originalname;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });

// router.get("/", (req, res) => {
//   res.json({ msg: "welcome to router" });
// });

// login admin
router.post("/login", loginAdmin);

// create admin
router.post("/create-admin", createAdmin);

// post events
router.post("/create-event", createEvents);

// get all events
router.get("/events", getAllEvents);

// get a event
router.get("/a-event/:id", getEvent);

// delete events
router.delete("/delete-event/:id", deleteEvents);

// update events
router.patch("/update/:id", updateEvents);

// create notice
router.post("/create-notice", upload.single("image"), createNotice);

// get all notice

router.get("/get-notice", getAllNotice);

// get a notice
router.get("/a-notice/:id", getNotice);

// delete notice
router.delete("/delete-notice/:id", deleteNotice);

// edit notice
router.patch("/update-notice/:id", upload.single("image"), updateNotice);

module.exports = router;
