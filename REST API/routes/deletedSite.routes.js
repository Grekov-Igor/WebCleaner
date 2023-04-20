const Router = require("express")
const router = new Router()
const deletedSiteCotroller = require("../controller/deletedSite.controller")

router.post('/deletedSite', deletedSiteCotroller.createdeletedSite)
router.get('/deletedSite/id=:id', deletedSiteCotroller.getUserDeletedSites)
router.get('/deletedSite/dates/id=:id', deletedSiteCotroller.getUserDates)


module.exports = router