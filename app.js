// @ts-nocheck
// Define UI Vars
const idGenerator = IdGenerator();
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');


const items = [];





function loadEventListeners() {
  form.addEventListener('submit',postTasks)
  filter.addEventListener('keyup',filterSearch)
  clearBtn.addEventListener('click',clearItems)
}

//id generator
function* IdGenerator() {
  let id = 0;
  while(true){
    yield id++
  }
}

// component:
class Component {
  constructor(){
    this.state = JSON.parse(window.localStorage.getItem('state')) || [];
    this.clearItems = this.clearItems.bind(this);
  }
  
  addItem(item) {
    if(this.checkForIds(item.id)) {
      throw new Error("already have an item with that id");
    }
    this.state.push(item)
    window.localStorage.setItem('state',JSON.stringify(this.state))
    
    this.render(this.state)
  }
  
  removeItem = (e) => {
    const index = this.getIndexById(e.target.id)
    this.state.splice(index,1)
    window.localStorage.setItem('state',JSON.stringify(this.state))
    this.addTaskEvents()
    this.render(this.state)
  }

  filteItems = (text) => {
    return this.state.filter(item=>item.title.includes(text))

  }

  clearItems() {
    this.state = []
    window.localStorage.setItem('state','[]')
    this.render(this.state)
  }
  
  getIndexById(id) {
    console.log(id)
    return  this.state.findIndex(e => e.id.toString() === id)
  }
  
  keys() {
    return this.state.map(item =>item.id)
  }
  
  
  
  checkForIds(idForCheck) {
    return this.keys().some(id => id === idForCheck);
  }

  addTaskEvents() {
  const icons = taskList.querySelectorAll('i')
  icons.forEach(i => i.addEventListener('click',this.removeItem))
  }



  
  render  (items) {
    
    let list='' 
    items.forEach(t => {
      list += `
      <li  id="${t.id}" class="collection-item">
      ${t.title}
      <a class="delete-item secondary-content">
      <i  class="fa fa-remove"></i>
      </a>
      </li>`
      
    });
    
    taskList.innerHTML = this.state.length>0?list:"";
    this.addTaskEvents()
    
  }
}

const listComponent = new Component();
listComponent.render(listComponent.state)



function postTasks(e) {
  e.preventDefault();
  const task = {
    id:idGenerator.next().value,
    title:taskInput.value
  }
  listComponent.addItem(task)
  
  
}

function filterSearch(e) {
  let {value} = e.target
  
  const items = listComponent.filteItems(value)
  
  if(value) 
    listComponent.render(items);
  else 
    listComponent.render(listComponent.state)
}

function clearItems() {
  listComponent.clearItems()
}







// Load all event listeners
loadEventListeners()





