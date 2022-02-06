import { Project, ProjectStatus } from "../models/project.js";
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFunc) {
        this.listeners.push(listenerFunc);
    }
}
export class ProjectStateSingleton extends State {
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
        const newProject = new Project(this.id.toString(), title, description, numberOfPeople, ProjectStatus.Active);
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
export const projectStateSingleton = ProjectStateSingleton.getInstance();
