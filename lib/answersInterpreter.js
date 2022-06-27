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
class AnswersInterpreter {
  response(answers, till) {
    let orderedItems = this.itemsObjectMaker(answers.items);
    return this.#tillFunctionSelector(answers, till, orderedItems)
  }

  itemsObjectMaker(quantities) {
    if(quantities === undefined) { return }
    let result = {}
    choicesArray.forEach((choice, i) => result[choice] = quantities[i]);
    Object.keys(result).forEach(key => {
      if (result[key] === undefined) {
        delete result[key];
      }
    });
    return result
  }

  #tillFunctionSelector(answers, till, orderedItems) {
    switch (answers.action) {
      case 'Create an order':
        return till.create(answers.table, answers.customers, answers.names, orderedItems)
      case 'Add to an order':
        return  till.add(answers.table, orderedItems)
      case 'Print a receipt':
        return till.print(answers.table, undefined, answers.muffin_discount)
      case 'Take payment for an order':
        return till.print(answers.table, answers.cash, answers.muffin_discount)
      default:
        return 'Thanks and bye bye!'
    }
  }
}

module.exports = AnswersInterpreter;
