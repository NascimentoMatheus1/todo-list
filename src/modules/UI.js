import Todo from "./Todo";
import Project from "./Project";
import Storage from "./Storage";

export default class UI{
   
    static initialLoad(){
        Storage.setActiveProject('Inbox');
        UI.loadTodosSaved('Inbox');
        UI.loadProjectsSaved();
        UI.loadButtonsEventsListeners();
    }

    static loadButtonsEventsListeners(){
        //Menu buttons
        const inboxBtn = document.getElementById('projectInboxBtn');
        const todayBtn = document.getElementById('projectTodayBtn');
        const thisWeekBtn = document.getElementById('projectthisWeekBtn');
        const completedBtn = document.getElementById('projectCompletedBtn');
        inboxBtn.addEventListener('click', UI.inboxBtnListener);
        todayBtn.addEventListener('click', UI.todayBtnListener);
        thisWeekBtn.addEventListener('click', UI.thisWeekBtnListener);
        completedBtn.addEventListener('click', UI.completedBtnListener);

        // Add new projects buttons
        const addProjectBtn = document.getElementById('addProjects');
        const projectForm = document.getElementById('projectsForm');
        const cancelFormBtn = document.getElementById('cancelFormBtn')
        addProjectBtn.addEventListener('click', UI.showProjectForm);
        projectForm.addEventListener('submit', UI.projectFormListener);
        cancelFormBtn.addEventListener('click', UI.hideProjectForm);

        // add new todo buttons
        const addTaskBtn = document.getElementById('addTodo');
        const cancelTodoFormBtn = document.getElementById("cancel");
        const addTodoFormBtn = document.getElementById("add");
        addTaskBtn.addEventListener('click', UI.showTodoInput);
        cancelTodoFormBtn.addEventListener('click', UI.hideTodoInput);
        addTodoFormBtn.addEventListener('click', UI.todoTextInputValidation); 
    }

    static showProjectForm(){
        const projectForm = document.getElementById('projectsForm');
        projectForm.style.display = 'flex';
    }

    static hideProjectForm(){
        const projectForm = document.getElementById('projectsForm');
        projectForm.style.display = 'none';
    }

    static projectFormListener(event){
        event.preventDefault();
        const data = new FormData(event.target);
        const name = data.get('name');
        Storage.addTodoList(new Project(name));
        Storage.setActiveProject(name);
        UI.loadTodosSaved(name);
        UI.loadProjectsSaved();
        UI.hideProjectForm(); 
    }

    static inboxBtnListener(){
        Storage.setActiveProject('Inbox');
        UI.loadTodosSaved(Storage.getActiveProject());
    }

    static completedBtnListener(){
        Storage.setActiveProject('Completed');
        UI.loadTodosSaved(Storage.getActiveProject());
    }

    static todayBtnListener(){
        Storage.setActiveProject('Today');
        UI.loadTodosSaved(Storage.getActiveProject());
    }

    static thisWeekBtnListener(){
        Storage.setActiveProject('This week');
        UI.loadTodosSaved(Storage.getActiveProject());
    }

    static loadProjectsSaved(){
        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = '';

        const fragment = document.createDocumentFragment();

        Storage
            .getTodoList()
            .getProjects()
            .forEach( project => {
                const name = project.getName();
                if(
                    name !== 'Inbox' && 
                    name !== 'Today' && 
                    name !== 'This week' &&
                    name !== 'Completed'
                ){
                    const projectElem = UI.CreateProjectElement(project.getName());
                    fragment.append(projectElem);
                }
            });
        
        projectsContainer.append(fragment);
    }

    static CreateProjectElement(name){
        const project = document.createElement('div');
        project.classList.add('project');

        const projectName = document.createElement('div');
        projectName.classList.add('projectName');
        projectName.innerText = name;

        const crossIcon = document.createElement('div');
        crossIcon.classList.add('cross-icon');
        crossIcon.addEventListener('click', UI.deleteProjectListener);

        project.append(projectName);
        project.append(crossIcon);

        project.addEventListener('click', UI.projectListener);
        project.dataset.name = name;
        return project;
    }

    static projectListener(e){
        const projectName = e.currentTarget.dataset.name;
        Storage.setActiveProject(projectName);
        UI.loadTodosSaved(Storage.getActiveProject());
    }

    static deleteProjectListener(e){
        e.stopPropagation();
        const projectElem = e.currentTarget.parentElement;
        Storage.deleteProject(projectElem.dataset.name);
        Storage.setActiveProject('Inbox');
        UI.loadProjectsSaved();
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

        if(ProjectName !== 'Completed'){
            const inputCheckbox = document.createElement('input');
            inputCheckbox.type = 'checkbox';
            inputCheckbox.addEventListener('click', UI.checkTodoListener);
            inputsContainer.append(inputCheckbox);
        }
        
        const label = document.createElement('label');
        label.textContent = todoObj.getName();
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
        UI.loadTodosSaved(Storage.getActiveProject());
    }
}