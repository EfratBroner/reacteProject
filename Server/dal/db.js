
const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/volunteering');
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('Connection Failed:', err.message);
        process.exit(1); 
    }
};

module.exports = connectDB;