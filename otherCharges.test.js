const OtherCharges = require('./otherCharges');

describe(OtherCharges, () => {
  it("returns the total tax for a given amount", () => {
    let other = new OtherCharges(0.0864); 
    expect(other.tax(100)).toEqual('$8.64');
  })
})