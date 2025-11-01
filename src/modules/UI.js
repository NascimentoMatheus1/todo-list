import Todo from "./Todo";
import Storage from "./storage";

export default class UI{
   
    static initialLoad(){
        UI.loadTodosSaved(Storage.getActiveProject());
        UI.loadButtonsEventsListeners();
    }

    static loadButtonsEventsListeners(){
        const addTodo = document.getElementById('addTodo');
        const cancelButton = document.getElementById("cancel");
        const addButton = document.getElementById("add");
        const inboxCompletedBtn = document.getElementById('projectInboxBtn');
        const projectCompletedBtn = document.getElementById('projectCompletedBtn');
        addTodo.addEventListener('click', UI.showTodoInput);
        cancelButton.addEventListener('click', UI.hideTodoInput);
        addButton.addEventListener('click', UI.todoTextInputValidation);
        inboxCompletedBtn.addEventListener('click', UI.inboxBtnListener);
        projectCompletedBtn.addEventListener('click', UI.completedBtnListener);
    }

    static inboxBtnListener(){
        Storage.setActiveProject('Inbox');
        UI.loadTodosSaved(Storage.getActiveProject());
    }

    static completedBtnListener(){
        Storage.setActiveProject('Completed');
        UI.loadTodosSaved(Storage.getActiveProject());
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
        UI.resetTodoTextInput();
    } 

    static resetTodoTextInput(){
        const todoTextInput = document.getElementById('todoTextInput');
        todoTextInput.value = '';
    }

    static todoTextInputValidation(){
        const todoTextInput = document.getElementById('todoTextInput');
        const todoName = todoTextInput.value;
        if(todoName){
            const activeProject = Storage.getActiveProject();
            Storage.addTodo(activeProject, new Todo(todoName));
            UI.loadTodosSaved(activeProject);
        }
        UI.hideTodoInput();
    }

    static loadTodosSaved(projectName){
        const todoPageTitle = document.getElementById('todosPageTitle');
        todoPageTitle.innerText = projectName;

        const todosContainer = document.getElementById('todos-container'); 
        todosContainer.innerHTML = '';

        const fragment = document.createDocumentFragment();

        Storage
            .getTodoList()
            .getProject(projectName)
            .getTodos()
            .forEach(todo => {
                const todoElem = UI.createTodoElement(projectName, todo);
                fragment.append(todoElem);
            });

        todosContainer.append(fragment);
    }

    static createTodoElement(ProjectName, todoObj){
        const todo = document.createElement('div');
        todo.classList.add('todo');

        const inputsContainer = document.createElement('div');
        inputsContainer.classList.add('inputs');

        const inputCheckbox = document.createElement('input');
        inputCheckbox.type = 'checkbox';
        inputCheckbox.addEventListener('click', UI.checkTodoListener);
        
        const label = document.createElement('label');
        label.textContent = todoObj.getName();

        inputsContainer.append(inputCheckbox);
        inputsContainer.append(label);

        const dateContainer = document.createElement('div')
        const dateInput = document.createElement('input')
        dateInput.type = 'date';
        if(todoObj.getDate()){
            dateInput.value = todoObj.getDate();
        }
        dateInput.addEventListener('change', UI.dateTodoListener);
        dateContainer.append(dateInput);
        
        const closeButtonContainer = document.createElement('div');
        closeButtonContainer.classList.add('close-btn');
        closeButtonContainer.classList.add('cross-icon');
        closeButtonContainer.addEventListener('click', UI.deleteTodoListener);

        todo.append(inputsContainer);
        todo.append(dateContainer);
        todo.append(closeButtonContainer);
        todo.dataset.todoName = todoObj.getName();
        todo.dataset.projectName = ProjectName
        return todo;
    }

    static deleteTodoListener(event){
        const todoElem = event.target.parentElement;
        const todo = todoElem.dataset.todoName;
        const project = todoElem.dataset.projectName;
        Storage.deleteTodo(project, todo);
        UI.loadTodosSaved(Storage.getActiveProject());
    }

    static checkTodoListener(event){
        const inputCheckbox = event.target;
        const grandParent = inputCheckbox.parentElement.parentElement;
        const todoName = grandParent.dataset.todoName;
        const projectName = grandParent.dataset.projectName;
        if(projectName === 'Completed'){
            return
        }
        const todoObj = Storage.getTodoList().getProject(projectName).getTodo(todoName);
        Storage.deleteTodo(projectName, todoName);
        Storage.addTodo('Completed', todoObj);
        UI.loadTodosSaved(Storage.getActiveProject());
    }

    static dateTodoListener(event){
        const dateInput = event.target;
        const grandParent = dateInput.parentElement.parentElement;
        const todoName = grandParent.dataset.todoName;
        const projectName = grandParent.dataset.projectName;
        Storage.setTodoDate(projectName, todoName, dateInput.value);
    }
}