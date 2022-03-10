const db = require('../../db/connection');
const inquirer = require("inquirer");

const deleteQuestions = [{
    type: 'list',
    name: 'deleteAction',
    message: 'Please choose an action from the list.',
    choices: ['Delete a Department', 'Delete a Role', 'Delete an Employee']
}]

// module.exports {}