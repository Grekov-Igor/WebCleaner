const Router = require("express")
const router = new Router()
const userCotroller = require("../controller/user.controller")
const checkAuth = require("../utils/checkAuth")


router.post('/user', userCotroller.createUser)
router.get('/user', userCotroller.getUsers)
router.get('/user/login=:login', userCotroller.getOneUserByLogin)
router.get('/user/id', checkAuth, userCotroller.getOneUserById)
router.post('/user/reg', userCotroller.registration)
router.post('/user/logIn', userCotroller.logIn)


module.exports = router
