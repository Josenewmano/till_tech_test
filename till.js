const Charges = require('./charges');
const Receipt = require('./receipt');

class Till {
  constructor() {
  // this.orders = {};
  this.receiptPrinter = new Receipt;
  }

  print(order, cash = undefined, muffinDiscount = undefined) {
    order.muffinDiscount = muffinDiscount;
    if(order.charges === undefined) {this.#calculateTaxAndTotal(order)}
    if(cash) {this.#calculateChange(order, cash)}
    return this.#writeReceipt(order);
  }

  #calculateTaxAndTotal(order) {
    order.charges = new Charges;
    order.totalInfo = order.charges.total(order.items, order.muffinDiscount);
    order.tax = order.charges.tax();
  }

  #calculateChange(order, cash) {
    order.cash = `$${cash.toFixed(2)}`;
    order.change = order.charges.changeBack(cash, order.total);
  }

  #writeReceipt(order) {
    order.receipt = this.receiptPrinter.write(order);
    return order.receipt;
  }
}

module.exports = Till;
