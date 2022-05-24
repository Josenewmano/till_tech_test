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

  let orderForCompletion = {
    table: "1",
    noOfCustomers: "1",
    customerNames: "Joe",
    items: {
      "Cafe Latte": 2, 
      "Blueberry Muffin": 1, 
      "Choc Mudcake": 1
    }
  }

  let orderedItems = {"Cafe Latte": 2, 
  "Blueberry Muffin": 1, 
  "Choc Mudcake": 1}

  let muffinDiscount = true;

  let mockedReceipt = {
    write: (order) => [
        '24/05/2022, 08:20:21',
        'The Coffee Connection',
        '',
        '123 Lakeside Way',
        '+16503600708',
        '',
        'Table: 1 / [1]',
        'Jane',
        'Cafe Latte                     2 x $4.75',
        'Blueberry Muffin               1 x $4.05',
        'Choc Mudcake                   1 x $6.40',
        '',
        'Tax                                $1.72',
        'Total:                            $19.95'
      ]
  }

  let mockedReceiptForMuffinDiscountOrder = {
    write: (order, undefined, muffinDiscount) => [
        '24/05/2022, 08:20:21',
        'The Coffee Connection',
        '',
        '123 Lakeside Way',
        '+16503600708',
        '',
        'Table: 1 / [1]',
        'Jane',
        'Cafe Latte                     2 x $4.75',
        'Blueberry Muffin               1 x $3.65',
        'Choc Mudcake                   1 x $6.40',
        '',
        'Tax                                $1.69',
        'Total:                            $19.55'
      ]
  }

  let mockedReceiptForCompleteOrder = {
    write: (order) => [
        '24/05/2022, 08:20:21',
        'The Coffee Connection',
        '',
        '123 Lakeside Way',
        '+16503600708',
        '',
        'Voucher 10% Off All Muffins!',
        'Valid 25/05/2022 to 23/06/2022',
        'Table: 1 / [1]',
        'Jane',
        'Cafe Latte                     2 x $4.75',
        'Blueberry Muffin               1 x $4.05',
        'Choc Mudcake                   1 x $6.40',
        '',
        'Tax                                $1.72',
        'Total:                            $19.95',
        'Cash:                             $20.00',
        'Change:                            $0.05',
        '',
        '',
        '                              Thank you!'
      ]
  }

  let till = new Till(mockedReceipt);

  let muffinTill = new Till(mockedReceiptForMuffinDiscountOrder);

  let completeTill = new Till(mockedReceiptForCompleteOrder);

  it("returns the total to pay with print()", () => {
    expect(till.print(order)).toEqual(expect.arrayContaining([
      'Tax                                $1.72',
      'Total:                            $19.95'
      ])
    )
  })

  it("returns a reduced total to pay with print() and a muffinVoucher", () => {
    expect(muffinTill.print(order, undefined, muffinDiscount)).toEqual(expect.arrayContaining([
      'Tax                                $1.69',
      'Total:                            $19.55'
      ])
    )
  })

  it("returns a full receipt when print is called with an amount of money()", () => {
    expect(completeTill.print(orderForCompletion, 20)).toEqual(expect.arrayContaining([
      'Cash:                             $20.00',
      'Change:                            $0.05',
      '',
      '',
      '                              Thank you!'
      ])
    )
  })
  
})