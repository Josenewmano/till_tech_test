'use strict';
const Charges = require('./charges');
const Receipt = require('./receipt');

class Till {
  constructor(receipt = new Receipt, charges = new Charges, orders = []) {
  this.orders = orders;
  this.receipt = receipt;
  this.charges = charges;
  this.completeOrders = [];
  }

  create(table, noOfCustomers = "", customerNames = "", items) {
    let order = {
      table: table,
      noOfCustomers: noOfCustomers,
      customerNames: customerNames,
      items: items
    };
    this.#addIncludesMuffinInfo(order);
    this.orders.push(order);
    return this.#createConfirmation(order, items)
  }

  add(table, items) {
    let order = this.#orderFinder(table);
    this.#addToItemsObject(order, items);
    this.#addIncludesMuffinInfo(order);
    return this.#createConfirmation(order, items)
  }

  print(table, cash = undefined, muffinDiscount = undefined) {
    let order = this.#findAndCalculateTotal(table, muffinDiscount);
    if(cash) {this.#calculateChange(order, cash)}
    return this.#writeReceipt(order);
  }

  showTotal(table, muffinDiscount = undefined) {
    let order = this.#findAndCalculateTotal(table, muffinDiscount);
    return order.totalInfo.finalTotal
  }
  
  isThereAMuffin(table) {
    let order = this.#orderFinder(table);
    if (order.includesMuffin) { return true }
  }

  updateTables(array) {
    let free = [];
    let occupied = [];
    array.forEach((table) => {
      if(this.#orderFinder(table) === undefined) {
        free.push(table)
      } else {
        occupied.push(table);
      }
    })
    return [free, occupied]
  }

  #addIncludesMuffinInfo(order) {
    if (Object.keys(order.items).join().includes('Muffin')) {order.includesMuffin = true}
  }

  #createConfirmation(order, items) {
    return [
      '',
      this.#eatInOrTakeaway(order),
      order.customerNames,
      ''
    ].concat(this.#itemsLister(items), '').join('\n')
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

  #orderFinder(table) {
    return this.orders.find(order => order.table === table);
  }
  
  #addToItemsObject(order, newItems) {
    let ordered = Object.assign({}, order.items)
    let newItemKeys = Object.keys(newItems);
    newItemKeys.forEach((key) => {
      if (ordered[key]) {
        ordered[key] += newItems[key]
      } else {
        ordered[key] = newItems[key]
      }
    })
    order.items = ordered;
  }

  #findAndCalculateTotal(table, muffinDiscount = undefined) {
    let order = this.#orderFinder(table);
    order.muffinDiscount = muffinDiscount;
    this.#calculateTotalInfo(order);
    return order
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
    if (order.totalInfo.paidAmount >= order.totalInfo.finalTotal) {
      this.#removeFromOrders(order);
      this.completeOrders.push(order);
    }
    return order.receipt;
  }

  #removeFromOrders(order) {
    let table = order.table;
    let index = this.orders.indexOf(this.#orderFinder(table))
    this.orders.splice(index, 1); 
  }
}

module.exports = Till;
