const db = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {secret} = require('../config')

const generateAccessToken = (userId) => {
    const payload = {
        userId
    }
    return jwt.sign(payload, secret, {expiresIn: "30d"})
}



class userCotroller {
    async createUser(req, res) {
        const {userName, userSurname, userLogin, userPassword} = req.body
        // console.log(userId, userName, userSurname, userLogin, userPassword)
        // console.log(req.body)
        const newPerson = await db.query(`insert into "User" ("userName", "userSurname", "userLogin", "userPassword") values ($1, $2, $3, $4) returning *`, [userName, userSurname, userLogin, userPassword])
        res.json(newPerson.rows[0])
    }
    async getUsers(req, res) {
        const users = await db.query('select * from "User"')
        res.json(users.rows)
    }
    async getOneUserByLogin(req, res) {
        const login = req.params.login
        const users = await db.query('select * from "User" where "userLogin" = $1', [login])
        res.json(users.rows[0])
        
    }

    async getOneUserById(req, res) {
        // const id = req.params.id
        const id = req.userId
        // console.log(id)
        const users = await db.query('select * from "User" where "userId" = $1', [id])
        let user  = {
            userId: users.rows[0].userId,
            userName: users.rows[0].userName,
            userSurname: users.rows[0].userSurname
        }
        res.json(user)

        
    }

    async registration(req, res) {
         try {
            const {userName, userSurname, userLogin, userPassword, whiteLinks, blackLinks, language, timePeriod, lightTheme, checkBoxes} = req.body
            const users = await db.query('select * from "User" where "userLogin" = $1', [userLogin]) 
            const candidate = users.rows[0]
            // console.log(candidate)
            if(candidate) {
                return res.status(403).json({message: "A user with this login already exists"})
            }
            const hashPassword = bcrypt.hashSync(userPassword, 7); //хеширование пароля перед внесением в бд, 7 - степень хеширования
            // console.log(hashPassword)
            const newPerson = await db.query(`insert into "User" ("userName", "userSurname", "userLogin", "userPassword") values ($1, $2, $3, $4) returning *`, [userName, userSurname, userLogin, hashPassword])
            const user = await db.query('select * from "User" where "userLogin" = $1', [userLogin])
            const userId = user.rows[0].userId 
            const newSwttings = await db.query(`insert into "Settings" ("settingsCheckBoxes", "settingsLightTheme", "settingsEngLang", "settingsTimePeriod", "userId") values ($1, $2, $3, $4, $5) returning *`, [checkBoxes, lightTheme, language, timePeriod, userId])
            if(whiteLinks !== []) {
                for(let i=0; i<whiteLinks.length; i++) {
                    const newItem =  await db.query(`insert into "WhiteList" ("wlUrl", "userId") values ($1, $2) returning *`, [whiteLinks[i], userId])
                }
            }
            if(blackLinks !== []) {
                for(let i=0; i<blackLinks.length; i++) {
                    const newItem =  await db.query(`insert into "BlackList" ("blUrl", "userId") values ($1, $2) returning *`, [blackLinks[i], userId])
                }
            }
            return res.json({message: "The user has been successfully registered"})
         } catch(e) {
            res.status(400).json({message: "Registration error"})
         }
    }

    async logIn(req, res) {
        try {
            const {userLogin, userPassword} = req.body
            const users = await db.query('select * from "User" where "userLogin" = $1', [userLogin]) 
            const user = users.rows[0]
            if(!user) {
                return res.status(404).json({message: `A user with this login ${userLogin} was not found`})
            }
            const validPassword = bcrypt.compareSync(userPassword, user.userPassword)
            if(!validPassword) {
                return res.status(401).json({message: "Invalid password entered"})
            }
            const token = generateAccessToken(user.userId)
            return res.json({token})


        } catch(e) {
            res.status(401).json({message: "Login error"})
         }
    }



}

module.exports = new userCotroller()