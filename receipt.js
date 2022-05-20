const hipsterCoffee = require('./hipstercoffee.json');
const ItemsWriter = require('./itemsWriter');
const OtherCharges = require('./otherCharges');
const SubTotal = require('./subTotal');
const menu = hipsterCoffee[0].prices[0];


class Receipt {
  constructor(order) {
    this.order = order;
    this.returnValue = '';
    this.itemsWriter = new ItemsWriter;
    this.sub = new SubTotal;
    this.charges = new OtherCharges;
  }

  print() {
    this.#writeReceipt()
    return this.returnValue.flat(3);
  }

  #writeReceipt() {
    this.#receiptHeader();
    this.#customers();
    this.#itemLines();
    this.#taxLine();
    this.#totalLine();
    this.#thankYou();
  }

  #receiptHeader() {
    this.returnValue = [
      new Date().toLocaleString(), 
      hipsterCoffee[0].shopName,
      '',
      hipsterCoffee[0].address,
      `+${hipsterCoffee[0].phone}`,
      ''
     ]
  }

  #customers() {
    let customerLines = [
                         `Table: ${this.order.table} / [${this.order.noOfCustomers}]`,
                         this.order.customerNames
                        ]  
    this.returnValue.push(customerLines);
  }

  #itemLines() {
    this.returnValue.push([this.itemsWriter.list(this.order), '']);
  }

  #returnSub() {
    return this.sub.calculate(this.order.items);
  }

  #taxLine() {
    let line = `Tax: ${(this.charges.tax(this.#returnSub())).padStart(35)}`;
    this.returnValue.push(line);
  }
  
  #totalToString() {
    return `$${this.#returnSub()}`
  }

  #totalLine() {
    let line = `Total: ${this.#totalToString().padStart(33)}`;
    this.returnValue.push(line);
  }

  #thankYou() {
    this.returnValue.push(['', '', ('Thank you!').padStart(40)])
  }


}

module.exports = Receipt;