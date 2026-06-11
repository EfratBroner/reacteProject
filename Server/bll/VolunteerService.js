const Service = require('./Service.js')
const repo = require('../dal/volunteerRepo.js')
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// let numID = 2000

class VolunteerService extends Service {
    constructor() {
        super(repo)
    }

    async addVolunteer(volunteer) {
        try {
            const randomPassword = crypto.randomBytes(4).toString('hex');
            volunteer.password = randomPassword
            volunteer.role = 'volunteer'
            await this.repo.addVolunteer(volunteer)
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'efrat0583228161@gmail.com',
                    pass: 'nfgr zzog vcgj pptm'
                }
            });
            const mailOptions = {
                from: 'efrat0583228161@gmail.com',
                to: volunteer.email,
                subject: 'מערכת מתנדבים - נרשמת בהצלחה!',
                html: `
                    <div dir="rtl" style="font-family: Arial, sans-serif;">
                        <p style="font-size: 18px;">שלום ${volunteer.firstName},</p>
                        <p style="font-size: 16px;">תודה על הצטרפותך לחסד הלאומי!</p>
                        <p style="font-size: 16px;">הסיסמה שלך למערכת היא:</p>
                        <p style="font-size: 22px; font-weight: bold; letter-spacing: 2px;">${randomPassword}</p>
                    </div>`
            };
            await transporter.sendMail(mailOptions);
            return { success: true, message: "המתנדב נרשם והמייל נשלח" };
        } 
        catch (err) {
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
        } catch (err) {
            console.log(err)
            throw Error('error updating volunteer')
        }
    }

    async resetPassword(id, email) {
        try {
            const newPassword = crypto.randomBytes(4).toString('hex');
            console.log('id received:', id, 'email:', email);
            const volunteer = await this.repo.byId(id);
            console.log('volunteer found:', volunteer);
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
                html: `
                    <div dir="rtl" style="font-family: Arial, sans-serif;">
                        <p style="font-size: 18px;">שלום ${volunteer[0].firstName},</p>
                        <p style="font-size: 16px;">הסיסמה החדשה שלך למערכת היא:</p>
                        <p style="font-size: 22px; font-weight: bold; letter-spacing: 2px;">${newPassword}</p>
                    </div>
                `
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