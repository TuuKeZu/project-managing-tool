// actually let's use class

class parent_project_data{
    constructor(name = String, due = String){
        this.name = name;
        this.due = due;
    }
}



// same thing as yesterday
document.addEventListener('DOMContentLoaded', () => {
    Initalize();
});

function Initalize(){
    console.log('Ready!');
    appendParentProject(new parent_project_data("test", "today"));

    // LISTENERS
    const createNewButton = document.getElementById('NEW-PROJECT');
    
    createNewButton.addEventListener("click", () => {
        appendParentProject(new parent_project_data("test", "today"));
    });
}

function appendParentProject(data = parent_project_data){
    // this should work
    const CONTAINER = document.getElementById('GRID_CONTAINER');

    let grid_object = document.createElement('div');
    grid_object.className = "parent-project";

    let grid_object_data = document.createElement('div');
    grid_object_data.className = "parent-project-data";

    let nameField = document.createElement('h1')
    nameField.textContent = data.name;

    let dueField = document.createElement('h2')
    dueField.textContent = `Due to ${data.due}`;


    grid_object_data.appendChild(nameField);
    grid_object_data.appendChild(dueField);

    grid_object.appendChild(grid_object_data);
    CONTAINER.appendChild(grid_object);
}

