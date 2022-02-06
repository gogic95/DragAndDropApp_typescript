/// <reference path="HTMLManipulating.ts" />
/// <reference path="../decorators/autobind.ts" />

namespace Application {
	// ProjectItem Class
	export class ProjectItem
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
}
