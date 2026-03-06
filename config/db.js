const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri || uri.trim() === '') {
        console.error('Error: MONGO_URI is not set in .env');
        console.error('Add MONGO_URI to your .env file. Examples:');
        console.error('  Local:  MONGO_URI=mongodb://localhost:27017/your_db_name');
        console.error('  Atlas:  MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>');
        process.exit(1);
    }
    try {
        await mongoose.connect(uri);
        console.log("MongoDB Connected!");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        if (error.message.includes('querySrv ENOTFOUND')) {
            console.error('Check MONGO_URI in .env: use a valid host (e.g. localhost or your Atlas cluster hostname).');
        }
        process.exit(1);
    }
};

module.exports = connectDB;