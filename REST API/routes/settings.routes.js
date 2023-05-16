const Router = require("express")
const router = new Router()
const settingsCotroller = require("../controller/settings.controller")
const checkAuth = require("../utils/checkAuth")

router.post('/settings', settingsCotroller.createSettings)
router.get('/settings/id', checkAuth, settingsCotroller.getUserSettings)
router.put('/settings/lang', checkAuth, settingsCotroller.updateLanguage)
router.put('/settings/theme', checkAuth, settingsCotroller.updateTheme)
router.put('/settings/checkBoxes', checkAuth, settingsCotroller.updateCheckBoxes)
router.put('/settings/timePeriod', checkAuth, settingsCotroller.updateTimePeriod)

module.exports = router