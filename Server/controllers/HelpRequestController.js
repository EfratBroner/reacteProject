const Controller = require('./Controller.js');
const HelpRequestService = require('../bll/HelpRequestService.js');

class HelpRequestController extends Controller {
    constructor() {
        super(HelpRequestService);
    }

    async byStatus(req, res, next) {
        try {
            const result = await this.service.byStatus(req.params.status);
            return res.json(result);
        } catch(e) {
            next(e);
        }
    }

    async byPriority(req, res, next) {
        try {
            const result = await this.service.byPriority(req.params.priority);
            return res.json(result);
        } catch(e) {
            next(e);
        }
    }

    async byLocation(req, res, next) {
        try {
            const result = await this.service.byLocation(req.params.location);
            return res.json(result);
        } catch(e) {
            next(e);
        }
    }

    async findAdvanced(req, res, next) {
        try {
            const result = await this.service.findAdvanced(req.query);
            return res.json(result);
        } catch(e) {
            next(e);
        }
    }

    async putStatus(req, res, next) {
        try {
            const result = await this.service.putStatus(req.params.idHelp, req.params.idVolunteer);
            return res.json(result);
        } catch(e) {
            next(e);
        }
    }

    async addHelpRequest(req, res, next) {
        try {
            const result = await this.service.addHelpRequest(req.body);
            return res.status(201).json(result);
        } catch(e) {
            next(e);
        }
    }

    async updateHelpRequest(req, res, next) {
        try {
            const result = await this.service.updateHelpRequest(req.params.id, req.body);
            return res.json(result);
        } catch(e) {
            next(e);
        }
    }

    async deleteHelpRequest(req, res, next) {
        try {
            const result = await this.service.deleteHelpRequest(req.params.id);
            return res.json(result);
        } catch(e) {
            next(e);
        }
    }
}

module.exports = new HelpRequestController();