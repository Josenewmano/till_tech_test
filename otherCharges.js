const USCOFFEESHOPTAXRATE = 0.0864;

class OtherCharges {
  constructor(taxRate = USCOFFEESHOPTAXRATE) {
    this.taxRate = taxRate;
    this.taxAmount = '';
    this.muffinDiscount = false;
  }

  tax(subTotal) {
    this.taxAmount = `$${(subTotal * this.taxRate).toFixed(2)}`
    return this.taxAmount;
  }

  discounts(order, subTotal) {

  }
}

module.exports = OtherCharges;