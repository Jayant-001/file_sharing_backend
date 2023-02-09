const router = require("express").Router();
const File = require("../models/file");

router.get("/:uuid", async (req, res) => {

  try {
    const file = await File.findOne({ uuid: req.params.uuid });

    if(!file) {
        return res.render("download", { error: "Link has been expired" });
    }

    // console.log(file.filename);

    return res.render('download', {
        uuid: file.uuid,
        fileName: file.filename,
        fileSize: file.size,
        downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
        // http://localhost:4000/files/download/skldjf-sdf0sdf-0sd-0f
    })

  } catch (error) {
    return res.render("download", { error: error.message });
  }

  res.send(req.params.uuid);
});

module.exports = router;
