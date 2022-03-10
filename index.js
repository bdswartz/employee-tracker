const inquirer = require("inquirer");
const db = require("./db/connection");

const masterQuestions = [{
    type: 'list',
    name: 'masterAction',
    message: 'Please choose an action from the list.',
    choices: ['View Data', 'Add or Update Data', 'Delete Data']
}]

function routingMenu() {
    inquirer.prompt(masterQuestions)
    .then(promptAnswer => {
        if (promptAnswer.masterAction === 'View Data') {
            console.log("View Data")
        }
        else if (promptAnswer.masterAction === 'Add or Update Data') {
            console.log("Add or Update Data");
        }
        else {
            console.log("Delete Data");
        }
    })
};

routingMenu();
