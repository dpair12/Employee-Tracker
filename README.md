## Employee Tracker

## Project Description

This is a MySQL application that acts as a way to allow companies to manage their organization's structure so everyone can know who works in what department and who they report to. Using the Challenge 12 ReadMe as a guide, this application allows users to add  employees, roles, and departments as well as having the ability to view them all individually as tables.

## Table of Contents

[Application-Demo](#Application-Demo)
[Installation](#Installation)
[Usage](#Usage)
[License](#License)
[Contributing](#Contributing)
[Tests](#Tests)
[Questions](#Questions)


## Application-Demo

https://www.youtube.com/watch?v=469dqDp3b70

## Installation

Prior to running application, please be sure to install inquirer (npm i inquirer@8.2.4) and mysql2 (npm i mysql2) as well as running npm i to install any remaining packages needed for application to run. Next, open server.js file in connection directory and enter mysql password into designated field. Finally, log into mysql in the terminal and run the command SOURCE db/schema.sql; to execute the schema template and create the database. Once all of these steps have been completed, run node index.js in the terminal the start the application.

## Usage

Please feel free to use this application however you see fit.

## License

No license is associated with this project. 

## Contributing

I am the sole contributor of this project.

## Tests

Various tests have been performed to get the application to function in its current state which mainly involved getting the database to properly respond to queries being made especially when dealing with join statements that rely on primary and foreign keys. Beyond this, the other tests that were performed were just to ensure that answers from inquirer prompts were being passed properly to constructor classes.

## Questions

Link to Github Profile: https://github.com/dpair12

