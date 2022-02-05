"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Project Class
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
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
        const newProject = new Project(this.id.toString(), title, description, numberOfPeople, ProjectStatus.Active);
        this.id++;
        this.projects.push(newProject);
        for (const listenerFunc of this.listeners) {
            listenerFunc(this.projects.slice());
        }
    }
}
const projectStateSingleton = ProjectStateSingleton.getInstance();
function validate(validatableInput) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
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
//autobind decorator
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
// HTML manipulating class
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
// ProjectList Class
class ProjectList extends HTMLManipulating {
    constructor(type) {
        super("project-list", "app", false, `${type}-projects`);
        this.type = type;
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    configure() {
        projectStateSingleton.addListener((projects) => {
            const filteredProjects = projects.filter((proj) => {
                if (this.type === "active") {
                    return proj.status === ProjectStatus.Active;
                }
                return proj.status === ProjectStatus.Finished;
            });
            this.assignedProjects = filteredProjects;
            this.setProjects();
        });
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
            const listItem = document.createElement("li");
            listItem.textContent = project.title;
            ulElement === null || ulElement === void 0 ? void 0 : ulElement.appendChild(listItem);
        }
    }
}
// ProjectInput class
class ProjectInput extends HTMLManipulating {
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
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)) {
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
            projectStateSingleton.addProject(title, desc, people);
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
    Autobind
], ProjectInput.prototype, "submitHandler", null);
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
