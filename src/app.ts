// Drag&Drop Interfaces
interface Draggable {
	dragStartHandler(event: DragEvent): void;
	dragEndHandler(event: DragEvent): void;
}

interface DropTarget {
	dragOverHandler(event: DragEvent): void;
	dropHandler(event: DragEvent): void;
	dragLeaveHandler(event: DragEvent): void;
}

// Project Class
enum ProjectStatus {
	Active,
	Finished,
}

class Project {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public people: number,
		public status: ProjectStatus
	) {}
}

// Singleton
type Listener<T> = (items: T[]) => void;

class State<T> {
	protected listeners: Listener<T>[] = [];

	addListener(listenerFunc: Listener<T>) {
		this.listeners.push(listenerFunc);
	}
}

class ProjectStateSingleton extends State<Project> {
	private static instance: ProjectStateSingleton;
	private projects: Project[] = [];
	private id = 1;

	private constructor() {
		super();
	}

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}
		this.instance = new ProjectStateSingleton();
		return this.instance;
	}

	addProject(title: string, description: string, numberOfPeople: number) {
		const newProject = new Project(
			this.id.toString(),
			title,
			description,
			numberOfPeople,
			ProjectStatus.Active
		);
		this.id++;
		this.projects.push(newProject);
		this.updateListeners();
	}

	moveProject(projectId: string, newStatus: ProjectStatus) {
		const project = this.projects.find((proj) => proj.id === projectId);
		if (project && project.status !== newStatus) {
			project.status = newStatus;
		}
		this.updateListeners();
	}

	private updateListeners() {
		for (const listenerFunc of this.listeners) {
			listenerFunc(this.projects.slice());
		}
	}
}

const projectStateSingleton = ProjectStateSingleton.getInstance();

//validation
interface Validatable {
	value: string | number;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
}

function validate(validatableInput: Validatable) {
	let isValid = true;
	if (validatableInput.required) {
		isValid = isValid && validatableInput.value.toString().trim().length !== 0;
	}
	if (
		validatableInput.minLength != null &&
		typeof validatableInput.value === "string"
	) {
		isValid =
			isValid && validatableInput.value.length >= validatableInput.minLength;
	}
	if (
		validatableInput.maxLength != null &&
		typeof validatableInput.value === "string"
	) {
		isValid =
			isValid && validatableInput.value.length <= validatableInput.maxLength;
	}
	if (
		validatableInput.min != null &&
		typeof validatableInput.value === "number"
	) {
		isValid = isValid && validatableInput.value >= validatableInput.min;
	}
	if (
		validatableInput.max != null &&
		typeof validatableInput.value === "number"
	) {
		isValid = isValid && validatableInput.value <= validatableInput.max;
	}

	return isValid;
}

//autobind decorator
function Autobind(
	_target: any,
	_methodName: string,
	descriptor: PropertyDescriptor
) {
	const originalMethod = descriptor.value;
	const adjDescriptor: PropertyDescriptor = {
		configurable: true,
		get() {
			const boundFn = originalMethod.bind(this);
			return boundFn;
		},
	};
	return adjDescriptor;
}

// HTML manipulating class
abstract class HTMLManipulating<T extends HTMLElement, K extends HTMLElement> {
	templateElement: HTMLTemplateElement;
	hostElement: T;
	element: K;

	constructor(
		templateElementId: string,
		hostElementId: string,
		public insertAtBeginning: boolean,
		newElementId?: string
	) {
		this.templateElement = document.getElementById(
			templateElementId
		) as HTMLTemplateElement;
		this.hostElement = document.getElementById(hostElementId) as T;
		const importedNode = document.importNode(
			this.templateElement.content,
			true
		);
		this.element = importedNode.firstElementChild as K;
		if (newElementId) {
			this.element.id = newElementId;
		}

		this.attach();
	}

	private attach() {
		this.hostElement.insertAdjacentElement(
			this.insertAtBeginning ? "afterbegin" : "beforeend",
			this.element
		);
	}

	abstract configure(): void;
	abstract renderContent(): void;
}

