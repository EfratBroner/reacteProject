const Repository = require('./Repository.js')
const volunteer = require('../models/volunteer.model.js')
const autoBind = require('auto-bind');

class VolunteerRepo extends Repository {
    constructor() {
        super(volunteer)
    }

    async addVolunteer(volunteer) {
        try {
            return await this.model.create(volunteer);
        } catch (err) {
            console.log(err)
            throw Error('error adding volunteer')
        }
    }

    async updateVolunteer(id, data) {
        try {
            return await this.model.updateOne({ _id: id }, { $set: data });
        } catch (err) {
            console.log(err)
            throw Error('error updating volunteer')
        }
    }

    async findByEmail(email) {
        try {
            return await this.model.findOne({ email });
        } catch (err) {
            console.log(err);
            throw Error('error finding volunteer by email');
        }
    }

    async updatePassword(id, newPassword) {
    try {
        return await this.model.updateOne({ _id: id }, { $set: { password: newPassword } });
    } catch (err) {
        console.log(err);
        throw Error('error updating volunteer password');
    }
}

    async ById(id) {
        try {
            return await this.model.findById(id);
        } catch (err) {
            console.log(err);
            throw Error('error getting volunteer by id');
        }
    }
}

module.exports = new VolunteerRepo();