const inquirer = require("inquirer");
const db = require("./db/connection");
const { viewDepartments, viewRoles, viewEmployees, viewBudget, viewEmplByManager } = require("./lib/view-data");
const { addDepartment, addRole, addEmployee, updateEmpRole } = require("./lib/add-update-data");
const cTable = require('console.table');

const masterPrompt = 
    [{ 
    type: 'list',
    name: 'masterAction',
    message: 'Please choose an action from the list.',
    choices: ['View All Departments', 'View All Roles', 'View All Employees', 
    'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'View Department Budget', 'View Employees by Manager']
    }];


sqlCreate = (promptAnswer) => {
    let sql = ``;
    switch (promptAnswer.masterAction) {
        case 'View All Departments':
            viewDepartments();
            break;
        case 'View All Roles':
            viewRoles();
            break;
        case 'View All Employees':
            viewEmployees();
                break;
        case 'Add a Department':
            addDepartment();
            break;
        case 'Add a Role':
            addRole();
            break;
        case 'Add an Employee':
            addEmployee();
            break;
        case 'Update an Employee Role':
            updateEmpRole();
                break;
        case 'View Department Budget':
            viewBudget();
            break;
        case 'View Employees by Manager':
            viewEmplByManager();
            break;
    };
};


function init() {
    return inquirer.prompt(masterPrompt)
    .then(promptAnswers => {
        return sqlCreate(promptAnswers);
    })
    .catch(err => {
        console.log(err)
    });
};

init();


