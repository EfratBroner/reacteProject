const mongoose = require('mongoose')

const volunteerSchema = new mongoose.Schema({
    _id: Number,
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['volunteer', 'admin'],
        default: 'volunteer'
    },
    specialties: [String],
}, {
    collection: 'volunteers'
})

const volunteer = mongoose.model('volunteers', volunteerSchema)

module.exports = volunteer;