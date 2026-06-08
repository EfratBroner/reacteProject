const express = require('express')
const router = express.Router()
const controller = require('../controllers/HelpRequestController.js')

router.get('/', controller.getAll);
router.get('/status/:status', controller.byStatus)
router.get('/priority/:priority', controller.byPriority)
router.get('/location/:location', controller.byLocation)
router.get('/search', controller.findAdvanced)
router.put('/:idHelp/:idVolunteer', controller.putStatus)
router.post('/', controller.addHelpRequest)
router.put('/:id', controller.updateHelpRequest)
router.delete('/:id', controller.deleteHelpRequest)

module.exports = router;