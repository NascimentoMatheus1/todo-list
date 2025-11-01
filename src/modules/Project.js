export default class Project{
    constructor(name){
        this.name = name;
        this.todos = [];
    }

    setName(name) {
        this.name = name
    }

    getName() {
        return this.name
    }

    setTodos(todos) {
        this.todos = todos
    }

    getTodos() {
        return this.todos
    }

    getTodo(todoName) {
        return this.todos.find((todo) => todo.getName() === todoName)
    }

    contains(todoName) {
        return this.todos.some((todo) => todo.getName() === todoName)
    }

    addTodo(newtodo) {
        if (this.todos.find((todo) => todo.getName() === newtodo.name)) return
        this.todos.push(newtodo)
    }

    deleteTodo(todoName) {
        this.todos = this.todos.filter((todo) => todo.getName() !== todoName)
    }
}