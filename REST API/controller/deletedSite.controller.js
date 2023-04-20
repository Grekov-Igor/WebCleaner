const db = require('../db')


var pg = require('pg');
var types = pg.types;
types.setTypeParser(1114, function(stringValue) {
    return new Date(stringValue + "+0000");
});

class deletedSiteController {
    async createdeletedSite(req, res) {
        // const {wlUrl, userId} = req.body
        // const newItem =  await db.query(`insert into "WhiteList" ("wlUrl", "userId") values ($1, $2) returning *`, [wlUrl, userId])
        // res.json(newItem.rows[0])

        const {dsUrl, dsDate, userId, dsTitle} = req.body
        const newSite = await db.query(`insert into "deletedSite" ("dsUrl", "dsDate", "userId", "dsTitle") values ($1, $2, $3, $4) returning *`, [dsUrl, dsDate, userId, dsTitle])
        res.json(newSite.rows[0])
    }
    async getUserDeletedSites(req, res) {
        const id = req.params.id
        const items = await db.query('select * from "deletedSite" where "userId" = $1', [id])
        res.json(items.rows)
    }

    async getUserDates(req, res) {
        const id = req.params.id
        const dates = await db.query('select DISTINCT date("dsDate") as "date", "dsDate" from "deletedSite" where "userId" = $1', [id])
        res.json(dates.rows)
    }



}

module.exports = new deletedSiteController()