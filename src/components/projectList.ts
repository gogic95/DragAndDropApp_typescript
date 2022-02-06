/// <reference path="HTMLManipulating.ts" />
/// <reference path="../decorators/autobind.ts" />

namespace Application {
	// ProjectList Class
	export class ProjectList
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
}
