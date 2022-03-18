// const db = require('../../db/connection');
const inquirer = require("inquirer");
const db = require("../db/connection");
const deptChoicesArray = [];
const cTable = require('console.table');

const budgetQuestions = [{
    type: 'list',
    name: 'budgetDept',
    message: "Please choose which Department's budget you want to view",
    choices: deptChoicesArray
}]

function viewDepartments() {
    sql = `SELECT * FROM department`;
    db.promise().query(sql)
    .then(([rows,fields]) => {
        console.table("View Departments", rows);
    });
};
function viewRoles() {
    sql = `SELECT role.title, role.id, department.name AS department_name, role.salary 
    FROM role
    LEFT JOIN department ON role.department_id = department.id`;
    db.promise().query(sql)
    .then(([rows,fields]) => {
        console.table("View Roles", rows);
    });
};

const viewQuestions = [{
    type: 'list',
    name: 'viewAction',
    message: 'Please choose an action from the list.',
    choices: ['View All Roles', 'View All Employees', 'View Employees by Manager', 'View Employees by Department', 'View Department Budget']
}];
const viewEmployees = () => {
    sql = `SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, role.title AS Role, department.name AS Dept, role.salary AS Salary, m.first_name AS Manager, m.last_name AS Name FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee m ON m.id = e.manager_id`;
    db.promise().query(sql)
    .then(([rows,fields]) => {
        console.table("View Employees", rows);
    });
};


const viewBudget = () => {
    let useDeptChoice;
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
        inquirer.prompt({
            type: 'list',
            name: 'budgetDept',
            message: "Please choose which Department's budget you want to view",
            choices: deptChoicesArray
        })
        .then(promptAnswer => {
           useDeptChoice = promptAnswer.budgetDept;
           sql = `SELECT SUM(role.salary) AS budget
            FROM employee
            LEFT JOIN role ON role_id = role.id
            LEFT JOIN department ON department_id = department.id
            WHERE department.name = '${useDeptChoice}'`;
            db.promise().query(sql)
            .then(([row,fields]) => {
                let {budget} = row[0];
                console.log(budget);
                console.log(`The total budget for the ${useDeptChoice} department is $${budget}`);
            });
        })
    });
};

const viewEmplByManager = () => {
    let mngrChoicesArray = [];
    let useMngrChoice;
    // Query departments for prompt list choices
    const sqlDept = `SELECT CONCAT(first_name, ' ',last_name) AS name FROM employee WHERE manager_id IS NULL;`;
    db.promise().query(sqlDept)
    .then(([row,fields]) => {
        // console.log(row);
        // assign query results to choice array
        for (let index = 0; index < row.length; index++) {
            mngrChoicesArray[index] = row[index].name;
        };
        // prompt user to choose a department
        inquirer.prompt({
            type: 'list',
            name: 'manager',
            message: "Please choose the manager of the employees you would like to view.",
            choices: mngrChoicesArray
        })
        .then(promptAnswer => {
           useMngrChoice = promptAnswer.manager;
           sql = `SELECT CONCAT(e.first_name, ' ',e.last_name) AS name
            FROM employee e
            LEFT JOIN employee m ON e.manager_id = m.id
            WHERE CONCAT(m.first_name, ' ',m.last_name) = '${useMngrChoice}'`;
            db.promise().query(sql)
            .then(([rows,fields]) => {
                console.table(rows);
            });
        })
    });
};

module.exports = { viewDepartments, viewRoles, viewEmployees, viewBudget, viewEmplByManager };