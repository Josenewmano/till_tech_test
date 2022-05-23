const menu = require('./hipstercoffee.json')[0].prices[0];
const USCOFFEESHOPTAXRATE = 0.0864;

class Charges {
  constructor(taxRate = USCOFFEESHOPTAXRATE) {
    this.taxRate = taxRate;
  }

  total(items, muffinDiscount = undefined) {
    let subTotal = 0;
    for (let choice in items) {
      if (choice.includes('Muffin') && muffinDiscount) {
        subTotal += (menu[choice] * 0.9 * items[choice])
      } else {
        subTotal += (menu[choice] * items[choice])
      }
    }
    return this.#finalTotalInfo(subTotal);
  };

  changeBack(cash, finalTotal) {
    return `$${(cash - finalTotal).toFixed(2)}`;
  };

  #finalTotalInfo(subTotal) {
    if (subTotal > 50) {
      return { taxAmount: this.#tax(subTotal),
               discountInfo: `5% from $${subTotal.toFixed(2)}`,
               finalTotal: (subTotal * 0.95).toFixed(2)
             }
    } else {
      return { taxAmount: this.#tax(subTotal),
               finalTotal: subTotal.toFixed(2) 
             }    
    }
  }

  #tax(subTotal) {
    return `$${(subTotal * this.taxRate).toFixed(2)}`
  }
};

module.exports = Charges;