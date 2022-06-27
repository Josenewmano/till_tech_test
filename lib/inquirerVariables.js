const allTables = [ "Takeaway", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]

const onPay = (answers) => 
  answers.action === 'Take payment for an order'

const printPayOrAdd = (answers) => 
  answers.action === 'Add to an order' || 
  answers.action === 'Print a receipt' || 
  answers.action === 'Take payment for an order'

const onCreate = (answers) => 
  answers.action === 'Create an order'

const createOrAdd = (answers) => 
  answers.action === 'Create an order' || 
  answers.action === 'Add to an order'

const notClose = (answers) => 
  answers.action === 'Create an order' || 
  answers.action === 'Add to an order' || 
  answers.action === 'Print a receipt' || 
  answers.action === 'Take payment for an order'
  
const questions = [
    {
      name: "action",
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
      name: "table",
      type: "list",
      message: "What table?",
      choices: "",
      when: onCreate
    },
    {
      name: "table",
      type: "list",
      message: "What table?",
      choices: "",
      when: printPayOrAdd
    },
    {
      type: "table",
      name: "items",
      message: "Select the items:",
      pageSize: 15,
      columns: [
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
      ],
      rows: [
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
      ],
      when: createOrAdd
    },
    {
      name: "names",
      type: "input",
      message: "Add the names of the customers:",
      when: onCreate
    },
    {
      name: "customers",
      type: "number",
      message: "How many customers are there?",
      when: onCreate
    },
    {
      name: "muffin_discount",
      type: "confirm",
      message: "Does the customer have a muffin discount voucher?",
      when: ""
    },
    {
      name: "cash",
      type: "number",
      message: "",
      when: onPay
    },
    {
      name: "review",
      type: "input",
      message: "Take a moment to consider. Are all of the details correct? Press <Enter> to proceed, or <Esc> to start over.",
      when: notClose
    },
]

module.exports = { allTables, questions }