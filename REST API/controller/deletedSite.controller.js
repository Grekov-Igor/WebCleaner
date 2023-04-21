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

    async getUserDeletedSitesForDate(req, res) {
        const id = req.params.id
        let date = req.params.date
        date = new Date(date)
        // date.setTime(date.getTime() - date.getTimezoneOffset()*60*1000);
        // console.log(date.toISOString().replace("T", " "))
        const dateSQL = date.toISOString().replace("T", " ")
        let datePlusOne = date
        datePlusOne.setDate(date.getDate() + 1)
        // console.log(datePlusOne.toISOString().replace("T", " "))

        // const dateSQL = date.toISOString().replace("T", " ")
        // console.log(dateSQL)
        const datePlusOneSQL = datePlusOne.toISOString().replace("T", " ")
        // console.log(dateSQL, datePlusOneSQL)
        const items = await db.query(`select * from "deletedSite" where "userId" = $1 and "dsDate" >= $2 and "dsDate" < $3`, [id, dateSQL, datePlusOneSQL])
        res.json(items.rows)
        // res.json("1");
    }


    // async getUserDates(req, res) {
    //     const id = req.params.id
    //     const dates = await db.query('select DISTINCT date("dsDate") as "date" from "deletedSite" where "userId" = $1', [id])
    //     res.json(dates.rows)
    // }

    // async getUserDates(req, res) {
    //     const id = req.params.id
    //     const items = await db.query('select * from "deletedSite" where "userId" = $1', [id])
    //     // console.log(new Date("2023-04-20T21:18:47.558Z"))
    //     res.json(new Date(items.rows[0].dsDate))
    //     // res.json(items.rows)
    // }



}

module.exports = new deletedSiteController()