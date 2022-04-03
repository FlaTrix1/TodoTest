import { Schema, model, Document, ObjectId } from "mongoose"

export interface TodoList {
	title: string
	users: Array<ObjectId>
	todos: Array<ObjectId>
}

export interface TodoListDocument extends TodoList, Document {}

const TodoListSchema = new Schema<TodoList>(
	{
		title: {
			type: String,
			required: true,
		},
		users: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		todos: [
			{
				type: Schema.Types.ObjectId,
				ref: "Todo",
			},
		],
	},
	{ timestamps: true }
)

// TodoListSchema.virtual("todos", {
// 	ref: "Todo",
// 	localField: "_id",
// 	foreignField: "list",
// })

export const TodoListModel = model<TodoListDocument>("TodoList", TodoListSchema)
