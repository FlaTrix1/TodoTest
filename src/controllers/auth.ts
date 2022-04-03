import { Request, Response } from "express"
import { UserModel, UserDocument } from "../models/User"

export const register = async (req: Request, res: Response) => {
	const user: UserDocument = new UserModel(req.body)
	try {
		await user.save()
		user.generateAuthToken()

		// 201 user created
		res.status(201).send({ user })
	} catch (err: any) {
		// 409 email used
		if (err.code === 11000) {
			return res.status(409).send()
		}
		if (err.name === "ValidationError") {
			const errors: Array<any> = Object.values(err.errors)
			return res.status(400).send({ errors: errors.map((val) => val.message) })
		}

		// 400 on error
		res.status(400).send()
	}
}

export const login = async (req: Request, res: Response) => {
	try {
		const user: UserDocument = await UserModel.findByCredentials(
			req.body.email,
			req.body.password
		)
		user.generateAuthToken()

		res.send({ user })
	} catch (e) {
		res.status(404).send()
	}
}

// const user = async (req, res) => {
// 	const authHeader = req.headers.authorization
// 	if (!authHeader || !authHeader.startsWith("Bearer")) {
// 		return res.status(401).send({ error: "Please authenticate." })
// 	}
// 	const token = authHeader.split(" ")[1]

// 	try {
// 		const payload = jwt.verify(token, process.env.TOKEN_SECRET)

// 		const user = await User.findOne({ _id: payload._id, token })

// 		if (!user) {
// 			throw new Error()
// 		}

// 		res.status(200).send({ user })
// 	} catch (error) {
// 		return res.status(401).send({ error: "Please authenticate." })
// 	}
// }
