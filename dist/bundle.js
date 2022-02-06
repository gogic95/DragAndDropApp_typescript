"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Application;
(function (Application) {
    let ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = Application.ProjectStatus || (Application.ProjectStatus = {}));
    class Project {
        constructor(id, title, description, people, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.status = status;
        }
    }
    Application.Project = Project;
})(Application || (Application = {}));
var Application;
(function (Application) {
    class State {
        constructor() {
            this.listeners = [];
        }
        addListener(listenerFunc) {
            this.listeners.push(listenerFunc);
        }
    }
    class ProjectStateSingleton extends State {
        constructor() {
            super();
            this.projects = [];
            this.id = 1;
        }
        static getInstance() {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new ProjectStateSingleton();
            return this.instance;
        }
        addProject(title, description, numberOfPeople) {
            const newProject = new Application.Project(this.id.toString(), title, description, numberOfPeople, Application.ProjectStatus.Active);
            this.id++;
            this.projects.push(newProject);
            this.updateListeners();
        }
        moveProject(projectId, newStatus) {
            const project = this.projects.find((proj) => proj.id === projectId);
            if (project && project.status !== newStatus) {
                project.status = newStatus;
            }
            this.updateListeners();
        }
        updateListeners() {
            for (const listenerFunc of this.listeners) {
                listenerFunc(this.projects.slice());
            }
        }
    }
    Application.ProjectStateSingleton = ProjectStateSingleton;
    Application.projectStateSingleton = ProjectStateSingleton.getInstance();
})(Application || (Application = {}));
var Application;
(function (Application) {
    function validate(validatableInput) {
        let isValid = true;
        if (validatableInput.required) {
            isValid =
                isValid && validatableInput.value.toString().trim().length !== 0;
        }
        if (validatableInput.minLength != null &&
            typeof validatableInput.value === "string") {
            isValid =
                isValid && validatableInput.value.length >= validatableInput.minLength;
        }
        if (validatableInput.maxLength != null &&
            typeof validatableInput.value === "string") {
            isValid =
                isValid && validatableInput.value.length <= validatableInput.maxLength;
        }
        if (validatableInput.min != null &&
            typeof validatableInput.value === "number") {
            isValid = isValid && validatableInput.value >= validatableInput.min;
        }
        if (validatableInput.max != null &&
            typeof validatableInput.value === "number") {
            isValid = isValid && validatableInput.value <= validatableInput.max;
        }
        return isValid;
    }
    Application.validate = validate;
})(Application || (Application = {}));
var Application;
(function (Application) {
    function Autobind(_target, _methodName, descriptor) {
        const originalMethod = descriptor.value;
        const adjDescriptor = {
            configurable: true,
            get() {
                const boundFn = originalMethod.bind(this);
                return boundFn;
            },
        };
        return adjDescriptor;
    }
    Application.Autobind = Autobind;
})(Application || (Application = {}));
var Application;
(function (Application) {
    class HTMLManipulating {
        constructor(templateElementId, hostElementId, insertAtBeginning, newElementId) {
            this.insertAtBeginning = insertAtBeginning;
            this.templateElement = document.getElementById(templateElementId);
            this.hostElement = document.getElementById(hostElementId);
            const importedNode = document.importNode(this.templateElement.content, true);
            this.element = importedNode.firstElementChild;
            if (newElementId) {
                this.element.id = newElementId;
            }
            this.attach();
        }
        attach() {
            this.hostElement.insertAdjacentElement(this.insertAtBeginning ? "afterbegin" : "beforeend", this.element);
        }
    }
    Application.HTMLManipulating = HTMLManipulating;
})(Application || (Application = {}));
var Application;
(function (Application) {
    class ProjectItem extends Application.HTMLManipulating {
        constructor(hostId, project) {
            super("single-project", hostId, false, project.id);
            this.project = project;
            this.configure();
            this.renderContent();
        }
        get getPeople() {
            return this.project.people > 1
                ? ` ${this.project.people} people`
                : " 1 person";
        }
        dragStartHandler(event) {
            event.dataTransfer.setData("text/plain", this.project.id);
            event.dataTransfer.effectAllowed = "move";
        }
        dragEndHandler(_) {
            console.log("Dropped");
        }
        configure() {
            this.element.addEventListener("dragstart", this.dragStartHandler);
            this.element.addEventListener("dragend", this.dragEndHandler);
        }
        renderContent() {
            this.element.querySelector("h2").textContent = this.project.title;
            this.element.querySelector("h3").textContent =
                this.getPeople + " assigned";
            this.element.querySelector("p").textContent = this.project.description;
        }
    }
    __decorate([
        Application.Autobind
    ], ProjectItem.prototype, "dragStartHandler", null);
    Application.ProjectItem = ProjectItem;
})(Application || (Application = {}));
var Application;
(function (Application) {
    class ProjectList extends Application.HTMLManipulating {
        constructor(type) {
            super("project-list", "app", false, `${type}-projects`);
            this.type = type;
            this.assignedProjects = [];
            this.configure();
            this.renderContent();
        }
        dragOverHandler(event) {
            var _a;
            if (((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.types[0]) === "text/plain") {
                event.preventDefault();
                const listElements = this.element.querySelector("ul");
                listElements.classList.add("droppable");
            }
        }
        dropHandler(event) {
            const projectId = event.dataTransfer.getData("text/plain");
            Application.projectStateSingleton.moveProject(projectId, this.type === "active" ? Application.ProjectStatus.Active : Application.ProjectStatus.Finished);
        }
        dragLeaveHandler(_event) {
            const listElements = this.element.querySelector("ul");
            listElements.classList.remove("droppable");
        }
        configure() {
            Application.projectStateSingleton.addListener((projects) => {
                const filteredProjects = projects.filter((proj) => {
                    if (this.type === "active") {
                        return proj.status === Application.ProjectStatus.Active;
                    }
                    return proj.status === Application.ProjectStatus.Finished;
                });
                this.assignedProjects = filteredProjects;
                this.setProjects();
            });
            this.element.addEventListener("dragover", this.dragOverHandler);
            this.element.addEventListener("dragleave", this.dragLeaveHandler);
            this.element.addEventListener("drop", this.dropHandler);
        }
        renderContent() {
            const ulId = `${this.type}-projects-list`;
            this.element.querySelector("ul").id = ulId;
            this.element.querySelector("h2").textContent =
                this.type.toUpperCase() + " PROJECTS";
        }
        setProjects() {
            const ulElement = document.getElementById(`${this.type}-projects-list`);
            ulElement.innerHTML = "";
            for (const project of this.assignedProjects) {
                new Application.ProjectItem(this.element.querySelector("ul").id, project);
            }
        }
    }
    __decorate([
        Application.Autobind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        Application.Autobind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        Application.Autobind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    Application.ProjectList = ProjectList;
})(Application || (Application = {}));
var Application;
(function (Application) {
    class ProjectInput extends Application.HTMLManipulating {
        constructor() {
            super("project-input", "app", true, "user-input");
            this.titleEl = this.element.querySelector("#title");
            this.descriptionEl = this.element.querySelector("#description");
            this.peopleEl = this.element.querySelector("#people");
            this.configure();
        }
        configure() {
            this.element.addEventListener("submit", this.submitHandler);
        }
        renderContent() { }
        getInputFromForm() {
            const title = this.titleEl.value;
            const description = this.descriptionEl.value;
            const people = +this.peopleEl.value;
            const titleValidatable = {
                value: title,
                required: true,
            };
            const descriptionValidatable = {
                value: description,
                required: true,
                minLength: 5,
            };
            const peopleValidatable = {
                value: +people,
                required: true,
                min: 1,
                max: 5,
            };
            if (!Application.validate(titleValidatable) ||
                !Application.validate(descriptionValidatable) ||
                !Application.validate(peopleValidatable)) {
                alert("Invalid input!");
                return;
            }
            else {
                return [title, description, people];
            }
        }
        submitHandler(event) {
            event.preventDefault();
            const userInput = this.getInputFromForm();
            if (Array.isArray(userInput)) {
                const [title, desc, people] = userInput;
                Application.projectStateSingleton.addProject(title, desc, people);
                this.resetForm();
            }
        }
        resetForm() {
            this.titleEl.value = "";
            this.descriptionEl.value = "";
            this.peopleEl.value = "";
        }
    }
    __decorate([
        Application.Autobind
    ], ProjectInput.prototype, "submitHandler", null);
    Application.ProjectInput = ProjectInput;
})(Application || (Application = {}));
var Application;
(function (Application) {
    new Application.ProjectInput();
    new Application.ProjectList("active");
    new Application.ProjectList("finished");
})(Application || (Application = {}));
