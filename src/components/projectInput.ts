/// <reference path="HTMLManipulating.ts" />
/// <reference path="../decorators/autobind.ts" />

namespace Application {
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
}
