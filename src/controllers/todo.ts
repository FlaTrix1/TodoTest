import { Request, Response } from "express"
import { TodoListDocument, TodoListModel } from "../models/TodoList"
import { TodoModel, TodoDocument } from "../models/Todo"
import { AuthRequest } from "../middleware/auth"
import { ObjectId, Types, isValidObjectId } from "mongoose"
import { UserDocument, UserModel } from "../models/User"

export const getTodoList = async (req: Request, res: Response) => {
	try {
		const todoList: TodoListDocument | null = await TodoListModel.findOne({
			_id: req.params.id,
		})
			.select("-users")
			.populate("todos")
		if (!todoList) return res.status(404).send({ message: "List not found" })

		return res.status(200).send(todoList)
	} catch ({ message }) {
		return res.status(404).send({ message })
	}
}

export const createTodoList = async (req: AuthRequest, res: Response) => {
	try {
		const todoList: TodoListDocument = await TodoListModel.create({
			title: req.body.title,
			users: [req.user?._id],
		})

		const lists: ObjectId[][] = req.user?.lists!
		lists.push(todoList._id)

		req.user?.update({
			lists: lists,
		})

		await req.user?.save()

		res.status(201).send(todoList)
	} catch ({ message }) {
		return res.status(400).send({ message })
	}
}

export const createTodo = async (req: AuthRequest, res: Response) => {
	try {
		const todoList: TodoListDocument | null = await TodoListModel.findOne({
			users: req.user?._id,
			_id: req.params.id,
		})
		if (!todoList) return res.status(404).send({ message: "List not found" })

		const todo: TodoDocument = await TodoModel.create({
			title: req.body.title,
			description: req.body.description,
			deadline: req.body.deadline ? new Date(req.body.deadline) : null,
			state: req.body.state,
			createdBy: req.user?._id,
		})

		todoList.todos.push(todo._id)
		todoList.save()

		return res.status(200).send(todo)
	} catch ({ message }) {
		return res.status(404).send({ message })
	}
}

export const inviteTodoList = async (req: AuthRequest, res: Response) => {
	if (!req.body.user) return res.status(400).send()
	if (!isValidObjectId(req.body.user)) return res.status(400).send()

	try {
		const user: UserDocument | null = await UserModel.findOne({
			_id: req.body.user,
		})
		if (!user) return res.status(404).send({ message: "User not found" })

		const todoList: TodoListDocument | null = await TodoListModel.findOne({
			users: req.user?._id,
			_id: req.params.id,
		})
		if (!todoList) return res.status(404).send({ message: "List not found" })

		user.lists.push(todoList._id)
		user.save()
		todoList.users.push(req.body.user)
		todoList.save()
		return res.status(200).send()
	} catch ({ message }) {
		return res.status(400).send({ message })
	}
}

export const setTodoState = async (req: AuthRequest, res: Response) => {
	if (!req.body.state) return res.status(400).send({ error: "State not found" })
	if (!["planned", "active", "resolved", "canceled"].includes(req.body.state))
		return res.status(400).send({ error: "State not found" })

	try {
		const todoList: TodoListDocument | null = await TodoListModel.findOne({
			users: req.user?._id,
			_id: req.params.id,
		})
		if (!todoList) return res.status(404).send()

		const todo: TodoDocument = await TodoModel.findOneAndUpdate(
			{
				_id: req.params.idTodo,
			},
			{
				state: req.body.state,
			},
			{ new: true }
		)

		return res.status(200).send(todo)
	} catch ({ message }) {
		return res.status(404).send({ message })
	}
}
