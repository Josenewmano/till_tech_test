const Charges = require('./charges');

describe(Charges, () => {
  let muffinDiscount = true;

  it("returns the total price for one item", () => {
    let charges = new Charges;
    let items = {"Cafe Latte": 1};
    expect(charges.total(items)).toEqual({ 
      taxAmount: "$0.41",
      finalTotal: "4.75" 
    });
  })

  it("returns the total price for multiple units of the same item", () => {
    let charges = new Charges;
    let items = {"Cafe Latte": 2};
    expect(charges.total(items)).toEqual({ 
      taxAmount: "$0.82",
      finalTotal: "9.50" 
    });
  })

  it("returns the total price for multiple different items", () => {
    let charges = new Charges;
    let items = {"Cafe Latte": 1, "Blueberry Muffin": 1};
    expect(charges.total(items)).toEqual({ 
      taxAmount: "$0.76",
      finalTotal: "8.80" 
    });
  })

  it("applies the muffin discount for a single muffin", () => {
    let charges = new Charges;
    let items = {"Cafe Latte": 1, "Blueberry Muffin": 1};
    expect(charges.total(items, muffinDiscount)).toEqual({ 
      taxAmount: "$0.73",
      finalTotal: "8.39" 
    });
  })

  it("returns the total price for multiple units of multiple different items", () => {
    let charges = new Charges;
    let items = {"Cafe Latte": 2, "Blueberry Muffin": 4};
    expect(charges.total(items)).toEqual({ 
      taxAmount: "$2.22",
      finalTotal: "25.70" 
    });
  })

  it("applies the muffin discount for multiple muffins", () => {
    let charges = new Charges;
    let items = {"Cafe Latte": 2, "Blueberry Muffin": 4};
    expect(charges.total(items, muffinDiscount)).toEqual({ 
      taxAmount: "$2.08", 
      finalTotal: "24.08" 
    });
  })

  it("applies the muffin discount for multiple different muffins", () => {
    let charges = new Charges;
    let items = {"Cafe Latte": 2, "Blueberry Muffin": 2,  "Chocolate Chip Muffin": 2};
    expect(charges.total(items, muffinDiscount)).toEqual({ 
      taxAmount: "$2.08", 
      finalTotal: "24.08" 
    });
  })

  it("returns the correct amount of change, correctly formatted", () => {
    let charges = new Charges;
    let cash = 20;
    let finalTotal = "9.50";
    expect(charges.changeBack(cash, finalTotal)).toEqual("$10.50");
  })

  it("applies a discount of 5% for orders over $50", () => {
    let charges = new Charges;
    let items = {"Cafe Latte": 10, "Blueberry Muffin": 10};
    expect(charges.total(items)).toEqual({ 
      taxAmount: "$7.60",
      discountInfo: "5% from $88.00", 
      finalTotal: "83.60"
    });
  })
})