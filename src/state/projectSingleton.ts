import { Project, ProjectStatus } from "../models/project.js";

// Singleton
type Listener<T> = (items: T[]) => void;

class State<T> {
	protected listeners: Listener<T>[] = [];

	addListener(listenerFunc: Listener<T>) {
		this.listeners.push(listenerFunc);
	}
}

export class ProjectStateSingleton extends State<Project> {
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

export const projectStateSingleton = ProjectStateSingleton.getInstance();
