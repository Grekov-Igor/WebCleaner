const db = require('../db')

class blackListController {
    async createListItem(req, res) {
        const {blUrl} = req.body
        const userId = req.userId
        const newItem =  await db.query(`insert into "BlackList" ("blUrl", "userId") values ($1, $2) returning *`, [blUrl, userId])
        res.json(newItem.rows[0])

    }

    async getUserItems(req, res) {
        const id = req.userId
        const items = await db.query('select * from "BlackList" where "userId" = $1', [id])
        res.json(items.rows)
    }

    async deleteListItem(req, res) {
        const userId = req.userId
        const url = req.params.url
        // console.log(req.params)
        const items = await db.query('delete from "BlackList" where "userId" = $1 and "blUrl" = $2', [userId, url])
        res.json(items.rows[0])

    }
}

module.exports = new blackListController()