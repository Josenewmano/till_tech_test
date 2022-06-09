const Till = require('./till');

describe(Till, () => {
  let orderedItems = {
    "Cafe Latte": 2,
    "Blueberry Muffin": 1, 
    "Choc Mudcake": 1
  }

  let orderForOne = {
    "Cafe Latte": 1, 
    "Blueberry Muffin": 1,
    "Choc Mudcake": 1
  }

  let coffeesAndCoffeeIceCream = {
    "Cafe Latte": 2,
    "Affogato": 1
  }

  let muffinDiscount = true;

  let mockedReceipt = {
    write: () => [
        '24/05/2022, 08:20:21',
        'The Coffee Connection',
        '',
        '123 Lakeside Way',
        '+16503600708',
        '',
        'Table: 8 / [2]',
        'Two gents in the corner',
        'Cafe Latte                     2 x $4.75',
        'Blueberry Muffin               1 x $4.05',
        'Choc Mudcake                   1 x $6.40',
        '',
        'Tax                                $1.72',
        'Total:                            $19.95'
      ]
  }

  let mockedReceiptForMuffinDiscountOrder = {
    write: () => [
        '24/05/2022, 08:20:21',
        'The Coffee Connection',
        '',
        '123 Lakeside Way',
        '+16503600708',
        '',
        'Table: 17 / [2]',
        'That lovely young couple',
        'Cafe Latte                     2 x $4.75',
        'Blueberry Muffin               1 x $3.65',
        'Choc Mudcake                   1 x $6.40',
        '',
        'Tax                                $1.69',
        'Total:                            $19.55'
      ]
  }

  let mockedReceiptForCompleteOrder = {
    write: () => [
        '24/05/2022, 08:20:21',
        'The Coffee Connection',
        '',
        '123 Lakeside Way',
        '+16503600708',
        '',
        'Voucher 10% Off All Muffins!',
        'Valid 25/05/2022 to 23/06/2022',
        'Table: 22 / [1]',
        'That librarian guy',
        'Cafe Latte                     1 x $4.75',
        'Blueberry Muffin               1 x $4.05',
        'Choc Mudcake                   1 x $6.40',
        '',
        'Tax                                $1.31',
        'Total:                            $15.20',
        'Cash:                             $50.00',
        'Change:                           $34.80',
        '',
        '',
        '                              Thank you!'
      ]
  }

  let till = new Till(mockedReceipt);

  let muffinTill = new Till(mockedReceiptForMuffinDiscountOrder);

  let completeTill = new Till(mockedReceiptForCompleteOrder);

  it("creates a new order with create()", () =>  {
    expect(till.create("5", "1","Fred", orderedItems)).toEqual([
      'Table: 5 / [1]',
      'Fred',
      '',
      '                          2 x Cafe Latte',
      '                    1 x Blueberry Muffin',
      '                        1 x Choc Mudcake',
    ])
  })

  it("creates a takeaway order with create()", () =>  {
    expect(till.create("Takeaway", "1", "Fred", orderedItems)).toEqual([
      'TAKEAWAY',
      'Fred',
      '',
      '                          2 x Cafe Latte',
      '                    1 x Blueberry Muffin',
      '                        1 x Choc Mudcake',
    ])
  })

  it("adds to an existing order with add()", () => {
    till.create("1", "2", "Jane & Jess", orderedItems);
    expect(till.add("1", coffeesAndCoffeeIceCream)).toEqual([
      'Table: 1 / [2]',
      'Jane & Jess',
      '',
      '                          2 x Cafe Latte',
      '                            1 x Affogato'
    ])
    expect(till.orders[1].items).toEqual({
      "Cafe Latte": 4, 
      "Blueberry Muffin": 1, 
      "Choc Mudcake": 1,
      "Affogato": 1,
    });
  })

  it("returns the total to pay with print()", () => {
    till.create("8", "2", "Two gents in the corner", orderedItems);
    expect(till.print('8')).toEqual(expect.arrayContaining([
      'Tax                                $1.72',
      'Total:                            $19.95'
      ])
    )
  })

  it("returns a reduced total to pay with print() and a muffinVoucher", () => {
    muffinTill.create("17", "2", "That lovely young couple", orderedItems);
    expect(muffinTill.print('17', undefined, muffinDiscount)).toEqual(expect.arrayContaining([
      'Tax                                $1.69',
      'Total:                            $19.55'
      ])
    )
  })

  it("returns a full receipt when print() is called with an amount of money greater than the total, and moves th order to the completed orders array", () => {
    completeTill.create("22", "1", "That librarian guy", orderForOne);
    expect(completeTill.completeOrders.length).toEqual(0);
    expect(completeTill.print('22', "50")).toEqual(expect.arrayContaining([
      'Cash:                             $50.00',
      'Change:                           $34.80',
      '',
      '',
      '                              Thank you!'
      ])
    )
    expect(completeTill.orders[22]).toEqual(undefined);
    expect(completeTill.completeOrders.length).toEqual(1);
  })
})