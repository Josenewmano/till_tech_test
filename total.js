const menu = require('./hipstercoffee.json')[0].prices[0];

class Total {

  calculate(items, muffinDiscount = undefined) {
    let total = 0;
    for (let choice in items) {
      if (choice.includes('Muffin') && muffinDiscount) {
        total += (menu[choice] * 0.9 * items[choice])
      } else {
        total += (menu[choice] * items[choice])
      }
    }
    return total.toFixed(2);
  };

  changeBack(cash, total) {
    return `$${(cash - total).toFixed(2)}`;
  };

};

module.exports = Total;