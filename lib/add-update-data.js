const db = require('../db/connection');
const inquirer = require("inquirer");

const deptQuestion = [{
    type: 'input',
    name: 'deptName',
    message: 'What is the name of the department you wish to add?',
}];

const roleQuestions = [
    {
        type: 'input',
        name: 'title',
        message: 'What is the name of the role you wish to add?',
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary for the role you wish to add?',   
    },
    {
        type: 'input',
        name: 'department',
        message: 'What department does this belong to?',   
    }
];

const employeeQuestions = [
    {
        type: 'input',
        name: 'firstName',
        message: "What is the employee's first name?",
    },
    {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
    },
    {
        type: 'input',
        name: 'roleTitle',
        message: "What is the new employee's role?",
    },
    {
        type: 'input',
        name: 'managerName',
        message: "What is the first and last name of the new employee's manager?",
    }
];

const addDepartment = () => {
    // prompt user to choose a department
    inquirer.prompt(deptQuestion)
    .then(promptAnswer => {
        const deptSql = `INSERT INTO department (name) VALUES (?);`
        db.promise().query(deptSql, promptAnswer.deptName)
        .then(rows => {
            console.log(`${promptAnswer.deptName} was just added as a new department`);    
        })
    })
};

const addRole = () => {
    let useRoleAnswers;
    inquirer.prompt(roleQuestions)
    .then(roleAnswers => {
        useRoleAnswers = roleAnswers;
        const deptSql = `INSERT INTO role (title,salary,department_id) 
        VALUES ('${roleAnswers.title}', '${roleAnswers.salary}', 
        (SELECT id FROM department WHERE name = '${roleAnswers.department}'));`
        db.promise().query(deptSql)
        .then(rows => {
            console.log(`${useRoleAnswers.title} was just added to the ${useRoleAnswers.department} department`)
        })
    })
};

const addEmployee = () => {
    let useRoleAnswers;
    inquirer.prompt(employeeQuestions)
    .then(roleAnswers => {
        useRoleAnswers = roleAnswers;
        const emplSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
        VALUES ('${roleAnswers.firstName}', '${roleAnswers.lastName}', 
        (SELECT id FROM role WHERE title = '${roleAnswers.roleTitle}'), 
        (SELECT id FROM employee m WHERE CONCAT(m.first_name, ' ',m.last_name) = '${roleAnswers.managerName}'));`
        db.promise().query(emplSql)
        .then(rows => {
            console.log(`${useRoleAnswers.firstName} ${useRoleAnswers.lastName} was just added as an employee`)
        });
    });
};
const updateEmpRole = () => {
    let useRoleAnswers;
    // Query departments for prompt list choices
    const sqlNames = `SELECT CONCAT(first_name, ' ',last_name) AS name FROM employee`;
    db.promise().query(sqlNames)
    .then(([row,fields]) => {
        // console.log(row);
        let employeeChoices = [];
        for (let index = 0; index < row.length; index++) {
            employeeChoices[index] = row[index].name;
        };
    return inquirer.prompt([
        { 
            type: 'list',
            name: 'employee',
            message: 'Please choose which employee you would like to update.',
            choices: employeeChoices
        },
        {
            type: 'input',
            name: 'title',
            message: 'What is the new role for this employee?',
        }
    ])
    })
    .then(roleAnswers => {
        useRoleAnswers = roleAnswers;
        const emplSql = `UPDATE employee SET role_id = (SELECT id FROM role WHERE title = '${roleAnswers.title}') 
        WHERE CONCAT(employee.first_name, ' ',employee.last_name) = '${roleAnswers.employee}'`
        db.promise().query(emplSql)
    .then(rows => {
        console.log(`${useRoleAnswers.employee}'s Role was updated to ${useRoleAnswers.title}`)
        })
    })
};

module.exports = { addDepartment, addRole, addEmployee, updateEmpRole };