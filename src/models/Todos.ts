import { Todo } from "./Todo";

export interface Todos {
  add(title: string): Todo
  remove(id: number): void
  update(id: number, todo: Partial<Todo>): Todo
  filter(filter?: string): Todo[]
}

export class Todos implements Todos {
  private maxIndex: number = 0
  private data: Todo[] = []

  add(title: string) {
    const todo = { title, completed: false, id: this.maxIndex++ }
    this.data.push(todo)
    return todo;
  }

  remove(id: number) {
    const index = this.data.findIndex(t => t.id === id)
    this.data.splice(index, 1);
  }

  update(id: number, partialTodo: Partial<Todo>) {
    const index = this.data.findIndex(t => t.id === id)
    const todo = this.data[index];
    this.data[index] = { ...todo, ...partialTodo }
    return this.data[index]
  }

  filter(filter?: string | string[]) {
    if (filter) {
      if (filter === "active") {
        return this.data.filter(t => !t.completed)
      } else if (filter === "completed") {
        return this.data.filter(t => t.completed)
      }
    }
    return this.data;
  }
}