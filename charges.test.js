const Charges = require('./charges');

describe(Charges, () => {
  let muffinDiscount = true;

  it("returns the total price for one item", () => {
    let charges = new Charges;
    let items = {"Cafe Latte": 1};
    expect(charges.total(items)).toEqual([{ finalTotal: "4.75" }]);
  })

  it("returns the total price for multiple units of the same item", () => {
    let charges = new Charges;
    let items = {"Cafe Latte": 2};
    expect(charges.total(items)).toEqual([{ finalTotal: "9.50" }]);
  })

  it("returns the total price for multiple different items", () => {
    let charges = new Charges;
    let items = {"Cafe Latte": 1, "Blueberry Muffin": 1};
    expect(charges.total(items)).toEqual([{ finalTotal: "8.80" }]);
  })

  it("applies the muffin discount for a single muffin", () => {
    let charges = new Charges;
    let items = {"Cafe Latte": 1, "Blueberry Muffin": 1};
    expect(charges.total(items, muffinDiscount)).toEqual([{ finalTotal: "8.39" }]);
  })

  it("returns the total price for multiple units of multiple different items", () => {
    let charges = new Charges;
    let items = {"Cafe Latte": 2, "Blueberry Muffin": 4};
    expect(charges.total(items)).toEqual([{ finalTotal: "25.70" }]);
  })

  it("applies the muffin discount for multiple muffins", () => {
    let charges = new Charges;
    let items = {"Cafe Latte": 2, "Blueberry Muffin": 4};
    expect(charges.total(items, muffinDiscount)).toEqual([{ finalTotal: "24.08" }]);
  })

  it("applies the muffin discount for multiple different muffins", () => {
    let charges = new Charges;
    let items = {"Cafe Latte": 2, "Blueberry Muffin": 2,  "Chocolate Chip Muffin": 2};
    expect(charges.total(items, muffinDiscount)).toEqual([{ finalTotal: "24.08" }]);
  })

  it("returns the correct amount of change, correctly formatted", () => {
    let charges = new Charges;
    let cash = 20;
    let items = {"Cafe Latte": 2};
    charges.total(items); 
    expect(charges.changeBack(cash)).toEqual("$10.50");
  })

  it("returns the total tax for a given amount", () => {
    let chargesForTax = new Charges(0.10); 
    let items = {"Cafe Latte": 2};
    chargesForTax.total(items); 
    expect(chargesForTax.tax()).toEqual('$0.95');
  })

  it("applies a discount of 5% for orders over $50", () => {
    let charges = new Charges;
    let items = {"Cafe Latte": 10, "Blueberry Muffin": 10};
    expect(charges.total(items)).toEqual([{"discountInfo": "5% from $88.00", "finalTotal": "83.60"}]);
  })
})