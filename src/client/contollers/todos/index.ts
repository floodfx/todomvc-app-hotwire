import { Controller } from 'stimulus'
import { TodoCompletedToggledEvent } from '../todo'

// Stimulus Controller containing all the Todos 
export default class TodosController extends Controller {
  // declarations of the target elements and existing properties
  // to satisfy Typescript compiler
  todoFormTarget: HTMLFormElement
  todoInputTarget: HTMLInputElement
  todoTargets: Element[]
  footerTarget: Element
  remainingCountTarget: Element
  hasRemainingCountTarget: boolean
  allFilterTarget: Element
  activeFilterTarget: Element
  completedFilterTarget: Element
  toggleAllTarget: HTMLInputElement

  static targets = [
    "todoInput",
    "todoForm",
    "todo",
    "footer",
    "remainingCount",
    "allFilter",
    "activeFilter",
    "completedFilter",
    "toggleAll"
  ]

  // declarations for values for Typescript
  remainingCountValue: number
  hasRemainingCountValue: boolean

  filterValue: String
  hasFilterValue: boolean

  static values = {
    remainingCount: Number,
    filter: String
  }

  // called when Enter key pressed on title input
  clearOnEnter(event: KeyboardEvent) {
    if (event.key === "Enter") {
      const inputValue = this.todoInputTarget.value.trim();
      if (inputValue.length === 0) {
        // don't submit if input empty
        event.preventDefault();
      } else {
        // tell server to create a new Todo
        fetch(`/todo`, {
          method: "POST",
          headers: {
            // tell server we accept turbo-stream responses
            Accept: "text/vnd.turbo-stream.html"
          },
          body: new URLSearchParams({
            title: this.todoInputTarget.value.trim()
          })
        })
          .then(response => response.text())
          .then(html => {
            // add div to body to load turbo-stream response
            // TODO better way to do this?
            const d = document.createElement("div");
            d.innerHTML = html
            document.body.append(d)

            // update other controller targets / values
            this.todoInputTarget.value = "";
            this.footerTarget.classList.remove("hidden");
            this.remainingCountValue = this.remainingCountValue + 1;
          })

      }
    }
  }

  toggleAll() {
    const completed = this.toggleAllTarget.checked;

    // dispatch event to toggle all Todo children elements to match
    // completed value
    this.todoTargets.forEach((t, i) => {
      t.dispatchEvent(new TodosToggleAllEvent(completed))
    })
  }

  // called when clear completed button pressed
  clearCompleted(event: Event) {
    event.preventDefault();

    // find the completed Todos in the DOM
    this.todoTargets.forEach((t, i) => {
      let completed = t.getAttribute('data-todo-completed-value') === 'true'
      if (completed) {
        let id = t.getAttribute('data-todo-id-value')
        // tell server to delete this Todo
        fetch(`/todo/${id}`, {
          method: "DELETE",
          headers: {
            // tell server we accept turbo-stream responses
            Accept: "text/vnd.turbo-stream.html"
          }
        })
          .then(response => response.text())
          .then(html => {
            // add div to body to load turbo-stream response
            // TODO better way to do this?
            const d = document.createElement("div");
            d.innerHTML = html
            document.body.append(d)
          })
      }
    })
    this.countRemaining();
  }

  // counts the non-completed Todos and updates the remainingCountValue
  // which kicks off the remainingCountValueChanged lifecycle method
  countRemaining() {
    var count = 0;
    this.todoTargets.forEach((t, i) => {
      let completed = t.getAttribute('data-todo-completed-value') === 'true'
      if (!completed) {
        count++;
      }
    })
    this.remainingCountValue = count;
  }

  // make all Todos visiable
  showAll(event: Event) {
    event.preventDefault();
    this.todoTargets.forEach((t, i) => {
      t.classList.remove("hidden")
    })
    this.filterValue = "all";
  }

  // only show non-completed Todos
  showActive(event: Event) {
    event.preventDefault();
    this.todoTargets.forEach((t, i) => {
      let completed = t.getAttribute('data-todo-completed-value') === 'true'
      if (!completed) {
        t.classList.remove("hidden")
      } else {
        t.classList.add("hidden")
      }
    })
    this.filterValue = "active";
  }

  // only show completed Todos
  showCompleted(event: Event) {
    event.preventDefault();
    this.todoTargets.forEach((t, i) => {
      let completed = t.getAttribute('data-todo-completed-value') === 'true'
      if (completed) {
        t.classList.remove("hidden")
      } else {
        t.classList.add("hidden")
      }
    })
    this.filterValue = "completed";
  }

  // automatically called by Stimulus when remainingCountValue is updated
  remainingCountValueChanged() {
    const count = this.remainingCountValue;
    if (this.hasRemainingCountTarget) {
      if (this.remainingCountValue > 0) {
        this.footerTarget.classList.remove("hidden");
      } else {
        this.footerTarget.classList.add("hidden");
      }
      // update the remainingCount element
      this.remainingCountTarget.innerHTML = `
        <strong>${count}</strong> item${count === 1 ? '' : 's'} left
      `
    }

  }

  // automatically called by Stimulus when filterValue is updated
  filterValueChanged() {
    // mark the targets with css as approproiate
    if (this.filterValue === "all") {
      this.allFilterTarget.classList.add("selected");
      this.activeFilterTarget.classList.remove("selected");
      this.completedFilterTarget.classList.remove("selected");
    } else if (this.filterValue === "active") {
      this.allFilterTarget.classList.remove("selected");
      this.activeFilterTarget.classList.add("selected");
      this.completedFilterTarget.classList.remove("selected");
    } else if (this.filterValue === "completed") {
      this.allFilterTarget.classList.remove("selected");
      this.activeFilterTarget.classList.remove("selected");
      this.completedFilterTarget.classList.add("selected");
    }
  }

  updateRemainingCount(event: TodoCompletedToggledEvent) {
    if (event.detail.completed) {
      this.remainingCountValue = this.remainingCountValue - 1;
    } else {
      this.remainingCountValue = this.remainingCountValue + 1;
    }
  }

}

export class TodosToggleAllEvent extends CustomEvent<{ completed: boolean }> {
  constructor(completed: boolean) {
    super("todosToggleAll", {
      detail: {
        completed
      },
      bubbles: false // no need to bubble up since this is dispatched to children
    })
  }
}