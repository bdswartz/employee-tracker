const inquirer = require("inquirer");
const db = require("./db/connection");
// const { viewRoles, viewEmployees, viewEmplByManager } = require("./lib/view-data");
// const { addDepartment, addRole, addEmployee, updateEmpRole } = require("./lib/add-update-data");
const cTable = require('console.table');
const deptChoicesArray = [];

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

const promptUser = () => {
    return inquirer.prompt([{ 
    type: 'list',
    name: 'masterAction',
    message: 'Please choose an action from the list.',
    choices: ['View All Departments', 'View All Roles', 'View All Employees', 
    'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'View Department Budget', 'View Employees by Manager']
    }])
    .then(promptAnswers => {
        sqlCreate(promptAnswers);
    })
};


const sqlCreate = (promptAnswer) => {
    // let sql = ``;
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
        default:
            console.log(`entered default`)
            break;
    };
};

const viewDepartments = () => {
    sql = `SELECT * FROM department`;
    db.promise().query(sql)
    .then(([rows,fields]) => {
        return console.table("View Departments", rows);
    })
    .then(results => {
        promptUser();
    });
     
};

const viewRoles = () => {
    sql = `SELECT role.title, role.id, department.name AS department_name, role.salary 
    FROM role
    LEFT JOIN department ON role.department_id = department.id`;
    db.promise().query(sql)
    .then(([rows,fields]) => {
        console.table("View Roles", rows);
    })
    .then(results => {
        promptUser();
    });
};

const viewEmployees = () => {
    sql = `SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, 
    role.title AS Role, department.name AS Dept, role.salary AS Salary, 
    CONCAT(m.first_name, ' ', m.last_name) AS Manager_Name 
    FROM employee e 
    LEFT JOIN role ON e.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id 
    LEFT JOIN employee m ON m.id = e.manager_id`;
    db.promise().query(sql)
    .then(([rows,fields]) => {
        console.table("View Employees", rows);
    })
    .then (results => {
        promptUser()
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
            })
            .then(results => {
                promptUser();
            })
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
            })
            .then(results => {
                promptUser();
            })
        })
    });
};

const addDepartment = () => {
    // prompt user to choose a department
    inquirer.prompt(deptQuestion)
    .then(promptAnswer => {
        const deptSql = `INSERT INTO department (name) VALUES (?);`
        db.promise().query(deptSql, promptAnswer.deptName)
        .then(rows => {
            console.log(`${promptAnswer.deptName} was just added as a new department`);    
        })
        .then(results => {
            promptUser();
        });
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
        .then(results => {
            promptUser();
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
        })
        .then(results => {
            promptUser();
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
        .then(results => {
            promptUser();
        });
    });
};

promptUser();
