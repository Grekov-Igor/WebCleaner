const Router = require("express")
const router = new Router()
const whiteListCotroller = require("../controller/whiteList.controller")

router.post('/whiteList', whiteListCotroller.createListItem)
router.get('/whiteList/id=:id', whiteListCotroller.getUserItems)
router.delete('/whiteList/:id&:url', whiteListCotroller.deleteListItem)

module.exports = router