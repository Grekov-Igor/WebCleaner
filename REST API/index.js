const express = require('express')
const userRouter = require('./routes/user.routes')
const PORT = 4444

const app = express()

app.use(express.json())
app.use('/api', userRouter)


app.listen(PORT, () => console.log("server started on port "+ PORT))
