import express from "express"
import dotenv from "dotenv"
import { initDB } from "./config/db.js"
import rateLimiter from "./middleware/rateLimiter.js"
import transactionsRoute from "./routes/transactionsRoute.js"
import authRouter from "./routes/authRoute.js";
import authorize from "./middleware/authMiddlewre.js"

dotenv.config()

const app = express()

app.use(rateLimiter)

app.use(express.json())

app.use('/api/auth', authRouter)

app.use(authorize)

app.use("/api/transactions", transactionsRoute)

initDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log("server is running on port 5001")
    })
})

