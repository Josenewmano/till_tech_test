const hipsterCoffee = require('./hipstercoffee.json');
const ItemsWriter = require('./itemsWriter');

class Receipt {
  constructor() {
    this.itemsWriter = new ItemsWriter;
  }

  write(order) {
    this.order = order;
    if(this.order.receipt === undefined) {this.#mainReceipt()} 
    if(this.order.cash) {this.#finaliseReceipt()}
    return this.order.receipt;
  }

  #mainReceipt() {
    this.#receiptHeader();
    this.#customers();
    this.#itemLines();
    this.#taxLine();
    this.#totalLine();
  }

  #finaliseReceipt() {
    this.#addMuffinVoucher();
    this.#paidAndChange();
    this.#thankYou();
  }

  #receiptHeader() {
    this.order.receipt = [
      new Date().toLocaleString(), 
      hipsterCoffee[0].shopName,
      '',
      hipsterCoffee[0].address,
      `+${hipsterCoffee[0].phone}`,
      ''
     ]
  }

  #customers() { 
    this.order.receipt.push(`Table: ${this.order.table} / [${this.order.noOfCustomers}]`, 
                            this.order.customerNames);
  }

  #itemLines() {
    let new_receipt = this.order.receipt.concat(this.itemsWriter.list(this.order));
    this.order.receipt = new_receipt;
  }

  #taxLine() {
    let line = `Tax: ${this.order.otherCharges.taxAmount.padStart(35)}`;
    this.order.receipt.push(line);
  }
  
  #totalToDollars() {
    return `$${this.order.total}`
  }


  #totalLine() {
    let line = `Total: ${this.#totalToDollars().padStart(33)}`;
    this.order.receipt.push(line);
  }

  #addMuffinVoucher() {
    if (this.order.receipt.join().includes('Muffin')) {
      this.order.receipt.splice(6, 0, this.#muffinVoucherText(), this.#muffinDate())
    }
  }

  #muffinVoucherText() {
    return "Voucher 10% Off All Muffins!"
  }

  #muffinDate() {
    this.#tomorrowAndOneMonth();
    return `Valid ${this.tomorrow.toLocaleDateString()} to ${this.oneMonth.toLocaleDateString()}`
  }

  #tomorrowAndOneMonth() {
    let today = new Date();
    this.tomorrow = new Date(today);
    this.oneMonth = new Date(today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.oneMonth.setDate(this.oneMonth.getDate() + 30);
  }

  #paidAndChange() {
    let cash = `Cash: ${this.order.cash.padStart(34)}`;
    let change = `Change: ${this.order.change.padStart(32)}`;
    this.order.receipt.push(cash, change);
  }

  #thankYou() {
    this.order.receipt.push('', '', ('Thank you!').padStart(40))
  }
}

module.exports = Receipt;