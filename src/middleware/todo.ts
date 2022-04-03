import { Request, Response, NextFunction } from "express"
import { isValidObjectId } from "mongoose"

export const idMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const id: any = req.params.id

	if (!isValidObjectId(id)) return res.status(400).send()

	next()
}
