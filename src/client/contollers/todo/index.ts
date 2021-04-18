import { Controller } from 'stimulus'

// Stimulus Controller for each Todo 
export default class TodoController extends Controller {
  // declare autocreated value properties for Typescript compiler
  // TODO can we use values below and Typescript to make 
  // this less manual?
  idValue: Element
  hasIdValue: boolean

  titleValue: Element
  hasTitleValue: boolean

  completedValue: Element
  hasCompletedValue: boolean

  // expected values passed into controller
  // TODO use Todo model?
  static values = {
    id: Number,
    title: String,
    completed: Boolean
  }

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
        completed: !this.completedValue + "" // make boolean into a string
      })
    })
      .then(response => response.text())
      // update the todo element with the response
      .then(html => this.element.innerHTML = html)
  }

}