"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//autobind decorator
function Autobind(_target, _methodName, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}
// ProjectInput class
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = 'user-input';
        this.titleEl = this.element.querySelector('#title');
        this.descriptionEl = this.element.querySelector('#description');
        this.peopleEl = this.element.querySelector('#people');
        this.configure();
        this.attach();
    }
    submitHandler(event) {
        event.preventDefault();
        console.log(this.titleEl.value);
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
    attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}
__decorate([
    Autobind
], ProjectInput.prototype, "submitHandler", null);
const projectInput = new ProjectInput();
// console.log('Radi');
// const projectInputTemplate = document.getElementById('project-input') as HTMLTemplateElement;
// document.body.appendChild(projectInputTemplate.content.cloneNode(true));
// const projectListTemplate = document.getElementById('project-list') as HTMLTemplateElement;
// document.body.appendChild(projectListTemplate.content.cloneNode(true));
// class project {
//     constructor(public title: string, public description: string, public people: number) {
//     }
// }
// let projects: project[] = [];
// function ubaciUListu() {
//     const titleEl = document.getElementById('title') as HTMLInputElement;
//     let title = titleEl.value;
//     const descriptionEl = document.getElementById('description') as HTMLTextAreaElement;
//     let description = descriptionEl.value;
//     const peopleEl = document.getElementById('people') as HTMLInputElement;
//     let people = +peopleEl.value;
//     if (title != '' && description != '' && people > 0) {
//         let p = new project(title, description, people);
//         projects.push(p);
//         const li = document.createElement("li");
//         li.appendChild(document.createTextNode(`Project: ${title}; Description: ${description}; No. of people: ${people}
//         `));
//         ul.appendChild(li);
//     }
//     else {
//         alert("Invalid input!");
//         return;
//     }
// }
// const button = document.getElementsByTagName('button')[0];
// const ul = document.getElementsByTagName('ul')[0];
// button.addEventListener('click', ubaciUListu);
// console.log(projects);
