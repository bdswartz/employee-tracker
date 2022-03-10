const db = require('../../db/connection');
const inquirer = require("inquirer");

const addQuestions = [{
    type: 'list',
    name: 'addAction',
    message: 'Please choose an action from the list.',
    choices: ['Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Update an Employee Manager']
}]

// module.exports {}