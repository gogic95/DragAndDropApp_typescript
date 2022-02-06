// HTML manipulating class
export abstract class HTMLManipulating<
	T extends HTMLElement,
	K extends HTMLElement
> {
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
