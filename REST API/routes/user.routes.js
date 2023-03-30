const Router = require("express")
const router = new Router()
const userCotroller = require("../controller/user.controller")

router.post('/user', userCotroller.createUser)
router.get('/user', userCotroller.getUsers)
router.get('/user/login=:login', userCotroller.getOneUserByLogin)
router.get('/user/id=:id', userCotroller.getOneUserById)
router.put('/user', userCotroller.updateUser)
router.delete('/user/id=:id', userCotroller.deleteUser)


module.exports = router
