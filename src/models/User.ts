import { Schema, model, Document, ObjectId } from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import validator from "validator"

export interface User {
	email: string
	token?: string

	password?: string

	lists: Array<ObjectId>[]
}

export interface UserDocument extends User, Document {
	generateAuthToken(): void
	findByCredentials(): Promise<UserDocument>
}

const UserSchema = new Schema<User>(
	{
		email: {
			type: String,
			required: true,
			validate(value: string): void {
				if (!validator.isEmail(value)) {
					throw new Error("Email is invalid")
				}
			},
		},
		password: {
			type: String,
			required: true,
			minlength: 7,
		},

		token: {
			type: String,
		},

		lists: [
			{
				type: Schema.Types.ObjectId,
				ref: "TodoList",
			},
		],
	},

	{
		timestamps: false,
	}
)

UserSchema.methods.generateAuthToken = async function (): Promise<string> {
	// generate jwt token and save to db
	const token: string = jwt.sign(
		{ _id: this._id.toString() },
		`${process.env.TOKEN_SECRET}`,
		{ expiresIn: "3h" }
	)

	this.token = token
	await this.save()
	return token
}

UserSchema.methods.toJSON = function (): User {
	const userObject: User = this.toObject()

	delete userObject.password

	return userObject
}

UserSchema.statics.findByCredentials = async (
	email,
	password
): Promise<UserDocument> => {
	const user: UserDocument | null = await UserModel.findOne({ email })

	if (!user) {
		throw new Error("Unable to login")
	}

	const isMatch = await bcrypt.compare(password, user.password!)
	if (!isMatch) {
		throw new Error("Unable to login")
	}

	return user
}

UserSchema.pre("save", function (next) {
	if (this.isModified("password")) {
		this.password = bcrypt.hashSync(this.password!, 8)
	}

	next()
})

export const UserModel: any = model<UserDocument>("User", UserSchema)
