const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuid4 } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

// upload
let upload = multer({
  storage: storage,
  limit: { fileSize: 1000000 * 10 },
}).single("myfile");

router.post("/", (req, res) => {
  // store file
  upload(req, res, async (err) => {
    // validate request
    if (!req.file) {
      return res.json({ error: "All files are required" });
    }

    if (err) return res.status(500).send({ error: err.message });

    // store to DB
    const file = new File({
      filename: req.path.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save();
    res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
  });
});

module.exports = router;
