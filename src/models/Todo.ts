import { Schema, model, Document, ObjectId } from "mongoose"

enum TodoState {
	planned = "planned",
	active = "active",
	resolved = "resolved",
	canceled = "canceled",
}

export interface Todo {
	title: string
	description: string
	deadline: Date
	state: TodoState
	list: ObjectId
	createdBy: ObjectId
}

export interface TodoDocument extends Todo, Document {}

export const TodoSchema = new Schema<Todo>(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		deadline: {
			type: Date,
			required: true,
		},
		state: {
			type: String,
			enum: TodoState,
			default: TodoState.planned,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
	},
	{ timestamps: true }
)

export const TodoModel: any = model<TodoDocument>("Todo", TodoSchema)
