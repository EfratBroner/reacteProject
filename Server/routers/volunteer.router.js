const express = require('express')
const router = express.Router()
const controller = require('../controllers/VolunteerController.js')

router.get('/', controller.getAll)
router.post('/forgot-password', controller.resetPassword.bind(controller))
router.get('/:id', controller.ById)
router.post('/', controller.addVolunteer)
router.put('/:id', controller.updateVolunteer)
router.post('/findByEmail', controller.findByEmail)

module.exports = router;