var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("components/HTMLManipulating", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLManipulating = void 0;
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
    exports.HTMLManipulating = HTMLManipulating;
});
define("util/validation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validate = void 0;
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
    exports.validate = validate;
});
define("decorators/autobind", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Autobind = void 0;
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
    exports.Autobind = Autobind;
});
define("models/project", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Project = exports.ProjectStatus = void 0;
    var ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = exports.ProjectStatus || (exports.ProjectStatus = {}));
    class Project {
        constructor(id, title, description, people, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.status = status;
        }
    }
    exports.Project = Project;
});
define("state/projectSingleton", ["require", "exports", "models/project"], function (require, exports, project_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.projectStateSingleton = exports.ProjectStateSingleton = void 0;
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
            const newProject = new project_1.Project(this.id.toString(), title, description, numberOfPeople, project_1.ProjectStatus.Active);
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
    exports.ProjectStateSingleton = ProjectStateSingleton;
    exports.projectStateSingleton = ProjectStateSingleton.getInstance();
});
define("components/projectInput", ["require", "exports", "components/HTMLManipulating", "util/validation", "decorators/autobind", "state/projectSingleton"], function (require, exports, HTMLManipulating_1, validation_1, autobind_1, projectSingleton_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectInput = void 0;
    class ProjectInput extends HTMLManipulating_1.HTMLManipulating {
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
            if (!(0, validation_1.validate)(titleValidatable) ||
                !(0, validation_1.validate)(descriptionValidatable) ||
                !(0, validation_1.validate)(peopleValidatable)) {
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
                projectSingleton_1.projectStateSingleton.addProject(title, desc, people);
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
        autobind_1.Autobind
    ], ProjectInput.prototype, "submitHandler", null);
    exports.ProjectInput = ProjectInput;
});
define("models/dragAndDropInterfaces", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/projectItem", ["require", "exports", "decorators/autobind", "components/HTMLManipulating"], function (require, exports, autobind_js_1, HTMLManipulating_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectItem = void 0;
    class ProjectItem extends HTMLManipulating_js_1.HTMLManipulating {
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
        autobind_js_1.Autobind
    ], ProjectItem.prototype, "dragStartHandler", null);
    exports.ProjectItem = ProjectItem;
});
define("components/projectList", ["require", "exports", "decorators/autobind", "components/HTMLManipulating", "models/project", "state/projectSingleton", "components/projectItem"], function (require, exports, autobind_2, HTMLManipulating_2, project_2, projectSingleton_2, projectItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectList = void 0;
    class ProjectList extends HTMLManipulating_2.HTMLManipulating {
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
            projectSingleton_2.projectStateSingleton.moveProject(projectId, this.type === "active" ? project_2.ProjectStatus.Active : project_2.ProjectStatus.Finished);
        }
        dragLeaveHandler(_event) {
            const listElements = this.element.querySelector("ul");
            listElements.classList.remove("droppable");
        }
        configure() {
            projectSingleton_2.projectStateSingleton.addListener((projects) => {
                const filteredProjects = projects.filter((proj) => {
                    if (this.type === "active") {
                        return proj.status === project_2.ProjectStatus.Active;
                    }
                    return proj.status === project_2.ProjectStatus.Finished;
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
                new projectItem_1.ProjectItem(this.element.querySelector("ul").id, project);
            }
        }
    }
    __decorate([
        autobind_2.Autobind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        autobind_2.Autobind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        autobind_2.Autobind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    exports.ProjectList = ProjectList;
});
define("app", ["require", "exports", "components/projectInput", "components/projectList"], function (require, exports, projectInput_1, projectList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    new projectInput_1.ProjectInput();
    new projectList_1.ProjectList("active");
    new projectList_1.ProjectList("finished");
});
