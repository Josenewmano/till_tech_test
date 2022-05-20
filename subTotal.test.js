const SubTotal = require('./subTotal');

describe(SubTotal, () => {
  let sub = new SubTotal;

  it("returns the total price for one item", () => {
    let items = {"Cafe Latte": 1};
    expect(sub.calculate(items)).toEqual("4.75");
  })

  it("returns the total price for multiple units of the same item", () => {
    let items = {"Cafe Latte": 2};
    expect(sub.calculate(items)).toEqual("9.50");
  })

  it("returns the total price for multiple different items", () => {
    let items = {"Cafe Latte": 1, "Flat White": 1};
    expect(sub.calculate(items)).toEqual("9.50");
  })

  it("returns the total price for multiple units of multiple different items", () => {
    let items = {"Cafe Latte": 2, "Flat White": 4};
    expect(sub.calculate(items)).toEqual("28.50");
  })
})