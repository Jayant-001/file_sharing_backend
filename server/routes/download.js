const router = require('express').Router();
const File = require('../models/file')

router.get('/:uuid', async (req, res) => {

    const file = await File.findOne({uuid: req.params.uuid});
    if(!file) {
        return res.render('download', {error: "File not found"})
    }

    // return res.send("lksdj")
    // download file
    const filePath = `${__dirname}/../${file.path}`
    res.download(filePath)
})

module.exports = router