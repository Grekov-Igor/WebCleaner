const Router = require("express")
const router = new Router()
const whiteListCotroller = require("../controller/whiteList.controller")
const checkAuth = require("../utils/checkAuth")

router.post('/whiteList', checkAuth, whiteListCotroller.createListItem)
router.get('/whiteList/id', checkAuth, whiteListCotroller.getUserItems)
router.delete('/whiteList/:url', checkAuth, whiteListCotroller.deleteListItem)

module.exports = router