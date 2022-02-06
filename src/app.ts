/// <reference path="models/dragAndDropInterfaces.ts" />
/// <reference path="models/project.ts" />
/// <reference path="state/projectSingleton.ts" />
/// <reference path="util/validation.ts" />
/// <reference path="decorators/autobind.ts" />
/// <reference path="components/projectItem.ts" />
/// <reference path="components/projectList.ts" />
/// <reference path="components/projectInput.ts" />

namespace Application {
	new ProjectInput();
	new ProjectList("active");
	new ProjectList("finished");
}
