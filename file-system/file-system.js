const electron = require('electron');
const path = require('path');
const fs = require('fs');

const defauldData = require('./default.json');


const options_data = {
    strorageFileName: ""
}

const project_data = {
    projects: [
        {
            name: String,
            due: String,
            subProjects: [
                {
                    name: String,
                    textContent: String
                }
            ]
        }
    ]
}


class Storage{
    constructor(options = options_data){
        this.options = options;
        this.path = "";
        this.data = project_data;
    }

    //#region public methods
        //#region get
    getProjectList() {
        let projectList = [];

        this.data.projects.forEach(project => {
            projectList.push({name: project.name, due: project.due});
        });

        return projectList;
    }

    getSubprojectList(projectIndex = Number) {
        let subProjectList = [];

        if(!this.projectExists( projectIndex )){ console.log(`Couldn't locate project ${projectIndex}`); return null; }

        this.data.projects[projectIndex].subProjects.forEach(subProject => {
            subProjectList.push({name: subProject.name});
        });

        return subProjectList;
    }

    getSubprojectTextContent({projectIndex = Number, subprojectIndex = Number}) {
        let textContent = "";

        if(!this.subprojectExists( {projectIndex: projectIndex, subprojectIndex: subprojectIndex} )){ console.log(`Couldn't locate subproject [${projectIndex}, ${subprojectIndex}]`); return null; }

        textContent = this.data.projects[projectIndex].subProjects[subprojectIndex].textContent;

        return textContent;
    }
        //#endregion

        //#region set
    setSubprojectTextContent({projectIndex = Number, subprojectIndex = Number}, textContent = String){

        if(!this.subprojectExists( {projectIndex: projectIndex, subprojectIndex: subprojectIndex} )){ console.log(`Couldn't locate subproject [${projectIndex}, ${subprojectIndex}]`); return null; }

        this.data.projects[projectIndex].subProjects[subprojectIndex].textContent = textContent;

        return 200;
    }
        //#endregion
    //#endregion

    projectExists(projectIndex = Number){
        return this.data.projects[projectIndex] != null;
    }

    subprojectExists({projectIndex = Number, subprojectIndex = Number}){
        if(this.data.projects[projectIndex] != null){
            if(this.data.projects[projectIndex].subProjects[subprojectIndex] != null){
                return true;
            }
        }

        return false;
    }

    async save() {
        
        return new Promise((resolve, reject) => {

            try {

                fs.writeFileSync(this.path, JSON.stringify(this.data));

                return resolve(200);

            } catch (e) {
                return reject(e.code);
            }

        });
    }



    async Initialize(){

        return new Promise(async (resolve, reject) => {

            this.path = this.InitializePath(this.options.strorageFileName);
            this.data = await this.InitializeData(this.path).catch(e => {
                return reject(e);
            });
            
            return resolve(200);

        });
    }



    // INITIALIZE THE PATH FOR STORAGE FILE
    InitializePath(fileName = String){
        const dataPath = (electron.app || electron.remote.app).getPath('userData');

        return path.join(dataPath, `${fileName}.json`);
    }

    // TRY TO ACCESS LOCAL DATA
    async InitializeData(filePath = String){

        return new Promise((resolve, reject) => {

            // TRY TO ACCESS STORAGE FILE
            try {
                const FileData = fs.readFileSync(filePath);
    
                // TRY TO PARSE .json STORAGE FILE
                try {
    
                    const data = JSON.parse(FileData);
    
                    setTimeout(() => {

                        return resolve(data);

                    }, 1000);
    
                } catch (e) {
    
                    return reject(null);
                }
    
            } catch (e) {
    
                switch(e.code){
                    case 'ENOENT':
    
                        console.log(`File not found - ${filePath}. Generating missing file`);
                        
                        setTimeout(() => {
                            
                            this.createStrorageFile(filePath, (status) => {
                                switch(status){
                                    case 200:
    
                                        return resolve(defauldData);
    
                                    default:
    
                                        return reject(status);
                                }
                            });

                        }, 1000);
                        
                        
                        return;
                }
                return reject(e.code);
            }
        });
    }

    // CREATE STORAGE FILE IN CASE IT'S MISSING
    createStrorageFile(filePath = String, status){

        console.log(`Creating Storage file at ${filePath}`);

        try {
            
            fs.writeFileSync(filePath, JSON.stringify(defauldData));
            return status(200);

        } catch (e) {

            console.log(`error occured while creating and reading file at ${filePath}`);
            return status(e.code);

        }
    }
}

module.exports = {Storage};