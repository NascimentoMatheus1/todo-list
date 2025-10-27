export default class UI{

    static initialLoad(){
        UI.loadEventsListeners();
    }

    static loadEventsListeners(){
        const addTodo = document.getElementById('addTodo');
        const addButton = document.getElementById("add");
        const cancelButton = document.getElementById("cancel");
        addTodo.addEventListener('click', UI.showTodoInput);
        addButton.addEventListener('click', UI.hideTodoInput);
        cancelButton.addEventListener('click', UI.hideTodoInput);
    }

    static showTodoInput() {
        const addTodo = document.getElementById("addTodo");
        const todoInputContainer = document.getElementById("todoInputContainer");
        addTodo.style.display = 'none';
        todoInputContainer.style.display = 'flex';
    }

    static hideTodoInput(){
        const addTodo = document.getElementById("addTodo");
        const todoInputContainer = document.getElementById("todoInputContainer");
        addTodo.style.display = 'flex';
        todoInputContainer.style.display = 'none';
    } 

}