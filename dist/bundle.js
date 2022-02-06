(()=>{"use strict";class e{constructor(e,t,n,r){this.insertAtBeginning=n,this.templateElement=document.getElementById(e),this.hostElement=document.getElementById(t);const s=document.importNode(this.templateElement.content,!0);this.element=s.firstElementChild,r&&(this.element.id=r),this.attach()}attach(){this.hostElement.insertAdjacentElement(this.insertAtBeginning?"afterbegin":"beforeend",this.element)}}function t(e){let t=!0;return e.required&&(t=t&&0!==e.value.toString().trim().length),null!=e.minLength&&"string"==typeof e.value&&(t=t&&e.value.length>=e.minLength),null!=e.maxLength&&"string"==typeof e.value&&(t=t&&e.value.length<=e.maxLength),null!=e.min&&"number"==typeof e.value&&(t=t&&e.value>=e.min),null!=e.max&&"number"==typeof e.value&&(t=t&&e.value<=e.max),t}function n(e,t,n){const r=n.value;return{configurable:!0,get(){return r.bind(this)}}}var r;!function(e){e[e.Active=0]="Active",e[e.Finished=1]="Finished"}(r||(r={}));class s{constructor(e,t,n,r,s){this.id=e,this.title=t,this.description=n,this.people=r,this.status=s}}class i extends class{constructor(){this.listeners=[]}addListener(e){this.listeners.push(e)}}{constructor(){super(),this.projects=[],this.id=1}static getInstance(){return this.instance||(this.instance=new i),this.instance}addProject(e,t,n){const i=new s(this.id.toString(),e,t,n,r.Active);this.id++,this.projects.push(i),this.updateListeners()}moveProject(e,t){const n=this.projects.find((t=>t.id===e));n&&n.status!==t&&(n.status=t),this.updateListeners()}updateListeners(){for(const e of this.listeners)e(this.projects.slice())}}const l=i.getInstance();class o extends e{constructor(){super("project-input","app",!0,"user-input"),this.titleEl=this.element.querySelector("#title"),this.descriptionEl=this.element.querySelector("#description"),this.peopleEl=this.element.querySelector("#people"),this.configure()}configure(){this.element.addEventListener("submit",this.submitHandler)}renderContent(){}getInputFromForm(){const e=this.titleEl.value,n=this.descriptionEl.value,r=+this.peopleEl.value,s={value:n,required:!0,minLength:5},i={value:+r,required:!0,min:1,max:5};return t({value:e,required:!0})&&t(s)&&t(i)?[e,n,r]:void alert("Invalid input!\nAll fields are required.\nDescription must contain more than 5 characters.\nAllowed number of people: 1-5.")}submitHandler(e){e.preventDefault();const t=this.getInputFromForm();if(Array.isArray(t)){const[e,n,r]=t;l.addProject(e,n,r),this.resetForm()}}resetForm(){this.titleEl.value="",this.descriptionEl.value="",this.peopleEl.value=""}}!function(e,t,n,r){var s,i=arguments.length,l=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,n,r);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(l=(i<3?s(l):i>3?s(t,n,l):s(t,n))||l);i>3&&l&&Object.defineProperty(t,n,l)}([n],o.prototype,"submitHandler",null);class a extends e{constructor(e,t){super("single-project",e,!1,t.id),this.project=t,this.configure(),this.renderContent()}get getPeople(){return this.project.people>1?` ${this.project.people} people`:" 1 person"}dragStartHandler(e){e.dataTransfer.setData("text/plain",this.project.id),e.dataTransfer.effectAllowed="move"}dragEndHandler(e){console.log("Dropped")}configure(){this.element.addEventListener("dragstart",this.dragStartHandler),this.element.addEventListener("dragend",this.dragEndHandler)}renderContent(){this.element.querySelector("h2").textContent=this.project.title,this.element.querySelector("h3").textContent=this.getPeople+" assigned",this.element.querySelector("p").textContent=this.project.description}}!function(e,t,n,r){var s,i=arguments.length,l=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,n,r);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(l=(i<3?s(l):i>3?s(t,n,l):s(t,n))||l);i>3&&l&&Object.defineProperty(t,n,l)}([n],a.prototype,"dragStartHandler",null);var c=function(e,t,n,r){var s,i=arguments.length,l=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,n,r);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(l=(i<3?s(l):i>3?s(t,n,l):s(t,n))||l);return i>3&&l&&Object.defineProperty(t,n,l),l};class d extends e{constructor(e){super("project-list","app",!1,`${e}-projects`),this.type=e,this.assignedProjects=[],this.configure(),this.renderContent()}dragOverHandler(e){var t;"text/plain"===(null===(t=e.dataTransfer)||void 0===t?void 0:t.types[0])&&(e.preventDefault(),this.element.querySelector("ul").classList.add("droppable"))}dropHandler(e){const t=e.dataTransfer.getData("text/plain");l.moveProject(t,"active"===this.type?r.Active:r.Finished)}dragLeaveHandler(e){this.element.querySelector("ul").classList.remove("droppable")}configure(){l.addListener((e=>{const t=e.filter((e=>"active"===this.type?e.status===r.Active:e.status===r.Finished));this.assignedProjects=t,this.setProjects()})),this.element.addEventListener("dragover",this.dragOverHandler),this.element.addEventListener("dragleave",this.dragLeaveHandler),this.element.addEventListener("drop",this.dropHandler)}renderContent(){const e=`${this.type}-projects-list`;this.element.querySelector("ul").id=e,this.element.querySelector("h2").textContent=this.type.toUpperCase()+" PROJECTS"}setProjects(){document.getElementById(`${this.type}-projects-list`).innerHTML="";for(const e of this.assignedProjects)new a(this.element.querySelector("ul").id,e)}}c([n],d.prototype,"dragOverHandler",null),c([n],d.prototype,"dropHandler",null),c([n],d.prototype,"dragLeaveHandler",null),new o,new d("active"),new d("finished")})();