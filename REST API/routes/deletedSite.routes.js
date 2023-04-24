const Router = require("express")
const router = new Router()
const deletedSiteCotroller = require("../controller/deletedSite.controller")

router.post('/deletedSite', deletedSiteCotroller.createdeletedSite)
router.get('/deletedSite/id=:id', deletedSiteCotroller.getUserDeletedSites)
// router.get('/deletedSite/dates/id=:id', deletedSiteCotroller.getUserDates)
router.get('/deletedSite/:id&:date', deletedSiteCotroller.getUserDeletedSitesForDate)
router.delete('/deletedSite/id=:id', deletedSiteCotroller.deleteSite)
router.delete('/deletedSite/userId=:userId', deletedSiteCotroller.deleteUserSites)
router.get('/deletedSite/exportXLSX/:id&:timeZoneOffset', deletedSiteCotroller.exportSitesXLSX)
router.get('/deletedSite/exportCSV/:id&:timeZoneOffset', deletedSiteCotroller.exportSitesCSV)

module.exports = router