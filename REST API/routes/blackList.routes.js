const Router = require("express")
const router = new Router()
const blackListCotroller = require("../controller/blackList.controller")

router.post('/blackList', blackListCotroller.createListItem)
router.get('/blackList/id=:id', blackListCotroller.getUserItems)
router.delete('/blackList/:id&:url', blackListCotroller.deleteListItem)

module.exports = router