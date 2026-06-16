const Service = require('./Service.js')
const repo = require('../dal/volunteerRepo.js')
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const volunteer = require('../models/volunteer.model.js');

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
                    user: 'mitnadvim.system@gmail.com',
                    pass: 'ruyj wjex ahwt gcah'
                }
            });
            const mailOptions = {
                from: 'mitnadvim.system@gmail.com',
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

    async resetPassword(email) {
        try {
            const volunteer = await this.repo.findByEmail(email);
            if (!volunteer)
                return { success: false, message: "האימייל לא נמצא במערכת" };
            const newPassword = crypto.randomBytes(4).toString('hex');
            await this.repo.updatePassword(volunteer._id, newPassword);
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'mitnadvim.system@gmail.com',
                    pass: 'ruyj wjex ahwt gcah'
                }
            });
            await transporter.sendMail({
                from: 'מערכת מתנדבים',
                to: email,
                subject: 'מערכת מתנדבים - סיסמה חדשה',
                html: `<div dir="rtl" style="font-family: Arial, sans-serif;">
                    <p style="font-size: 18px;">שלום ${volunteer.firstName},</p>
                    <p style="font-size: 16px;">הסיסמה החדשה שלך למערכת היא:</p>
                    <p style="font-size: 22px; font-weight: bold; letter-spacing: 2px;">${newPassword}</p>
                </div>`
            });
            return { success: true, message: "הסיסמה שונתה והמייל נשלח" };
        } catch (err) {
            console.log(err);
            return { success: false, message: "שגיאה באיפוס הסיסמה" };
        }
    }

    async findByEmail(email, password){
        try{
           const volunteer = await this.repo.findByEmail(email);
           console.log('volunteer from DB:', volunteer);
           console.log('password received:', password);
           console.log('password in DB:', volunteer?.password);
           if(!volunteer)
               return {success: false, message: "האימייל לא קיים"}
           if(volunteer.password===password)
               return {success: true, message: "הסיסמה תקינה", volunteer}
           else
               return {success: false, message: "שגויה הסיסמה"}
        }
        catch(error){
            console.log(error);
            return {success: false, message: "האימייל לא קיים"}
        }
    }

     async ById(id) {
        try{
        return await this.repo.ById(id);}
        catch(err){
            console.log(err)
            throw Error('error getting the data by id')}
    }
}

module.exports = new VolunteerService();