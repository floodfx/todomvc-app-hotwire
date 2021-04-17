import { Application } from 'stimulus'
import * as Turbo from "@hotwired/turbo"
import TodoController from './todo';
import TodosController from './todos';

const application = Application.start()
application.register('todo', TodoController)
application.register('todos', TodosController)

// @ts-ignore
window.Turbo = Turbo