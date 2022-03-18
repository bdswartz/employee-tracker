const inquirer = require("inquirer");
const db = require("./db/connection");
const { viewDepartments, viewRoles, viewEmployees, viewBudget, viewEmplByManager } = require("./lib/view-data");
const { addDepartment, addRole, addEmployee, updateEmpRole } = require("./lib/add-update-data");
const cTable = require('console.table');

// const employeeQuestions = [
//     {
//     type: 'input',
//     name: 'firstName',
//     message: "What is the employee's first name?",
//     },
//     {
//         type: 'input',
//         name: 'lastName',
//         message: "What is the employee's last name?",
//     },
//     {
//         type: 'input',
//         name: 'roleTitle',
//         message: "What is the new employee's role?",
//     },
//     {
//         type: 'input',
//         name: 'managerName',
//         message: "What is the first and last name of the new employee's manager?",
//     }
// ];


// const updateEmployee = [
//     { 
//     type: 'list',
//     name: 'employee',
//     message: 'Please choose which employee you would like to update.',
//     choices: employeeChoices
//     },
//     {
//         type: 'input',
//         name: 'title',
//         message: 'What is the new role for this employee?',
//     }
// ];

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
            // sql = `SELECT * FROM department`;
            // db.promise().query(sql)
            // .then(([rows,fields]) => {
            //     console.table(rows);
            // });
            viewDepartments();
            break;
        case 'View All Roles':
            // sql = `SELECT role.title, role.id, department.name AS department_name, role.salary 
            // FROM role
            // LEFT JOIN department ON role.department_id = department.id`;
            // db.promise().query(sql)
            // .then(([rows,fields]) => {
            //     console.table(rows);
            // });
            viewRoles();
            break;
        case 'View All Employees':
            // sql = `SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, role.title AS Role, department.name AS Dept, role.salary AS Salary, m.first_name AS Manager, m.last_name AS Name FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee m ON m.id = e.manager_id`;
            // db.promise().query(sql)
            // .then(([rows,fields]) => {
            //     console.table(rows);
            //  });
            viewEmployees();
                break;
        case 'Add a Department':
            // inquirer.prompt(deptQuestion)
            // .then(promptAnswer => {
            //     const deptSql = `INSERT INTO department (name) VALUES (?);`
            //     db.promise().query(deptSql, promptAnswer.deptName)
            // .then( rows => {
            //     console.log(`${promptAnswer.deptName} was just added as a new department`);    
            //     })
            // })
            addDepartment();
            break;
        case 'Add a Role':
            // inquirer.prompt(roleQuestions)
            // .then(roleAnswers => {
            //     const deptSql = `INSERT INTO role (title,salary,department_id) 
            //         VALUES ('${roleAnswers.title}', '${roleAnswers.salary}', 
            //         (SELECT id FROM department WHERE name = '${roleAnswers.department}'));`
            //     db.promise().query(deptSql)
            // .then(rows => {
            //     console.log(`${rows[0].affectedRows} row written to table`)
            //     })
            // })
            addRole();
            break;
        case 'Add an Employee':
            // inquirer.prompt(employeeQuestions)
            // .then(roleAnswers => {
            //     const emplSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
            //         VALUES ('${roleAnswers.firstName}', '${roleAnswers.lastName}', 
            //         (SELECT id FROM role WHERE title = '${roleAnswers.roleTitle}'), 
            //         (SELECT id FROM employee m WHERE CONCAT(m.first_name, ' ',m.last_name) = '${roleAnswers.managerName}'));`
            //     db.promise().query(emplSql)
            // .then(rows => {
            //     console.log(`${rows[0].affectedRows} row written to table`)
            //     })
            // })
            addEmployee();
            break;
        case 'Update an Employee Role':
            // // Query departments for prompt list choices
            // const sqlNames = `SELECT CONCAT(first_name, ' ',last_name) AS name FROM employee`;
            //     db.promise().query(sqlNames)
            //     .then(([row,fields]) => {
            //         // console.log(row);
            //         let employeeChoices = [];
            //         for (let index = 0; index < row.length; index++) {
            //             employeeChoices[index] = row[index].name;
            //         };
            //     return inquirer.prompt([
            //         { 
            //         type: 'list',
            //         name: 'employee',
            //         message: 'Please choose which employee you would like to update.',
            //         choices: employeeChoices
            //         },
            //         {
            //             type: 'input',
            //             name: 'title',
            //             message: 'What is the new role for this employee?',
            //         }
            //     ])
            //     })
            //     .then(roleAnswers => {
            //         const emplSql = `UPDATE employee SET role_id = (SELECT id FROM role WHERE title = '${roleAnswers.title}') 
            //         WHERE CONCAT(employee.first_name, ' ',employee.last_name) = '${roleAnswers.employee}'`
            //         db.promise().query(emplSql)
            //     .then(rows => {
            //         console.log(`${rows[0].affectedRows} row written to table`)
            //         })
            //     })
            updateEmpRole();
                break;// prompt user to choose an employee
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
    // .then(stuff => {
        // return init();
    // })
    .catch(err => {
        console.log(err)
    });
};

init();


