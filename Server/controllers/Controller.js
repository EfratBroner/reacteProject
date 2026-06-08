const autoBind = require('auto-bind');

class Controller {
    constructor(service) {
        this.service = service
        autoBind(this);
    }

    async getAll(req, res, next) {
        try {
            const result = await this.service.getAll(req.query);
            return res.json(result);
        } catch(e) {
            next(e);
        }
    }

    async ById(req, res, next) {
        try {
            const result = await this.service.ById(req.params.id);
            return res.json(result);
        } catch(e) {
            next(e);
        }
    }
}

module.exports = Controller;