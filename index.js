#!/usr/bin/env node

const inquirer = require('inquirer');
const inquirerPrompt = require('inquirer-table-prompt');
const InterruptedPrompt = require("inquirer-interrupted-prompt");
InterruptedPrompt.replaceAllDefaults(inquirer);
inquirer.registerPrompt("table", inquirerPrompt);
inquirer.registerPrompt("table", InterruptedPrompt.from(inquirerPrompt));


const mongoose = require("mongoose");

const History = require("./models/history");
const Order = require("./models/order");
const Till = require('./lib/till');

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
      {
        name:'Create an order',
        short: 'Create an order - If you make a mistake, press <Esc> to return to the main menu'
      },
      {
        name:'Add to an order', 
        short: 'Add to an order - If you make a mistake, press <Esc> to return to the main menu'
      },
      {
        name:'Print a receipt',
        short: 'Print a receipt - If you make a mistake, press <Esc> to return to the main menu'
      },
      {
        name:'Take payment for an order',
        short: 'Take payment for an order - If you make a mistake, press <Esc> to return to the main menu'
      },
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
  // {
  //   name: "is_there_a_muffin_discount",
  //   type: "confirm",
  //   message: "Does the customer have a muffin discount voucher?",
  //   when: printOrPay
  // },
  {
    name: "how_much_cash",
    type: "number",
    message: "How much cash have they paid?",
    when: onPay
  },
]

const muffinQuestion = [
  {
    name: "is_there_a_muffin_discount",
    type: "confirm",
    message: "Does the customer have a muffin discount voucher?",
  }
]

function showMenu(query) {
  return inquirer.prompt(query)
}

let finished = false

const runMenu = async() => {
  await mongoose.connect('mongodb://127.0.0.1/till', { useNewUrlParser: true, useUnifiedTopology: true });
  const orders = await Order.find();
  const till = new Till(undefined, undefined, orders);  
  while(finished !== true) {
    console.clear();
    await showMenu(questions)
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
      } else if (answers.what_action === 'Close the till'){
        finished = true;
      }
    })
    .catch(() => {})
  }
  await mongoose.connection.collections.orders.drop();
  await Order.insertMany(till.orders);
  await History.insertMany(till.completeOrders);
  await mongoose.connection.close();
  console.log('Thanks and bye bye!')
}

runMenu()
