import { Router } from "express"
import {
	createTodo,
	createTodoList,
	getTodoList,
	setTodoState,
	inviteTodoList,
} from "../controllers/todo"
import { authMiddleware } from "../middleware/auth"
import { idMiddleware } from "../middleware/todo"

const router = Router()

router.route("/").post(authMiddleware, createTodoList)
router.route("/:id").get(idMiddleware, getTodoList)
router.route("/:id/todo").post(idMiddleware, authMiddleware, createTodo)
router.route("/:id/invite").post(idMiddleware, authMiddleware, inviteTodoList)
router
	.route("/:id/todo/:idTodo")
	.patch(idMiddleware, authMiddleware, setTodoState)

export default router
