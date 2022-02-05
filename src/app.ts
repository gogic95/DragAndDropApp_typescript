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
type Listener = (items: Project[]) => void;

class ProjectStateSingleton {
	private static instance: ProjectStateSingleton;
	private projects: Project[] = [];
	private id = 1;
	private listeners: Listener[] = [];

	private constructor() {}

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}
		this.instance = new ProjectStateSingleton();
		return this.instance;
	}

	addListener(listenerFunc: Listener) {
		this.listeners.push(listenerFunc);
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

// ProjectList Class
class ProjectList {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	element: HTMLElement;
	assignedProjects: Project[];

	constructor(private type: "active" | "finished") {
		this.templateElement = document.getElementById(
			"project-list"
		) as HTMLTemplateElement;
		this.hostElement = document.getElementById("app") as HTMLDivElement;
		this.assignedProjects = [];

		const importedNode = document.importNode(
			this.templateElement.content,
			true
		);
		this.element = importedNode.firstElementChild as HTMLElement;
		this.element.id = `${this.type}-projects`;

		projectStateSingleton.addListener((projects: Project[]) => {
			this.assignedProjects = projects;
			this.setProjects();
		});

		this.attach();
		this.prepareTemplateLooks();
	}

	private setProjects() {
		const ulElement = document.getElementById(
			`${this.type}-projects-list`
		) as HTMLUListElement;
		for (const project of this.assignedProjects) {
			const listItem = document.createElement("li");
			listItem.textContent = project.title;
			ulElement?.appendChild(listItem);
		}
	}

	private prepareTemplateLooks() {
		const ulId = `${this.type}-projects-list`;
		this.element.querySelector("ul")!.id = ulId;
		this.element.querySelector("h2")!.textContent =
			this.type.toUpperCase() + " PROJECTS";
	}

	private attach() {
		this.hostElement.insertAdjacentElement("beforeend", this.element);
	}
}

// ProjectInput class
class ProjectInput {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	element: HTMLFormElement;
	titleEl: HTMLInputElement;
	descriptionEl: HTMLInputElement;
	peopleEl: HTMLInputElement;

	constructor() {
		this.templateElement = document.getElementById(
			"project-input"
		) as HTMLTemplateElement;
		this.hostElement = document.getElementById("app") as HTMLDivElement;

		const importedNode = document.importNode(
			this.templateElement.content,
			true
		);
		this.element = importedNode.firstElementChild as HTMLFormElement;
		this.element.id = "user-input";

		this.titleEl = this.element.querySelector("#title") as HTMLInputElement;
		this.descriptionEl = this.element.querySelector(
			"#description"
		) as HTMLInputElement;
		this.peopleEl = this.element.querySelector("#people") as HTMLInputElement;

		this.configure();
		this.attach();
	}

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

	private configure() {
		this.element.addEventListener("submit", this.submitHandler);
	}

	private attach() {
		this.hostElement.insertAdjacentElement("afterbegin", this.element);
	}
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
