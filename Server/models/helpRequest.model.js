const mongoose = require('mongoose');

const helpRequestsSchema = new mongoose.Schema({
    _id: Number,

    location: {
        city: String,
        details: String
    },

    description: String,
    phone: String,

    status: {
        type: String,
        enum: ['ממתין', 'בטיפול', 'הסתיים'],
        default: 'ממתין'
    },

    numberOfPeopleStranded: Number,

    priority: {
        type: String,
        enum: ['נמוכה', 'בינונית', 'גבוהה', 'קריטית'],
        default: 'נמוכה'
    },

    volunteerId: {
        type: String,
        default: null
    }
}, {
    collection: 'helpRequest'
});

module.exports = mongoose.model('helpRequest', helpRequestsSchema);