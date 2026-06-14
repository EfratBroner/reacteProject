const Controller = require('./Controller.js');
const VolunteerService = require('../bll/VolunteerService.js');

class VolunteerController extends Controller {
    constructor() {
        super(VolunteerService);
    }

    async addVolunteer(req, res, next) {
        try {
            const result = await this.service.addVolunteer(req.body);
            return res.status(201).json(result);
        } catch (e) {
            next(e);
        }
    }

    async updateVolunteer(req, res, next) {
        try {
            const result = await this.service.updateVolunteer(req.params.id, req.body);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { email } = req.body;
            console.log("הנתונים שהתקבלו בשרת:", { email });
            const result = await this.service.resetPassword(email);
            console.log(result);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async findByEmail(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await this.service.findByEmail(email, password);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new VolunteerController();