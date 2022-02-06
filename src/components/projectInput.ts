import { HTMLManipulating } from "./HTMLManipulating";
import * as Validation from "../util/validation";
import { Autobind as autobind } from "../decorators/autobind";
import { projectStateSingleton } from "../state/projectSingleton";

// ProjectInput class

export class ProjectInput extends HTMLManipulating<
	HTMLDivElement,
	HTMLFormElement
> {
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

		const titleValidatable: Validation.Validatable = {
			value: title,
			required: true,
		};
		const descriptionValidatable: Validation.Validatable = {
			value: description,
			required: true,
			minLength: 5,
		};
		const peopleValidatable: Validation.Validatable = {
			value: +people,
			required: true,
			min: 1,
			max: 5,
		};

		if (
			!Validation.validate(titleValidatable) ||
			!Validation.validate(descriptionValidatable) ||
			!Validation.validate(peopleValidatable)
		) {
			alert(`Invalid input!
All fields are required.
Description must contain more than 5 characters.
Allowed number of people: 1-5.`);
			return;
		} else {
			return [title, description, people];
		}
	}

	@autobind
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
