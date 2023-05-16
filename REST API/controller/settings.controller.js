const db = require('../db')

class settingsController {
    async createSettings(req, res) {
        const {settingsCB, settingsLT, settingsEng, settingsTime, userId} = req.body
        // console.log(settingsCB, settingsLT, settingsEng, settingsTime, userId)
        const newSettings = await db.query(`insert into "Settings" ("settingsCheckBoxes", "settingsLightTheme", "settingsEngLang", "settingsTimePeriod", "userId") values ($1, $2, $3, $4, $5) returning *`, [settingsCB, settingsLT, settingsEng, settingsTime, userId])
        res.json(newSettings.rows[0])
    }

    async getUserSettings(req, res) {
        const id = req.userId
        const settings = await db.query('select * from "Settings" where "userId" = $1', [id])
        res.json(settings.rows[0])
    }

    async updateLanguage(req, res) {
        const {settingsEng} = req.body
        const userId = req.userId
        // console.log(settingsId, settingsEng)
        const settings = await db.query(`update "Settings" set "settingsEngLang" = $1 where "userId" = $2 returning *`, [settingsEng, userId])
        res.json(settings.rows[0])

    }

    async updateTheme(req, res) {
        const {settingsLight} = req.body
        const userId = req.userId
        // console.log(settingsId, settingsLight)
        const settings = await db.query(`update "Settings" set "settingsLightTheme" = $1 where "userId" = $2 returning *`, [settingsLight, userId])
        res.json(settings.rows[0])

    }

    async updateCheckBoxes(req, res) {
        const {settingsCheckBoxes} = req.body
        const userId = req.userId
        const settings = await db.query(`update "Settings" set "settingsCheckBoxes" = $1 where "userId" = $2 returning *`, [settingsCheckBoxes, userId])
        res.json(settings.rows[0])
    }

    async updateTimePeriod(req, res) {
        const {settingsTimePeriod} = req.body
        const userId = req.userId
        const settings = await db.query(`update "Settings" set "settingsTimePeriod" = $1 where "userId" = $2 returning *`, [settingsTimePeriod, userId])
        res.json(settings.rows[0])
    }
}

module.exports = new settingsController()