const Router = require("express")
const router = new Router()
const userCotroller = require("../controller/user.controller")

router.post('/user', userCotroller.createUser)
router.get('/user', userCotroller.getUsers)
router.get('/user/:login', userCotroller.getOneUser)
router.put('/user', userCotroller.updateUser)
router.delete('/user/:id', userCotroller.deleteUser)


module.exports = router
