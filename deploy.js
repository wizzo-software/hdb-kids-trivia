require('dotenv').config();
const ftp = require("basic-ftp");

async function uploadFiles() {
    const client = new ftp.Client();
    
    client.ftp.verbose = true;
    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: false, // שנה ל-true אם אתה משתמש ב-SFTP
            port: process.env.FTP_PORT || 21, // ברירת מחדל לפורט 21
            family: 4, // מוסיף העדפה ל-IPv4

        });

        // העלאת תיקיית dist אל השרת
        await client.uploadFromDir("./dist", process.env.FTP_PATH);
        console.log("Upload successful!");
    } catch (err) {
        console.error(err);
    }
    client.close();
}

uploadFiles();