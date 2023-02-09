const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuid4 } = require("uuid");
const { request } = require("http");

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
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size,
        });

        const response = await file.save();
        res.json({
            file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
        });
    });
});

// send by email
router.post("/send", async (req, res) => {
    const { uuid, emailTo, emailFrom } = req.body;

    if (!uuid || !emailTo || !emailFrom)
        return res
            .status(422)
            .send({ success: false, message: "All fields are required" });

    try {
        const file = await File.findOne({ uuid: uuid });
        if (file.sender) {
            return res.status(422).send({ error: "Email already sent." });
        }

        // console.log(file);
        // return;
        file.sender = emailFrom;
        file.receiver = emailTo;
        const response = await file.save();

        // send email
        const sendMail = require("../services/emailService");
        sendMail({
            from: emailFrom,
            to: emailTo,
            subject: "Lets share files",
            text: `${emailFrom} shared a file with ${emailTo}`,
            html: require("../services/emailTemplate")({
                emailFrom: emailFrom,
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email`,
                size: parseInt(file.size / 1000) + " KB",
                expires: "24 hours",
            }),
        }).then((response) => {
            return res.status(200).send({ success: true });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).send({ error: 'Internal server error' });
        })

    } catch (error) {
        console.error(error)
        return res.status(500).send({ error: 'Internal server error' });
    }
});

module.exports = router;
