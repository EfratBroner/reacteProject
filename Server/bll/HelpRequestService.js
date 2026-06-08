const Service = require('./Service.js')
const repo = require('../dal/HelpRequestRepo.js')

class HelpRequestService extends Service {
    constructor() {
        super(repo)
    }

    async byStatus(status) {
        try {
            return await this.repo.byStatus(status)
        } catch(err) {
            console.log(err)
            throw Error('error getting list of data')
        }
    }

    async byPriority(priority) {
        try {
            return await this.repo.byPriority(priority)
        } catch(err) {
            console.log(err)
            throw Error('error getting list of data')
        }
    }

    async byLocation(location) {
        try {
            return await this.repo.byLocation(location)
        } catch(err) {
            console.log(err)
            throw Error('error getting list of data')
        }
    }

    async findAdvanced(filters) {
        try {
            return await this.repo.findAdvanced(filters)
        } catch(err) {
            console.log(err)
            throw Error('error getting list of data')
        }
    }

    async putStatus(idHelp, idVolunteer) {
        try {
            return await this.repo.putStatus(idHelp, idVolunteer)
        } catch(err) {
            console.log(err)
            throw Error('error in update status')
        }
    }

    async addHelpRequest(helpRequest) {
        try {
            // id אוטומטי — הכי גדול שיש + 1
            const all = await this.repo.getAll({})
            const maxId = Math.max(...all.map(h => h._id))
            helpRequest._id = maxId + 1
            helpRequest.status = 'ממתין'
            helpRequest.volunteerId = null
            return await this.repo.addHelpRequest(helpRequest)
        } catch(err) {
            console.log(err)
            throw Error('error adding help request')
        }
    }

    async updateHelpRequest(id, data) {
        try {
            delete data._id
            return await this.repo.updateHelpRequest(id, data)
        } catch(err) {
            console.log(err)
            throw Error('error updating help request')
        }
    }

    async deleteHelpRequest(id) {
        try {
            return await this.repo.deleteHelpRequest(id)
        } catch(err) {
            console.log(err)
            throw Error('error deleting help request')
        }
    }
}

module.exports = new HelpRequestService()