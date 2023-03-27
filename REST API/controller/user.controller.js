const db = require('../db')

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
    async getOneUser(req, res) {
        const login = req.params.login
        const users = await db.query('select * from "User" where "userLogin" = $1', [login])
        res.json(users.rows[0])
        
    }
    async deleteUser(req, res) {
        
    }
    async updateUser(req, res) {
        
    }
}

module.exports = new userCotroller()