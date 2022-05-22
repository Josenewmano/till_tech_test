const Till = require('./till');

describe(Till, () => {
  let order = {
    table: "1",
    noOfCustomers: "1",
    customerNames: "Jane",
    items: {
      "Cafe Latte": 2, 
      "Blueberry Muffin": 1, 
      "Choc Mudcake": 1
    }
  }

  let orderForCustomerWithMuffinVoucher = {
    table: "1",
    noOfCustomers: "1",
    customerNames: "Jane",
    items: {
      "Cafe Latte": 2, 
      "Blueberry Muffin": 1, 
      "Choc Mudcake": 1
    }
  }

  let muffinDiscount = true;

  let till = new Till;
  it("returns the total to pay with print()", () => {
    expect(till.print(order)).toEqual(expect.arrayContaining([
      'Tax:                               $1.72',
      'Total:                            $19.95'
      ])
    )
  })

  it("returns a reduced total to pay with print() and a muffinVoucher", () => {
    expect(till.print(orderForCustomerWithMuffinVoucher, undefined, muffinDiscount)).toEqual(expect.arrayContaining([
      'Tax:                               $1.69',
      'Total:                            $19.55'
      ])
    )
  })

  it("returns an edited receipt with pay()", () => {
    expect(till.print(order, 20)).toEqual(expect.arrayContaining([
      'Cash:                             $20.00',
      'Change:                            $0.05',
      '',
      '',
      '                              Thank you!'
      ])
    )
  })
  
})