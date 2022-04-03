import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

import { UserDocument, UserModel } from "../models/User"

export interface AuthRequest extends Request {
	user?: UserDocument
}

export const authMiddleware = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.authorization
	if (!authHeader || !authHeader.startsWith("Bearer")) {
		return res.status(401).send({ error: "Please authenticate." })
	}
	const token = authHeader.split(" ")[1]

	try {
		const { _id } = jwt.verify(
			token,
			`${process.env.TOKEN_SECRET}`
		) as JwtPayload

		const user: UserDocument = await UserModel.findOne({ _id, token })

		if (!user) {
			throw new Error()
		}

		req.user = user
		next()
	} catch (error) {
		return res.status(401).send({ error: "Please authenticate." })
	}
}
