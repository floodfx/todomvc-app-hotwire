import { Todo } from 'src/models/Todo'
import { Controller } from 'stimulus'
import { TodosToggleAllEvent } from '../todos'

// Stimulus Controller for each Todo 
export default class TodoController extends Controller {
  // declare autocreated value properties for Typescript compiler
  // TODO can we use values below and Typescript to make 
  // this less manual?
  idValue: Number
  hasIdValue: boolean

  titleValue: String
  hasTitleValue: boolean

  completedValue: Boolean
  hasCompletedValue: boolean

  // expected values passed into controller
  // TODO use Todo model?
  static values = {
    id: Number,
    title: String,
    completed: Boolean
  }

  completedTarget: HTMLInputElement
  static targets = [
    "completed"
  ]

  // declare classes that can be passed in. prob don't need 
  // the css classes but wanted to try out this Stimulus feature
  editingClass: string
  hasEditingClass: boolean
  completedClass: string
  hasCompletedClass: boolean
  static classes = ["editing", "completed"]

  // mark the todo as editing
  edit() {
    this.element.classList.add(this.editingClass);
  }

  toggleFromParent(event: TodosToggleAllEvent) {
    // receive event from TodosController when toggle all
    // event has been dispatched to update Todo to match
    const newCompletedValue = event.detail.completed;
    this.completedValue = newCompletedValue;
    this.completedTarget.checked = newCompletedValue;
    if (newCompletedValue) {
      this.element.classList.add(this.completedClass);
    } else {
      this.element.classList.remove(this.completedClass);
    }
  }

  // toggle todo complete
  toggle() {
    // apply css class for todo
    const newCompletedValue = !this.completedValue;
    if (newCompletedValue) {
      this.element.classList.add(this.completedClass);
    } else {
      this.element.classList.remove(this.completedClass);
    }

    // tell the server to update the todo complete property
    fetch(`/todo/${this.idValue}`, {
      method: "PATCH",
      headers: {
        // tell server we accept turbo stream responses 
        Accept: "text/vnd.turbo-stream.html"
      },
      body: new URLSearchParams({
        completed: newCompletedValue + "" // make boolean into a string
      })
    })
      .then(response => response.text())
      // update the todo element with the response
      .then(html => this.element.innerHTML = html)

    // dispatch completed property update to Todos controller
    // TodosController can subscribe to this using
    // data-action="todoCompletedToggled->todos#myAction" on an
    // parent DOM element
    this.element.dispatchEvent(new TodoCompletedToggledEvent(newCompletedValue));

  }

}

export class TodoCompletedToggledEvent extends CustomEvent<{ completed: boolean }> {
  constructor(completed: boolean) {
    super("todoCompletedToggled", {
      detail: {
        completed
      },
      bubbles: true // bubble event up the dom to parent
    })
  }
}
