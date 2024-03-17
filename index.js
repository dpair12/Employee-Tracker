//Imports Database
const { db } = require('./connection/server');
//Imports Inquirer
const inquirer = require('inquirer');
//Imports Constructor Classes
const {Department, Employee, Role } = require('./constructor-classes/db');

//Main Question
const question = (`What would you like to do?`);
//Main Prompt
const promptUser = () => {
     inquirer.prompt([
        {
            type: 'list',
            name: 'function',
            message: question,
            choices: ['View All Departments', 'Add Department', 'View All Roles', 'Add Role', 'View All Employees', 'Add Employee', 'Update Employee Role', 'Quit']
        
        }
        ])
    //Conditional Statements for each answer choice for it to carry out a specific function
    .then((answers) => {
            //Add Department 
            if (answers.function === 'Add Department') {
            adddepartments();
            //View All Departments
            } else if (answers.function === 'View All Departments') {
            //Retrieves everything from department table
            db.query(`SELECT * FROM department`, (error, results) => {
            if (error) {
            console.error('Error displaying department table:', error);
            return;
            }
            console.table(results);
            });
            //Initialize promptUser function after finishing task
            promptUser();
            //Add Role
            } else if (answers.function === 'Add Role') {
            addroles();
            } else if (answers.function === 'View All Roles') {
            //Retrieves attributes from role table and joins the table together with the department table
            db.query(`SELECT role.id AS role_id, role.title AS role_title, role.salary AS role_salary, department.name AS department_name
              FROM role 
              JOIN department ON role.department_id = department.id`, (error, results) => {
            if (error) {
            console.error('Error displaying role table:', error);
            return;
            }
            console.table(results);
            });
            //Initialize promptUser function after finishing task
            promptUser();
            //Add Employee
            } else if (answers.function === 'Add Employee') {
            addemployee();    
            //View All Employees
            } else if (answers.function === 'View All Employees') {
            //Retrieves attributes from employee table and joins it with department and role tables
            db.query(`SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS role_title, d.name AS department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
               FROM employee e
               LEFT JOIN role r ON e.role_id = r.id
               LEFT JOIN department d ON r.department_id = d.id
               LEFT JOIN employee m ON e.manager_id = m.id`, (error, results) => {
            if (error) {
            console.error('Error displaying employee table:', error);
            return;
            }
        console.table(results);
        //Initialize promptUser function after finishing task
        promptUser();
        }); 
            //Update Employee Role
            } else if (answers.function === 'Update Employee Role') {
            updateemployee();
            //Quit Application
            } else if (answers.function === 'Quit') {
            db.end();
            } 
        });

}


//Function to Add Departments
const adddepartments = () => {
    const questions = [`What is the name of the department?`];
    inquirer.prompt([
    {
        type: 'input',
        name: 'department',
        message: questions[0]
    }
    ])
    .then((answers) => {
    //Takes answers and passes it to constructor class to make a new department
    const newDepartment = new Department(answers);
    //Passes newDepartment value to add method within Department constructor class
    newDepartment.add();
   //Initialize promptUser function after finishing task
    promptUser();
    })
    }
    
    
    //Function to Add Roles
    const addroles = () => {
        // Retrieve the list of departments from the database
        db.query(`SELECT * FROM department`, (error, results) => {
            if (error) {
                console.error('Error retrieving departments:', error);
                return;
            }
    
            // Extract department names from the results
            const departmentChoices = results.map((department) => department.name);
    
            const questions = ['What is the name of the role?', 'What is the salary of the role?', 'Which department does the role belong to?'];
    
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: questions[0]
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: questions[1]
                },
                {
                    type: 'list',
                    name: 'department',
                    message: questions[2],
                    choices: departmentChoices
                }
            ])
            .then((answers) => {
                // Find the department ID based on the selected department name
                const selectedDepartment = results.find((department) => department.name === answers.department);
                if (!selectedDepartment) {
                    console.error('Error: Selected department not found.');
                    return;
                }
                const department_id = selectedDepartment.id;
    
                //Takes answers and passes it to constructor class to make a new role
                const newRole = new Role({ name: answers.name, salary: answers.salary, department_id });
                //Passes newRole value to add method within Department constructor class
                newRole.add();
                //Initialize promptUser function after finishing task
                promptUser();
            });
        });
    }

//Function to Add Employees
const addemployee = () => {
 // Retrieve the list of departments from the database
 db.query(`SELECT * FROM role`, (error, results) => {
    if (error) {
        console.error('Error retrieving roles:', error);
        return;
    }
// Extract role titles from the results
const rolechoices = results.map((role) => {return {name: role.title, value: role.id}});
//Retrieve list of employee names and ids
db.query(`SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee`, (error, results) => {
if (error) {
console.error('Error retrieving employees:', error);
return;
}
//Extracts employee names from the results -- this is being done to allow user to choose manager for employee (if any)
const managerchoices = results.map((employee) => {return {name: employee.name, value: employee.id}});

    const questions = [`What is the employee's first name?`, `What is the employee's last name`, `What is the employee's role?`, `Who is the employee's manager?`];
    inquirer.prompt([
    {
        type: 'input',
        name: 'firstName',
        message: questions[0]
    
    },
    {
        type: 'input',
        name: 'lastName',
        message: questions[1]
    },
    {
        type: 'list',
        name: 'role',
        message: questions[2],
        choices: rolechoices
    },
    {
        type: 'list',
        name: 'manager',
        message: questions[3], 
        choices: [{name: 'None', value: null}, ...managerchoices]
    }

    ])
    .then((answers) => {

      //Takes answers and passes it to constructor class to add a new employee
      const newEmployee = new Employee({ firstname: answers.firstName, lastname: answers.lastName, manager: answers.manager, role_id: answers.role});
      //Passes newEmployee value to add method within Department constructor class
      newEmployee.add();
    //Initialize promptUser function after finishing task
      promptUser();
});

});
});
}

//Function to Update Employee Role for existing employees
const updateemployee = () => {
    let employees;
    let roles;
//Retrieves list of employees
    db.query(`SELECT CONCAT(first_name, " ", last_name) AS name, id FROM employee`, (error, employeeResults) => {
        if (error) {
            console.error('Error retrieving employees:', error);
            return;
        }
        
        employees = employeeResults;

        const employeeChoices = employees.map((employee) => employee.name);
//Retrieves list of job titles 
        db.query(`SELECT title, id FROM role`, (error, roleResults) => {
            if (error) {
                console.error('Error retrieving roles:', error);
                return;
            }
            
            roles = roleResults;

            const roleChoices = roles.map((role) => role.title);

            const questions = [`Which employee's role do you want to update?`, `Which role do you want to assign?`];

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: questions[0],
                    //Select employee
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    name: 'role',
                    message: questions[1],
                    //Select new role to assign to employee
                    choices: roleChoices
                }
            ]).then((answers) => {
                const selectedEmployee = employees.find((employee) => employee.name === answers.employee);
                const selectedRole = roles.find((role) => role.title === answers.role);

                const employeeId = selectedEmployee.id;
                const roleId = selectedRole.id;

                // Update the employee's role in the database
                db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [roleId, employeeId], (error) => {
                    if (error) {
                        console.error('Error updating employee role:', error);
                        return;
                    }
                    console.log('Employee role updated successfully!');
                    //Initialize promptUser function after finishing task
                    promptUser();
                });
            });
        });
    });
};

//Initialize promptUser function before doing anything else
promptUser();

