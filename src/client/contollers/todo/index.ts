import { Todo } from 'src/models/Todo'
import { Controller } from 'stimulus'

export default class TodoController extends Controller {
  // declare autocreated value properties for typescript
  // TODO can we use values below and typescript to make 
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

  // css classes
  editingClass: string
  hasEditingClass: boolean
  completedClass: string
  hasCompletedClass: boolean
  static classes = ["editing", "completed"]

  initialize() {
    // console.log(this.idValue)
    // console.log(this.titleValue)
    // console.log(this.completedValue)
    // console.log(this.editingClass)
    // console.log(this.hasEditingClass)
  }

  edit() {
    this.element.classList.add(this.editingClass);
  }

  toggle() {
    const newCompletedValue = !this.completedValue;
    if (newCompletedValue) {
      this.element.classList.add(this.completedClass);
    } else {
      this.element.classList.remove(this.completedClass);
    }

    fetch(`/todo/${this.idValue}`, {
      method: "PATCH",
      headers: {
        Accept: "text/vnd.turbo-stream.html"
      },
      body: new URLSearchParams({
        completed: !this.completedValue + "" // make string
      })
    })
      .then(response => response.text())
      .then(html => this.element.innerHTML = html)
  }

}