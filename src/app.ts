import express, { Application } from "express"

import morgan from "morgan"
import helmet from "helmet"
import rateLimit from "express-rate-limit"

import connectDB from "./db/connect"
import authRouter from "./routes/auth"
import todoRouter from "./routes/todo"

const PORT = process.env.PORT || 8000 // default port to listen

require("dotenv").config()

const app: Application = express()

// secure endpoints for vulnerabilities
app.use(helmet())
const apiLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 50, // 50 requests per windowMs
})

app.use(apiLimiter)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(morgan("tiny"))

app.use("/auth", authRouter)
app.use("/list", todoRouter)

const start = async (): Promise<void> => {
	try {
		await connectDB(process.env.MONGO_URI)
		app.listen(PORT, () => {
			console.log(`Server is running on port: ${PORT}`)
		})
	} catch (error: any) {
		console.log(error)
	}
}

start()
