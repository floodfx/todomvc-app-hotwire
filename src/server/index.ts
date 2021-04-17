import path from "path"
import express, { Application, Request, Response } from 'express'
import bodyParser from 'body-parser';
import * as Eta from "eta";
import { Todo } from "../models/Todo";
import { Todos } from "../models/Todos";

const publicPath = path.join(__dirname, "../..", "dist");
const viewsPath = path.join(__dirname, "..", "views");

Eta.configure({
	views: viewsPath
})

const app: Application = express()

app.use(express.static(publicPath))
app.use(bodyParser.urlencoded({ extended: true }));
app.engine("eta", Eta.renderFile)
app.set("views", viewsPath)
app.set("view engine", "eta")

var todos = new Todos()

app.get('/', (req: Request, res: Response) => {
	const filter = req.query.filter;
	res.render("index", { todos, filter })
})

app.get('/todos', (req: Request, res: Response) => {
	const filter = req.query.filter as string;
	res.render("todos/todos", { todos: todos.filter(filter), filter })
})

app.get('/todoStats', (req: Request, res: Response) => {
	const showStats = todos.filter().length > 0;
	const remainingCount = todos.filter().filter(t => !t.completed).length;
	const filter = req.query.filter as string;

	if (req.accepts("text/vnd.turbo-stream.html")) {
		res.type("text/vnd.turbo-stream.html") // set proper mime type
		res.render("todos/replace_stats", { showStats, remainingCount, filter, dom_target: "todoStatsFooter" })
	} else {
		res.render("todos/stats", { showStats, remainingCount, filter })
	}
})

app.post('/todo', (req: Request, res: Response) => {
	const todo = todos.add(req.body.title)

	// optionally return turbo-stream if accepted
	if (req.accepts("text/vnd.turbo-stream.html")) {
		res.type("text/vnd.turbo-stream.html") // set proper mime type
		res.render("todo/new_todo", { ...todo, dom_target: "todos_list" })
	} else {
		res.redirect("/todos")
	}

})

app.patch('/todo/:id', (req: Request, res: Response) => {

	var todo: Todo | undefined;
	if (req.body.title) {
		todo = todos.update(parseInt(req.params.id), { title: req.body.title })
	} else if (req.body.completed) {
		todo = todos.update(parseInt(req.params.id), { completed: req.body.completed === 'true' })
	}

	const showStats = todos.filter().length > 0;
	const remainingCount = todos.filter().filter(t => !t.completed).length;
	const filter = req.query.filter as string;

	// optionally return turbo-stream if accepted
	if (todo && req.accepts("text/vnd.turbo-stream.html")) {
		res.type("text/vnd.turbo-stream.html") // set proper mime type
		res.render("todo/replace_todo_and_stats", { ...todo, replace_todo_dom_target: `todo_${todo.id}`, showStats, remainingCount, filter, replace_stats_dom_target: `todoStatsFooter` })
	} else {
		res.redirect("/todos")
	}

})

app.delete('/todo/:id', (req: Request, res: Response) => {

	todos.remove(parseInt(req.params.id))

	// optionally return turbo-stream if accepted
	if (req.accepts("text/vnd.turbo-stream.html")) {
		res.type("text/vnd.turbo-stream.html") // set proper mime type
		res.render("todo/delete_todo", { dom_target: `todo_${req.params.id}` })
	} else {
		res.redirect("/todos")
	}

})


const port: number = 3001

app.listen(port, function () {
	console.log(`App is listening on port ${port} !`)
})