export class HTMLManipulating {
    constructor(templateElementId, hostElementId, insertAtBeginning, newElementId) {
        this.insertAtBeginning = insertAtBeginning;
        this.templateElement = document.getElementById(templateElementId);
        this.hostElement = document.getElementById(hostElementId);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach();
    }
    attach() {
        this.hostElement.insertAdjacentElement(this.insertAtBeginning ? "afterbegin" : "beforeend", this.element);
    }
}
