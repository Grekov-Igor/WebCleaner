const Router = require("express")
const router = new Router()
const deletedSiteCotroller = require("../controller/deletedSite.controller")
const checkAuth = require("../utils/checkAuth")

router.post('/deletedSite', checkAuth, deletedSiteCotroller.createDeletedSite)
router.get('/deletedSite/id', checkAuth, deletedSiteCotroller.getUserDeletedSites)
// router.get('/deletedSite/dates/id=:id', deletedSiteCotroller.getUserDates)
router.get('/deletedSite/date=:date', checkAuth, deletedSiteCotroller.getUserDeletedSitesForDate)
router.delete('/deletedSite/id=:id', checkAuth, deletedSiteCotroller.deleteSite)
router.delete('/deletedSite/userId', checkAuth, deletedSiteCotroller.deleteUserSites)
router.get('/deletedSite/exportXLSX/:id&:timeZoneOffset', deletedSiteCotroller.exportSitesXLSX)
router.get('/deletedSite/exportCSV/:id&:timeZoneOffset', deletedSiteCotroller.exportSitesCSV)

module.exports = router