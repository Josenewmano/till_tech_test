#!/usr/bin/env node

const inquirer = require('inquirer');
const inquirerPrompt = require('inquirer-table-prompt');
const InterruptedPrompt = require("inquirer-interrupted-prompt");
InterruptedPrompt.replaceAllDefaults(inquirer);
inquirer.registerPrompt("table", InterruptedPrompt.from(inquirerPrompt));

const mongoose = require("mongoose");

const History = require("./models/history");
const Order = require("./models/order");
const Till = require('./lib/till');
const AnswersInterpreter = require('./lib/answersInterpreter');
const till = new Till;
const interpreter = new AnswersInterpreter;
const { allTables, questions } = require('./lib/inquirerVariables');

const printOrPayForMuffin = (answers) => 
  (answers.what_action === 'Print a receipt' || 
  answers.what_action === 'Take payment for an order') && 
  till.isThereAMuffin(answers.table)

const cashMessage = (answers) => 
`The customer's final total is $${till.showTotal(answers.table, answers.muffin_discount)}.
How much are they paying?`

questions[6].when = printOrPayForMuffin;
questions[7].message = cashMessage;
let output = '';


const runMenu = async() => {
  await mongoose.connect('mongodb://127.0.0.1/till', { useNewUrlParser: true, useUnifiedTopology: true });
  const orders = await Order.find();
  till.orders = orders;
  while(output !== 'Thanks and bye bye!') {
    [questions[1].choices, questions[2].choices] = till.updateTables(allTables);
    await inquirer.prompt(questions)
    .then((answers) => {
      console.clear();
      output = interpreter.response(answers, till);
      console.log(output);
    })
    .catch(() => {
      console.clear();
    })
  }
  await mongoose.connection.collections.orders.drop();
  await Order.insertMany(till.orders);
  await History.insertMany(till.completeOrders);
  await mongoose.connection.close();
}

runMenu()
