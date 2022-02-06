var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { HTMLManipulating } from "./HTMLManipulating.js";
import * as Validation from "../util/validation.js";
import { Autobind as autobind } from "../decorators/autobind.js";
import { projectStateSingleton } from "../state/projectSingleton.js";
export class ProjectInput extends HTMLManipulating {
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
        if (!Validation.validate(titleValidatable) ||
            !Validation.validate(descriptionValidatable) ||
            !Validation.validate(peopleValidatable)) {
            alert(`Invalid input!
All fields are required.
Description must contain more than 5 characters.
Allowed number of people: 1-5.`);
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
    autobind
], ProjectInput.prototype, "submitHandler", null);
