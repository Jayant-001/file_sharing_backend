const connectDB = require('./config/db');
const File = require('./models/file');
const fs = require('fs');

connectDB();

// Get all records older than 24 hours 
async function fetchData() {
    // find file 24 hrs old
    const files = await File.find({ createdAt : { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000)} })
    if(files.length) {
        for (const file of files) {
            try {
                // remove file from folder
                fs.unlinkSync(file.path);
                // delete file data from DB
                await file.remove();
                console.log(`successfully deleted ${file.filename}`);
            } catch(err) {
                console.log(`error while deleting file ${err} `);
            }
        }
    }
    console.log('Job done!');
}

// terminal process
fetchData().then(process.exit);