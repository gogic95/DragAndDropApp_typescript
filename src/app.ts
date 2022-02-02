console.log('Radi');

const projectInputTemplate = document.getElementById('project-input') as HTMLTemplateElement;

document.body.appendChild(projectInputTemplate.content.cloneNode(true));
const projectListTemplate = document.getElementById('project-list') as HTMLTemplateElement;

document.body.appendChild(projectListTemplate.content.cloneNode(true));



class project {
    constructor(public title: string, public description: string, public people: number) {

    }

}

let projects: project[] = [];

function ubaciUListu() {
    const titleEl = document.getElementById('title') as HTMLInputElement;
    let title = titleEl.value;
    const descriptionEl = document.getElementById('description') as HTMLTextAreaElement;
    let description = descriptionEl.value;
    const peopleEl = document.getElementById('people') as HTMLInputElement;
    let people = +peopleEl.value;
    if (title != '' && description != '' && people > 0) {
        let p = new project(title, description, people);
        projects.push(p);
        li.appendChild(document.createTextNode(`Project: ${title}; Description: ${description}; No. of people: ${people}
        `));
        ul.appendChild(li);

    }
    else {
        alert("Invalid input!");
        return;
    }
}


const button = document.getElementsByTagName('button')[0];
const ul = document.getElementsByTagName('ul')[0];
var li = document.createElement("li");


button.addEventListener('click', ubaciUListu);
console.log(projects);
