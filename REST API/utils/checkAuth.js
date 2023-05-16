const jwt = require('jsonwebtoken')
const {secret} = require('../config')

module.exports = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

    if(token) {
        // console.log(secret)
        try {
            const decoded = jwt.verify(token, secret)
            req.userId = decoded.userId
            // console.log(decoded)
            next()
        } catch(e) {
            // console.log("df")
            return res.status(403).json({message: "Нет доступа"})
        }
    } else {
        
        return res.status(403).json({message: "Нет доступа"})
    }
    // console.log(token)
}