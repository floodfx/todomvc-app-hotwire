import { Application } from 'stimulus'
import * as Turbo from "@hotwired/turbo"
import TodoController from './todo';
import TodosController from './todos';

// register the Stimulus Controllers
const application = Application.start()
application.register('todo', TodoController)
application.register('todos', TodosController)

// add Turbo to the browser window
// @ts-ignore
window.Turbo = Turbo