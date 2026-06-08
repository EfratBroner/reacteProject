const Repository = require('./Repository.js')
const helpRequest = require('../models/helpRequest.model.js')
const autoBind = require('auto-bind');

class HelpRequestRepo extends Repository {
    constructor() {
        super(helpRequest)
    }

    async byStatus(status) {
        try {
            return await this.model.find({ status: status });
        } catch(err) {
            console.log(err)
            throw Error('error getting list of data')
        }
    }

    async byPriority(priority) {
        try {
            return await this.model.find({ 'priority.namePriority': priority });
        } catch(err) {
            console.log(err)
            throw Error('error getting list of data')
        }
    }

    async byLocation(location) {
        try {
            return await this.model.find({ 'location.city': location });
        } catch(err) {
            console.log(err)
            throw Error('error getting list of data')
        }
    }

    async findAdvanced(filters) {
        try {
            const { city, status, priority } = filters;
            let query = {};
            if (city) query['location.city'] = city;
            if (status) query.status = status;
            if (priority) query['priority.namePriority'] = priority;
            return await this.model.find(query);
        } catch(err) {
            console.log(err)
            throw Error('error filtering data')
        }
    }

    async putStatus(idHelp, idVolunteer) {
        try {
            const request = await this.model.findById(idHelp);
            if (!request) throw Error('Request not found');

            let nextStatus = '';
            if (request.status === 'ממתין') {
                nextStatus = 'בטיפול';
            } else if (request.status === 'בטיפול') {
                nextStatus = 'הסתיים';
            } else {
                return { message: 'הבקשה כבר הסתיימה' };
            }

            return await this.model.updateOne(
                { _id: idHelp },
                { $set: { status: nextStatus, volunteerId: idVolunteer } }
            );
        } catch(err) {
            console.log(err)
            throw Error('error updating the data')
        }
    }

    async addHelpRequest(helpRequest) {
        try {
            return await this.model.create(helpRequest);
        } catch(err) {
            console.log(err)
            throw Error('error adding help request')
        }
    }

    async updateHelpRequest(id, data) {
        try {
            return await this.model.updateOne({ _id: id }, { $set: data });
        } catch(err) {
            console.log(err)
            throw Error('error updating help request')
        }
    }

    async deleteHelpRequest(id) {
        try {
            return await this.model.deleteOne({ _id: id });
        } catch(err) {
            console.log(err)
            throw Error('error deleting help request')
        }
    }
}

module.exports = new HelpRequestRepo();