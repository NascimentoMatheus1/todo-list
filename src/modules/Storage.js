const { format, isSameDay, isSameWeek } = require('date-fns');
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

    static setTodoDate(projectName, todoName, dateValue){
        const todoList = Storage.getTodoList();
        const today = format(new Date(), "yyyy-MM-dd");
        
        if(isSameDay(today, dateValue)){
            todoList.getProject(projectName).deleteTodo(todoName);
            todoList.getProject('Today').addTodo(new Todo(todoName));
            todoList.getProject('Today').setTodoDate(todoName, dateValue);
        }
        else if(isSameWeek(today, dateValue)){
            todoList.getProject(projectName).deleteTodo(todoName);
            todoList.getProject('This week').addTodo(new Todo(todoName));
            todoList.getProject('This week').setTodoDate(todoName, dateValue);
        }
        else{
            todoList.getProject(projectName).setTodoDate(todoName, dateValue);
        }
        Storage.saveTodoList(todoList);
    }

    static getTodoDate(projectName, todo){
        const todoList = Storage.getTodoList();
        return todoList.getProject(projectName).getTodoDate(todo);
    }

}