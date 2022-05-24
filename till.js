const Charges = require('./charges');
const Receipt = require('./receipt');

class Till {
  constructor(receiptPrinter = new Receipt) {
  // this.orders = {};
  this.receiptPrinter = receiptPrinter;
  this.charges = new Charges;
  }

  print(order, cash = undefined, muffinDiscount = undefined) {
    order.muffinDiscount = muffinDiscount;
    if(order.totalInfo === undefined) {this.#calculateTotalInfo(order)}
    if(cash) {this.#calculateChange(order, cash)}
    return this.#writeReceipt(order);
  }

  #calculateTotalInfo(order) {
    order.totalInfo = this.charges.total(order.items, order.muffinDiscount);
  }

  #calculateChange(order, cash) {
    order.cash = `$${cash.toFixed(2)}`;
    order.change = this.charges.changeBack(cash, order.totalInfo.finalTotal);
  }

  #writeReceipt(order) {
    order.receipt = this.receiptPrinter.write(order);
    return order.receipt;
  }
}

module.exports = Till;
