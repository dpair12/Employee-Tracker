//Import Database
const { db } = require('../connection/server');

//Department Constructor Class
class Department {
    constructor(answers) {
        this.data = answers;
    }

    add () {
    const sqlcommand = `INSERT INTO department (name) VALUES (?);\n`;
    const values = [this.data.department];
    db.query(sqlcommand, values, (error) => {
    if (error) {
    console.error('Error adding deparment:', error);
    } else {
    console.log(`Successfully added ${this.data.department} to department table!`);
    }
    });
    }

}

//Role Constructor Class
class Role {
    constructor({name, salary, department_id}) {
        this.name = name;
        this.salary = salary;
        this.department_id = department_id;
    }

    add () {

        const sqlcommand = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);\n`;
        const values = [this.name, this.salary, this.department_id];

        db.query(sqlcommand, values, (error) => {
        if (error) {
            console.error('Error adding role:', error);
        } else {
        console.log(`Successfully added ${this.name} with a salary of ${this.salary} to role table!`);
        }
        });
    }
}

//Employee Constructor Class
class Employee {
    constructor({firstname, lastname, manager, role_id}) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.manager = manager;
        this.role_id = role_id;
    }

    add () {
        const sqlcommand = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        const values = [this.firstname, this.lastname, this.role_id, this.manager];
        
        db.query(sqlcommand, values, (error) => {
            if (error) {
                console.error('Error adding employee:', error);
            } else {
                console.log(`Successfully added ${this.firstname} ${this.lastname} to employee table!`);
            }
        });
    }
    

}

//Exports Constructor Classes for use in index.js
module.exports = { Department, Role, Employee };