const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
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
    collection: 'volunteers',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

volunteerSchema.virtual('completedRequests', {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'helpRequest', 
    localField: '_id',          
    foreignField: 'volunteerId',
    match: { status: 'הסתיים' }    
});

const volunteer = mongoose.model('volunteers', volunteerSchema);
module.exports = volunteer;