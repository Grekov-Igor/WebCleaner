const express = require('express')
const userRouter = require('./routes/user.routes')
const settingsRouter = require('./routes/settings.routes')
const whiteListRouter = require('./routes/whiteList.routes')
const PORT = 4444

const app = express()

app.use(express.json())
app.use('/api', userRouter)
app.use('/api', settingsRouter)
app.use('/api', whiteListRouter)


app.listen(PORT, () => console.log("server started on port "+ PORT))
