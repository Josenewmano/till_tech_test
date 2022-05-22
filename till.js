const OtherCharges = require('./otherCharges');
const Total = require('./total');
const Receipt = require('./receipt');

class Till {
  constructor() {
  // this.orders = {};
  this.receiptPrinter = new Receipt;
  this.totaller = new Total;
  }

  print(order, cash = undefined, muffinDiscount = undefined) {
    order.muffinDiscount = muffinDiscount;
    if(order.otherCharges === undefined) {this.#calculateOtherCharges(order)}
    if(cash) {this.#calculateChange(order, cash)}
    return this.#writeReceipt(order);
  }

  #calculateOtherCharges(order) {
    let subTotal = this.totaller.calculate(order.items, order.muffinDiscount);
    order.otherCharges = new OtherCharges;
    order.otherCharges.tax(subTotal);
    order.total = subTotal;
  }

  #calculateChange(order, cash) {
    order.cash = `$${cash.toFixed(2)}`;
    order.change = this.totaller.changeBack(cash, order.total);
  }

  #writeReceipt(order) {
    order.receipt = this.receiptPrinter.write(order);
    return order.receipt;
  }
}

module.exports = Till;
