import Todo from "./Todo";
import Project from "./Project";
import TodoList from "./TodoList";

export default class Storage{
    static saveTodoList(data){
        localStorage.setItem('todoList', JSON.stringify(data));
    }

    static getTodoList() {
        const todoList = Object.assign(
        new TodoList(),
        JSON.parse(localStorage.getItem('todoList'))
        )

        todoList.setProjects(
        todoList
            .getProjects()
            .map((project) => Object.assign(new Project(), project))
        )

        todoList
        .getProjects()
        .forEach((project) =>
            project.setTodos(
            project.getTodos().map((todo) => Object.assign(new Todo(), todo))
            )
        )
        return todoList
    }

    static getActiveProject(){
        const todoList = Storage.getTodoList();
        return todoList.getActiveProject();
    }

    static setActiveProject(project){
        const todoList = Storage.getTodoList();
        todoList.setActiveProject(project);
        Storage.saveTodoList(todoList);
    }

    static addTodoList(project){
        const todoList = Storage.getTodoList();
        todoList.addProject(project);
        Storage.saveTodoList(todoList);
    }

    static deleteProject(project){
        const todoList = Storage.getTodoList();
        todoList.deleteProject(project);
        Storage.saveTodoList(todoList);
    }

    static addTodo(projectName, todo){
        const todoList = Storage.getTodoList();
        todoList.getProject(projectName).addTodo(todo);
        Storage.saveTodoList(todoList);
    }

    static deleteTodo(projectName, todo){
        const todoList = Storage.getTodoList();
        todoList.getProject(projectName).deleteTodo(todo);
        Storage.saveTodoList(todoList);
    }
}