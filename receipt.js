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
    this.#discountLine();
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

  #discountLine() {
    if(this.order.totalInfo[0].discountInfo) {
    let line = `Disc ${this.order.totalInfo[0].discountInfo.padStart(35)}`;
    this.order.receipt.push(line);
    }
  }
    
  #taxLine() {
    let line = `Tax ${this.order.charges.taxAmount.padStart(36)}`;
    this.order.receipt.push(line);
  }
  
  #totalToDollars() {
    return `$${this.order.totalInfo[0].finalTotal}`
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
    return `Valid ${this.tomorrow} to ${this.oneMonth}`
  }

  #tomorrowAndOneMonth() {
    let today = new Date();
    let tomorrow = new Date(today);
    let oneMonth = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    oneMonth.setDate(oneMonth.getDate() + 30);
    this.tomorrow = tomorrow.toLocaleDateString();
    this.oneMonth = oneMonth.toLocaleDateString();
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