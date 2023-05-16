const db = require('../db')

class whiteListController {
    async createListItem(req, res) {
        const {wlUrl} = req.body
        const userId = req.userId
        const newItem =  await db.query(`insert into "WhiteList" ("wlUrl", "userId") values ($1, $2) returning *`, [wlUrl, userId])
        res.json(newItem.rows[0])

    }

    async getUserItems(req, res) {
        const id = req.userId
        const items = await db.query('select * from "WhiteList" where "userId" = $1', [id])
        res.json(items.rows)
    }

    async deleteListItem(req, res) {
        const userId = req.userId
        const url = req.params.url
        // console.log(req.params)
        const items = await db.query('delete from "WhiteList" where "userId" = $1 and "wlUrl" = $2', [userId, url])
        res.json(items.rows[0])

    }
}

module.exports = new whiteListController()