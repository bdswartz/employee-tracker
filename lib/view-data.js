const db = require('../../db/connection');
const inquirer = require("inquirer");
let deptChoicesArray = [];

const budgetQuestions = [{
    type: 'list',
    name: 'budgetAction',
    message: "Please choose which Department's budget you want to view",
    choices: deptChoicesArray
}]

const viewQuestions = [{
    type: 'list',
    name: 'viewAction',
    message: 'Please choose an action from the list.',
    choices: ['View All Roles', 'View All Employees', 'View Employees by Manager', 'View Employees by Department', 'View Department Budget']
}]


function viewDeptBudget() {
    // Query departments for prompt list choices
    const sqlDept = `SELECT department.name FROM department`;
    db.promise().query(sqlDept)
    .then(([row,fields]) => {
        // console.log(row);
        // assign query results to choice array
        for (let index = 0; index < row.length; index++) {
            deptChoicesArray[index] = row[index].name;
        };
        // prompt user to choose a department
        inquirer.prompt(budgetQuestions)
        .then(promptAnswer => {
           const sqlBudget = promptAnswer.budgetAction
        })
    });
};

// module.exports {}
