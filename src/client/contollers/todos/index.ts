import { Controller } from 'stimulus'

export default class TodosController extends Controller {
  todoFormTarget: HTMLFormElement
  todoInputTarget: HTMLInputElement
  todoTargets: Element[]
  footerTarget: Element
  remainingCountTarget: Element
  hasRemainingCountTarget: boolean
  allFilterTarget: Element
  activeFilterTarget: Element
  completedFilterTarget: Element

  static targets = [
    "todoInput",
    "todoForm",
    "todo",
    "footer",
    "remainingCount",
    "allFilter",
    "activeFilter",
    "completedFilter"
  ]

  remainingCountValue: number
  hasRemainingCountValue: boolean

  filterValue: String
  hasFilterValue: boolean

  static values = {
    remainingCount: Number,
    filter: String
  }

  clearOnEnter(event: KeyboardEvent) {
    if (event.key === "Enter") {
      const inputValue = this.todoInputTarget.value.trim();
      if (inputValue.length === 0) {
        // don't submit if input empty
        event.preventDefault();
      } else {
        fetch(`/todo`, {
          method: "POST",
          headers: {
            Accept: "text/vnd.turbo-stream.html"
          },
          body: new URLSearchParams({
            title: this.todoInputTarget.value.trim()
          })
        })
          .then(response => response.text())
          .then(html => {
            // add div to body to load turbo-stream response
            // TODO better way?
            const d = document.createElement("div");
            d.innerHTML = html
            document.body.append(d)
            this.todoInputTarget.value = "";
            this.footerTarget.classList.remove("hidden");
            this.remainingCountValue = this.remainingCountValue + 1;
          })

      }
    }
  }

  clearCompleted(event: Event) {
    event.preventDefault();

    this.todoTargets.forEach((t, i) => {
      let completed = t.getAttribute('data-todo-completed-value') === 'true'
      if (completed) {
        let id = t.getAttribute('data-todo-id-value')
        fetch(`/todo/${id}`, {
          method: "DELETE",
          headers: {
            Accept: "text/vnd.turbo-stream.html"
          }
        })
          .then(response => response.text())
          .then(html => {
            // add div to body to load turbo-stream response
            // TODO better way?
            const d = document.createElement("div");
            d.innerHTML = html
            document.body.append(d)
          })
      }
    })
    this.countRemaining();
  }

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

  showAll(event: Event) {
    event.preventDefault();
    this.todoTargets.forEach((t, i) => {
      t.classList.remove("hidden")
    })
    this.filterValue = "all";
  }

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

  remainingCountValueChanged() {
    const count = this.remainingCountValue;
    if (this.hasRemainingCountTarget) {
      if (this.remainingCountValue > 0) {
        this.footerTarget.classList.remove("hidden");
      } else {
        this.footerTarget.classList.add("hidden");
      }
      this.remainingCountTarget.innerHTML = `
        <strong>${count}</strong> item${count === 1 ? '' : 's'} left
      `
    }

  }

  filterValueChanged() {
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

}