// ProjectItem Class
class ProjectItem
	extends HTMLManipulating<HTMLUListElement, HTMLLinkElement>
	implements Draggable
{
	private project: Project;

	get getPeople() {
		return this.project.people > 1
			? ` ${this.project.people} people`
			: " 1 person";
	}

	constructor(hostId: string, project: Project) {
		super("single-project", hostId, false, project.id);
		this.project = project;

		this.configure();
		this.renderContent();
	}

	@Autobind
	dragStartHandler(event: DragEvent): void {
		event.dataTransfer!.setData("text/plain", this.project.id);
		event.dataTransfer!.effectAllowed = "move";
	}

	dragEndHandler(_: DragEvent): void {
		console.log("Dropped");
	}

	configure(): void {
		this.element.addEventListener("dragstart", this.dragStartHandler);
		this.element.addEventListener("dragend", this.dragEndHandler);
	}

	renderContent(): void {
		this.element.querySelector("h2")!.textContent = this.project.title;
		this.element.querySelector("h3")!.textContent =
			this.getPeople + " assigned";
		this.element.querySelector("p")!.textContent = this.project.description;
	}
}

// ProjectList Class
class ProjectList
	extends HTMLManipulating<HTMLDivElement, HTMLElement>
	implements DropTarget
{
	assignedProjects: Project[];

	constructor(private type: "active" | "finished") {
		super("project-list", "app", false, `${type}-projects`);
		this.assignedProjects = [];
		this.configure();
		this.renderContent();
	}

	@Autobind
	dragOverHandler(event: DragEvent): void {
		if (event.dataTransfer?.types[0] === "text/plain") {
			event.preventDefault();
			const listElements = this.element.querySelector("ul")!;
			listElements.classList.add("droppable");
		}
	}

	@Autobind
	dropHandler(event: DragEvent): void {
		const projectId = event.dataTransfer!.getData("text/plain");
		projectStateSingleton.moveProject(
			projectId,
			this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
		);
	}

	@Autobind
	dragLeaveHandler(_event: DragEvent): void {
		const listElements = this.element.querySelector("ul")!;
		listElements.classList.remove("droppable");
	}

	configure(): void {
		projectStateSingleton.addListener((projects: Project[]) => {
			const filteredProjects = projects.filter((proj) => {
				if (this.type === "active") {
					return proj.status === ProjectStatus.Active;
				}
				return proj.status === ProjectStatus.Finished;
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
		this.element.querySelector("ul")!.id = ulId;
		this.element.querySelector("h2")!.textContent =
			this.type.toUpperCase() + " PROJECTS";
	}

	private setProjects() {
		const ulElement = document.getElementById(
			`${this.type}-projects-list`
		) as HTMLUListElement;

		ulElement.innerHTML = "";

		for (const project of this.assignedProjects) {
			new ProjectItem(this.element.querySelector("ul")!.id, project);
		}
	}
}

// ProjectInput class

class ProjectInput extends HTMLManipulating<HTMLDivElement, HTMLFormElement> {
	titleEl: HTMLInputElement;
	descriptionEl: HTMLInputElement;
	peopleEl: HTMLInputElement;

	constructor() {
		super("project-input", "app", true, "user-input");
		this.titleEl = this.element.querySelector("#title") as HTMLInputElement;
		this.descriptionEl = this.element.querySelector(
			"#description"
		) as HTMLInputElement;
		this.peopleEl = this.element.querySelector("#people") as HTMLInputElement;

		this.configure();
	}

	configure() {
		this.element.addEventListener("submit", this.submitHandler);
	}

	renderContent(): void {}

	private getInputFromForm(): [string, string, number] | void {
		const title = this.titleEl.value;
		const description = this.descriptionEl.value;
		const people = +this.peopleEl.value;

		const titleValidatable: Validatable = {
			value: title,
			required: true,
		};
		const descriptionValidatable: Validatable = {
			value: description,
			required: true,
			minLength: 5,
		};
		const peopleValidatable: Validatable = {
			value: +people,
			required: true,
			min: 1,
			max: 5,
		};

		if (
			!validate(titleValidatable) ||
			!validate(descriptionValidatable) ||
			!validate(peopleValidatable)
		) {
			alert("Invalid input!");
			return;
		} else {
			return [title, description, people];
		}
	}

	@Autobind
	private submitHandler(event: Event) {
		event.preventDefault();
		const userInput = this.getInputFromForm();
		if (Array.isArray(userInput)) {
			const [title, desc, people] = userInput;
			projectStateSingleton.addProject(title, desc, people);
			this.resetForm();
		}
	}

	private resetForm() {
		this.titleEl.value = "";
		this.descriptionEl.value = "";
		this.peopleEl.value = "";
	}
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
