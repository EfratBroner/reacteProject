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
        _id: Number,
        namePriority: {
            type: String,
            enum: ['קריטית', 'גבוהה', 'בינונית', 'נמוכה']
        }
    },

    volunteerId: {
        type: Number,
        default: null
    }
}, {
    collection: 'helpRequest'
});

module.exports = mongoose.model('helpRequest', helpRequestsSchema);