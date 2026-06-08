require('dotenv').config()
const express = require('express')
const connectDB = require('./dal/db')
const volunteersRouter = require('./routers/volunteer.router.js')
const helpRequestRouter = require('./routers/helpRequestRouter.js')

const app = express()

// חיבור ל-DB
 connectDB()

// Middlewares
app.use(express.json()); // מאפשר לשרת לקרוא נתוני JSON שנשלחים ב-POST

// Enable CORS manually
const cors = require('cors')
// ולהחליף את השורות 16-21 ב:
app.use(cors())


// נתיבי ה-API (Resources) 
app.use('/api/volunteer', volunteersRouter)
app.use('/api/helpRequest', helpRequestRouter)

// טיפול בשגיאות 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
})

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})