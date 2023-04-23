const db = require('../db')
const excelJs = require("exceljs")
var fs = require("fs")

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

        const dateSQL = date.toISOString().replace("T", " ")
        let datePlusOne = date
        datePlusOne.setDate(date.getDate() + 1)

        const datePlusOneSQL = datePlusOne.toISOString().replace("T", " ")

        const items = await db.query(`select * from "deletedSite" where "userId" = $1 and "dsDate" >= $2 and "dsDate" < $3 ORDER BY "dsDate"`, [id, dateSQL, datePlusOneSQL])
        res.json(items.rows)

    }

    async deleteSite(req, res) {
        const dsId = req.params.id
        const item = await db.query('delete from "deletedSite" where "dsId" = $1', [dsId])
        res.json(item.rows[0])
    }

    async deleteUserSites(req, res) {
        const userId = req.params.id
        const item = await db.query('delete from "deletedSite" where "userId" = $1', [userId])
        res.json(item.rows[0])
    }
   
    async exportSitesXLSX(req, res) {

        const id = req.params.id
        const timeZoneOffset = req.params.timeZoneOffset
        const items = await db.query('select * from "deletedSite" where "userId" = $1 ORDER BY "dsDate"', [id])

        let sites = items.rows


        const workbook = new excelJs.Workbook();
        const worksheet = workbook.addWorksheet('Journal');

        worksheet.columns = [
          { header: 'title', key: 'title', width: 90},
          { header: 'url', key: 'url', width: 50},
          { header: 'date', key: 'date', width: 10},
          { header: 'time', key: 'time', width: 10, style: { numFmt: 'hh:mm' }}
        ];

        for(let i=0; i<sites.length; i++) {
            let date = new Date(sites[i].dsDate)

            // чтоб получить дату в текущем часовом поясе
            const dateCopy = new Date(date);
            dateCopy.setTime(dateCopy.getTime() - timeZoneOffset*60*1000);
            date = dateCopy

            worksheet.addRow({
                title: sites[i].dsTitle,
                url: sites[i].dsUrl,
                date: date,
                time: date,

            }).commit();
        }

       

        res.setHeader(
            "Content-Type",
            "application/vnd.openxm1formats-officedocument.spreadsheetml.sheet"

        );
        res.setHeader(
            "Content-Disposition",
            "attachment;filename="+"Journal.xlsx"
        );


        await workbook.xlsx.write(res)

    }



}

module.exports = new deletedSiteController()