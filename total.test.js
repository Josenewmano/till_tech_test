const Total = require('./total');

describe(Total, () => {
  let total = new Total;
  let muffinDiscount = true;

  it("returns the total price for one item", () => {
    let items = {"Cafe Latte": 1};
    expect(total.calculate(items)).toEqual("4.75");
  })

  it("returns the total price for multiple units of the same item", () => {
    let items = {"Cafe Latte": 2};
    expect(total.calculate(items)).toEqual("9.50");
  })

  it("returns the total price for multiple different items", () => {
    let items = {"Cafe Latte": 1, "Blueberry Muffin": 1};
    expect(total.calculate(items)).toEqual("8.80");
  })

  it("applies the muffin discount for a single muffin", () => {
    let items = {"Cafe Latte": 1, "Blueberry Muffin": 1};
    expect(total.calculate(items, muffinDiscount)).toEqual("8.39");
  })

  it("returns the total price for multiple units of multiple different items", () => {
    let items = {"Cafe Latte": 2, "Blueberry Muffin": 4};
    expect(total.calculate(items)).toEqual("25.70");
  })

  it("applies the muffin discount for multiple muffins", () => {
    let items = {"Cafe Latte": 2, "Blueberry Muffin": 4};
    expect(total.calculate(items, muffinDiscount)).toEqual("24.08");
  })

  it("applies the muffin discount for multiple different muffins", () => {
    let items = {"Cafe Latte": 2, "Blueberry Muffin": 2,  "Chocolate Chip Muffin": 2};
    expect(total.calculate(items, muffinDiscount)).toEqual("24.08");
  })

  it("returns the correct amount of change, correctly formatted", () => {
    let cash = 40;
    let totalPrice = 15.50;
    expect(total.changeBack(cash, totalPrice)).toEqual("$24.50");
  })
})