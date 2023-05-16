const Router = require("express")
const router = new Router()
const blackListCotroller = require("../controller/blackList.controller")
const checkAuth = require("../utils/checkAuth")

router.post('/blackList', checkAuth, blackListCotroller.createListItem)
router.get('/blackList/id', checkAuth, blackListCotroller.getUserItems)
router.delete('/blackList/:url', checkAuth, blackListCotroller.deleteListItem)

module.exports = router