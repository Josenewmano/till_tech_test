const USCOFFEESHOPTAXRATE = 0.0864;

class OtherCharges {
  constructor(taxRate = USCOFFEESHOPTAXRATE) {
    this.taxRate = taxRate;
  }

  tax(subTotal) {
    return `$${(subTotal * this.taxRate).toFixed(2)}`;
  }

}

module.exports = OtherCharges;