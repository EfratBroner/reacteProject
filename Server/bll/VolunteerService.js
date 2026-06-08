const Service = require('./Service.js')
const repo = require('../dal/volunteerRepo.js')
const nodemailer = require('nodemailer');

let numID = 2000

class VolunteerService extends Service {
    constructor() {
        super(repo)
    }

    async addVolunteer(volunteer) {
        try {
            volunteer._id = numID++
            volunteer.password = volunteer._id
            volunteer.role = 'volunteer'
            return await this.repo.addVolunteer(volunteer)
        } catch(err) {
            console.log(err)
            throw Error('error adding volunteer')
        }
    }

    async updateVolunteer(id, data) {
        try {
            delete data._id
            delete data.password
            delete data.role
            return await this.repo.updateVolunteer(id, data)
        } catch(err) {
            console.log(err)
            throw Error('error updating volunteer')
        }
    }

    async resetPassword(id, email) {
    try {
        const newPassword = numID++;
        await this.repo.updatePassword(id, newPassword); 
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'efrat0583228161@gmail.com',       
                pass: 'nfgr zzog vcgj pptm'        
            }
        });
        const mailOptions = {
            from: 'efrat0583228161@gmail.com',
            to: email, 
            subject: 'מערכת מתנדבים - סיסמה חדשה',
            text: `שלום, הסיסמה החדשה שלך למערכת היא: ${newPassword}`
        };
        await transporter.sendMail(mailOptions);

        return { success: true, message: "הסיסמה שונתה והמייל נשלח" };

    } catch (err) {
        console.log(err);
        throw Error('error resetting password');
    }
}
}

module.exports = new VolunteerService();