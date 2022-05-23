const menu = require('./hipstercoffee.json')[0].prices[0];
const USCOFFEESHOPTAXRATE = 0.0864;

class Charges {
  constructor(taxRate = USCOFFEESHOPTAXRATE) {
    this.taxRate = taxRate;
    this.subTotal = 0;
  }

  total(items, muffinDiscount = undefined) {
    for (let choice in items) {
      if (choice.includes('Muffin') && muffinDiscount) {
        this.subTotal += (menu[choice] * 0.9 * items[choice])
      } else {
        this.subTotal += (menu[choice] * items[choice])
      }
    }
    return this.#finalTotalInfo();
  };

  changeBack(cash) {
    return `$${(cash - this.totalInfo[0].finalTotal).toFixed(2)}`;
  };

  tax() {
    this.taxAmount = `$${(this.subTotal * this.taxRate).toFixed(2)}`
    return this.taxAmount;
  }

  #finalTotalInfo() {
    if (this.subTotal > 50) {
      this.totalInfo = [{ discountInfo: `5% from $${this.subTotal.toFixed(2)}`,
                          finalTotal: (this.subTotal * 0.95).toFixed(2)
                      }]
    } else {
      this.totalInfo = [{ finalTotal: this.subTotal.toFixed(2) }]    
    }
    return this.totalInfo
  }
};

module.exports = Charges;