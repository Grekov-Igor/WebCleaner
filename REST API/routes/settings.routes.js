const Router = require("express")
const router = new Router()
const settingsCotroller = require("../controller/settings.controller")

router.post('/settings', settingsCotroller.createSettings)
router.get('/settings/id=:id', settingsCotroller.getUserSettings)
router.put('/settings/lang', settingsCotroller.updateLanguage)
router.put('/settings/theme', settingsCotroller.updateTheme)
router.put('/settings/checkBoxes', settingsCotroller.updateCheckBoxes)
router.put('/settings/timePeriod', settingsCotroller.updateTimePeriod)

module.exports = router