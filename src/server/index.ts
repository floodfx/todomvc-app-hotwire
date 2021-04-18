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

// make eta the template engine
app.engine("eta", Eta.renderFile)
app.set("views", viewsPath)
app.set("view engine", "eta")

// faux db
var todos = new Todos()

// Loads basic html structure with a couple of Turbo Frames
app.get('/', (req: Request, res: Response) => {
	const filter = req.query.filter;
	res.render("index", { todos, filter })
})

// One of the Turbo Frame requests that loads the Todos
app.get('/todos', (req: Request, res: Response) => {
	const filter = req.query.filter as string;
	res.render("todos/todos", { todos: todos.filter(filter), filter })
})

// Another of the Turbo Frame requests that loads the Todo Stats
// Note: supports both plain html response and Turbo Stream response
// The Turbo Steam response is requested after a Todo is completed
// on the client side and returns a "replace" Turbo Stream response
app.get('/todoStats', (req: Request, res: Response) => {
	const showStats = todos.filter().length > 0;
	const remainingCount = todos.filter().filter(t => !t.completed).length;
	const filter = req.query.filter as string;

	if (req.accepts("text/vnd.turbo-stream.html")) {
		res.type("text/vnd.turbo-stream.html") // set proper mime type
		// replace current todoStatsFooter element with results
		res.render("todos/replace_stats", { showStats, remainingCount, filter, dom_target: "todoStatsFooter" })
	} else {
		// returns normal html (not Turbo Stream)
		res.render("todos/stats", { showStats, remainingCount, filter })
	}
})

// Called when new Todo is created (i.e.) Enter pressed on todo input
// Note: supports both plain html response and Turbo Stream response
// The non-Turbo Steam code shouldn't be called unless Turbo Stream 
// mimetype not requested.  The general case is the Turbo Stream request
// which returns a "append" Turbo Steam response
app.post('/todo', (req: Request, res: Response) => {
	const todo = todos.add(req.body.title)

	// optionally return turbo-stream if accepted
	if (req.accepts("text/vnd.turbo-stream.html")) {
		res.type("text/vnd.turbo-stream.html") // set proper mime type
		// append new Todo html to the todos_list element
		res.render("todo/new_todo", { ...todo, dom_target: "todos_list" })
	} else {
		// theoretically not called since Turbo Steam is requested
		res.redirect("/todos")
	}

})

// Handles changing the text (i.e. title) and completed properties
// of the Todo identified by the :id.
// Like the other routes, the expected case is to return a Turbo Stream
// response but in this case return two Turbo Stream entries 
// One to "replace" the Todo and one to "replace" the Todo Stats
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
		// "replace" both Todo and Stats (multiple Turbo Streams)
		res.render("todo/replace_todo_and_stats", { ...todo, replace_todo_dom_target: `todo_${todo.id}`, showStats, remainingCount, filter, replace_stats_dom_target: `todoStatsFooter` })
	} else {
		// theoretically shouldn't be called
		res.redirect("/todo")
	}

})

// Handle deletion of a Todo identified by the :id
// Similar to above, the expected case returns a Turbo Stream
// which in this case is a "remove" response.
app.delete('/todo/:id', (req: Request, res: Response) => {

	todos.remove(parseInt(req.params.id))

	// optionally return turbo-stream if accepted
	if (req.accepts("text/vnd.turbo-stream.html")) {
		res.type("text/vnd.turbo-stream.html") // set proper mime type
		// "remove" the element denoted by "todo_$ID"
		res.render("todo/delete_todo", { dom_target: `todo_${req.params.id}` })
	} else {
		res.redirect("/todos")
	}

})

const port: number = 3001

app.listen(port, function () {
	console.log(`App is listening on port ${port} !`)
})