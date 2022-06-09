const Charges = require('./charges');
const Receipt = require('./receipt');

class Till {
  constructor(receipt = new Receipt) {
  this.orders = {};
  this.receipt = receipt;
  this.charges = new Charges;
  this.completeOrders = [];
  }

  create(table = "Takeaway", noOfCustomers = "", customerNames = "", items) {
    this.orders[table] = {
      table: table,
      noOfCustomers: noOfCustomers,
      customerNames: customerNames,
      items: items
    };
    return this.#createConfirmation(this.orders[table], items)
  }

  add(table, items) {
    let order = this.orders[table];
    this.#addToItemsObject(order, items);
    return this.#createConfirmation(order, items)
  }

  print(table, cash = undefined, muffinDiscount = undefined) {
    let order = this.orders[table];
    order.muffinDiscount = muffinDiscount;
    if(order.totalInfo === undefined) {this.#calculateTotalInfo(order)}
    if(cash) {this.#calculateChange(order, cash)}
    return this.#writeReceipt(order);
  }

  #createConfirmation(order, items) {
    return [
      this.#eatInOrTakeaway(order),
      order.customerNames,
      ''
    ].concat(this.#itemsLister(items))
  }

  #eatInOrTakeaway(order) {
    if (order.table === "Takeaway") { return "TAKEAWAY" }
    return `Table: ${order.table} / [${order.noOfCustomers}]`
  }

  #itemsLister(items) {
    let list = [];
    Object.entries(items).forEach(([key, value]) => {
      list.push(`${value} x ${key}`.padStart(40))
    });
    return list
  }

  #addToItemsObject(order, newItems) {
    let newItemKeys = Object.keys(newItems);
    newItemKeys.forEach((key) => {
      if (order.items[key]) {
        order.items[key] += newItems[key]
      } else {
        order.items[key] = newItems[key]
      }
    })
  }


  #calculateTotalInfo(order) {
    order.totalInfo = this.charges.total(order.items, order.muffinDiscount);
  }

  #calculateChange(order, cash) {
    order.totalInfo.paidAmount = cash;
    order.cash = `$${Number(cash).toFixed(2)}`
    order.change = this.charges.changeBack(cash, order.totalInfo.finalTotal);
  }

  #writeReceipt(order) {
    order.receipt = this.receipt.write(order);
    return this.#receiptFinisher(order);
  }

  #receiptFinisher(order) {
    let receipt = order.receipt;
    if (order.totalInfo.paidAmount >= order.totalInfo.finalTotal) {
      this.orders[order.table] = undefined;
      this.completeOrders.push(order);
    }
    return receipt;
  }
}

module.exports = Till;
