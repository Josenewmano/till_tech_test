#!/usr/bin/env node

const inquirer = require('inquirer');
const inquirerPrompt = require('inquirer-table-prompt');
inquirer.registerPrompt("table", inquirerPrompt);

const mongoose = require("mongoose");

const History = require("./models/history");
const Order = require("./models/order");
const Till = require('./till');

const allTables = [
  'Takeaway', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'                
]

const menuColumns = [
  {
    name: "  0",
    value: undefined
  },
  {
    name: "  1",
    value: 1
  },
  {
    name: "  2",
    value: 2
  },
  {
    name: "  3",
    value: 3
  },
  {
    name: "  4",
    value: 4
  },
  {
    name: "  5",
    value: 5
  },
  {
    name: "  6",
    value: 6
  },
  {
    name: "  7",
    value: 7
  },
  {
    name: "  8",
    value: 8
  },
  {
    name: "  9",
    value: 9
  }
]

const menuRows = [
  {
    name: "Cafe Latte",
  },
  {
    name: "Flat White",
  },
  {
    name: "Cappucino",
  },
  {
    name: "Single Espresso",
  },
  {
    name: "Double Espresso",
  },
  {
    name: "Americano",
  },
  {
    name: "Cortado",
  },
  {
    name: "Tea",
  },
  {
    name: "Choc Mudcake",
  },
  {
    name: "Choc Mousse",
  },
  {
    name: "Affogato",
  },
  {
    name: "Tiramisu",
  },
  {
    name: "Blueberry Muffin",
  },
  {
    name: "Chocolate Chip Muffin",
  },
  {
    name: "Muffin Of The Day",
  }
]

const choicesArray = [
  'Cafe Latte',
  'Flat White',
  'Cappucino',
  'Single Espresso',
  'Double Espresso',
  'Americano',
  'Cortado',
  'Tea',
  'Choc Mudcake',
  'Choc Mousse',
  'Affogato',
  'Tiramisu',
  'Blueberry Muffin',
  'Chocolate Chip Muffin',
  'Muffin Of The Day'
]

function itemsObjectMaker(quantitiesArray) {
  if(quantitiesArray === undefined) { return }
  let result = {}
  choicesArray.forEach((choice, i) => result[choice] = quantitiesArray[i]);
  Object.keys(result).forEach(key => {
    if (result[key] === undefined) {
      delete result[key];
    }
  });
  return result
}

const createOrAdd = (answers) => 
  answers.what_action === 'Create an order' || 
  answers.what_action === 'Add to an order'

const onCreate = (answers) => 
  answers.what_action === 'Create an order'

const onPay = (answers) => 
  answers.what_action === 'Take payment for an order'

const notClose = (answers) => 
  answers.what_action === 'Create an order' || 
  answers.what_action === 'Add to an order' || 
  answers.what_action === 'Print a receipt' || 
  answers.what_action === 'Take payment for an order'

const printOrPay = (answers) => 
  answers.what_action === 'Print a receipt' || 
  answers.what_action === 'Take payment for an order'

const questions = [
  {
    name: "what_action",
    type: "list",
    message: "Choose an option:",
    choices: [
      'Create an order', 
      'Add to an order', 
      'Print a receipt', 
      'Take payment for an order', 
      'Close the till'
    ]
  },
  {
    name: "what_table",
    type: "list",
    message: "What table?",
    choices: allTables,
    when: notClose
  },
  {
    type: "table",
    name: "what_items",
    message: "Select the items:",
    pageSize: 15,
    columns: menuColumns,
    rows: menuRows,
    when: createOrAdd
  },
  {
    name: "what_names",
    type: "input",
    message: "Add the names of the customers:",
    when: onCreate
  },
  {
    name: "how_many_customers",
    type: "number",
    message: "How many customers are there?",
    when: onCreate
  },
  {
    name: "is_there_a_muffin_discount",
    type: "confirm",
    message: "Does the customer have a muffin discount voucher?",
    when: printOrPay
  },
  {
    name: "how_much_cash",
    type: "number",
    message: "How much cash have they paid?",
    when: onPay
  },
]

function showMenu() {
  return inquirer.prompt(questions)
}

let finished = false

const runMenu = async() => {
  await mongoose.connect('mongodb://127.0.0.1/till', { useNewUrlParser: true, useUnifiedTopology: true });
  const orders = await Order.find();
  const till = new Till(undefined, undefined, orders);  
  console.log(till);
  while(finished !== true) {
    await showMenu()
    .then((answers) => {
      let orderedItems = itemsObjectMaker(answers.what_items)
      if (answers.what_action === 'Create an order') {
        console.log(till.create(answers.what_table, answers.how_many_customers, answers.what_names, orderedItems))
      } else if (answers.what_action === 'Add to an order') {
        console.log(till.add(answers.what_table, orderedItems))
      } else if (answers.what_action === 'Print a receipt'){
        console.log(till.print(answers.what_table, undefined, answers.is_there_a_muffin_discount))
      } else if (answers.what_action === 'Take payment for an order'){
        console.log(till.print(answers.what_table, answers.how_much_cash, answers.is_there_a_muffin_discount))
      } else {
        finished = true;
      }
      console.log(answers)
      console.log(till.orders)
    })
  }
  await mongoose.connection.collections.orders.drop();
  await Order.insertMany(till.orders);
  await History.insertMany(till.completeOrders);
  await mongoose.connection.close();
  console.log('Thanks and bye bye!')
}

runMenu()
