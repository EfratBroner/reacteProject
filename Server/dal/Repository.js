const autoBind = require('auto-bind');

class Repository {
    constructor(model) {
        this.model = model;
        autoBind(this)
    }

    async getAll(query) {
        try {
            return await this.model.find(query);
        } catch(err) {
            console.log(err)
            throw Error('error getting list of data')
        }
    }

    async byId(id) {
        try {
            return await this.model.find({ _id: id });
        } catch(err) {
            console.log(err)
            throw Error('error getting the data')
        }
    }

    async findByEmail(email){
        try {
            return await this.model.find({ email: email });
        } catch(err) {
            console.log(err)
            throw Error('error getting the data')
        }
    }

    async updateOne(id, data) {
        try {
            return await this.model.updateOne({ _id: id }, { $set: data });
        } catch(err) {
            console.log(err)
            throw Error('error updating the data')
        }
    }

    async deleteOne(id) {
        try {
            return await this.model.deleteOne({ _id: id });
        } catch(err) {
            console.log(err)
            throw Error('error deleting the data')
        }
    }
}

module.exports = Repository;