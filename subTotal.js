const menu = require('./hipstercoffee.json')[0].prices[0];

class SubTotal {

  calculate(items) {
    let total = 0;
    for (let choice in items) {
      total += (menu[choice] * items[choice]);
    }
    return total.toFixed(2);
  }

}

module.exports = SubTotal;
