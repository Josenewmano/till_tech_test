const AnswersInterpreter = require('./answersInterpreter');

describe(AnswersInterpreter, () => {
  let mockedTill = {
    create: () => 'create() called',
    add: () => 'add() called', 
    print: () => 'print() called'
  }

  let createAnswer = {
    action: 'Create an order'
  }

  let addAnswer = {
    action: 'Add to an order'
  }

  let printAnswer = {
    action: 'Print a receipt'
  }

  let payAnswer = {
    action: 'Take payment for an order'
  }

  let otherAnswer = 'other';

  let quantities = [ 1, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 2, undefined, undefined, 3, undefined, undefined, 5 ];

  let anOrderObject = { "Cafe Latte": 1, "Choc Mudcake": 2, "Muffin Of The Day": 5, "Tiramisu": 3 }

  it('response() selects the appropriate till function', () => {
    let interpreter = new AnswersInterpreter;
    expect(interpreter.response(createAnswer, mockedTill)).toEqual('create() called');
    expect(interpreter.response(addAnswer, mockedTill)).toEqual('add() called');
    expect(interpreter.response(printAnswer, mockedTill)).toEqual('print() called');
    expect(interpreter.response(payAnswer, mockedTill)).toEqual('print() called');
    expect(interpreter.response(otherAnswer, mockedTill)).toEqual('Thanks and bye bye!');
  })

  it('itemsObjectMakers() creates an object of items and quantities', () => {
    let interpreter = new AnswersInterpreter;
    expect(interpreter.itemsObjectMaker(quantities)).toEqual(anOrderObject);
  })
})