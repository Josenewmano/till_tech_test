const Receipt = require('./receipt');

describe(Receipt, () => {
  let basicOrder = {
    table: "1",
    noOfCustomers: "1",
    customerNames: "Jane",
    items: {
      "Cafe Latte": 2, 
      "Blueberry Muffin": 1, 
      "Choc Mudcake": 1
    },
    totalInfo: { taxAmount: '$1.72', finalTotal: 19.95 }
  }

  let orderOver50 = {
    table: "1",
    noOfCustomers: "1",
    customerNames: "Latte Lovin' Jane",
    items: {
      "Cafe Latte": 12
    },
    totalInfo: { taxAmount: '$4.92', discountInfo: '5% from $57.00', finalTotal: 54.15 }
  }

  let completeOrderWithMuffins = {
    table: "1",
    noOfCustomers: "1",
    customerNames: "Jane",
    items: {
      "Cafe Latte": 2, 
      "Blueberry Muffin": 1, 
      "Choc Mudcake": 1
    },
    totalInfo: { taxAmount: '$1.72', finalTotal: 19.95 },
    cash: '$20.00',
    change: '$0.05',
    receipt: [
      '20/05/2022, 20:05:49',
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

  let completeOrderWithoutMuffins = {
    table: "1",
    noOfCustomers: "1",
    customerNames: "Jane",
    items: {
      "Cafe Latte": 2, 
      "Choc Mudcake": 1
    },
    totalInfo: { taxAmount: '$1.36', finalTotal: 15.70 },
    cash: '$20.00',
    change: '$4.30',
    receipt: [
      '20/05/2022, 20:05:49',
      'The Coffee Connection',
      '',
      '123 Lakeside Way',
      '+16503600708',
      '',
      'Table: 1 / [1]',
      'Jane',
      'Cafe Latte                     2 x $4.75',
      'Choc Mudcake                   1 x $6.40',
      '',
      'Tax                                $1.36',
      'Total:                            $15.70'
    ]
  }

  let mockedItemsWriter = {
    list: (basicOrder) => [
      'Cafe Latte                     2 x $4.75',
      'Blueberry Muffin               1 x $4.05',
      'Choc Mudcake                   1 x $6.40',
      '',
    ],
  };

  let mockedItemsWriterOver50 = {
    list: (orderOver50) => [
      'Cafe Latte                    12 x $4.75',
      '',
    ],
  };

  let receipt = new Receipt(mockedItemsWriter);
  let over50Receipt = new Receipt(mockedItemsWriterOver50);

  it('returns the date and cafe details at the top', () => {
    let dateAndTime = new Date().toLocaleString();
    expect(receipt.write(basicOrder)).toEqual(expect.arrayContaining([
      dateAndTime,
      'The Coffee Connection',
      '',
      '123 Lakeside Way',
      '+16503600708'
     ])
    ) 
  })

  it('does not return a thank you message at the bottom of the page if the receipt is not paid', () => {
    expect(receipt.write(basicOrder)).toEqual(expect.not.arrayContaining([
      '',
      '',
      '                              Thank you!'
    ]))
  })
  
  it('returns details about the customers, followed by a breakdown of the cost, followed by tax and total cost', () => {
    expect(receipt.write(basicOrder)).toEqual(expect.arrayContaining([
      'Table: 1 / [1]',
      'Jane',
      'Cafe Latte                     2 x $4.75',
      'Blueberry Muffin               1 x $4.05',
      'Choc Mudcake                   1 x $6.40',
      '',
      'Tax                                $1.72',
      'Total:                            $19.95'
    ]));
  })

  

  it('returns a thank you message at the bottom of the page if the receipt is paid', () => {
    expect(receipt.write(completeOrderWithMuffins)).toEqual(expect.arrayContaining([
      '',
      '',
      '                              Thank you!'
    ]))
  })

  it('returns the amount paid and the change if the order has been paid', () => {
    expect(receipt.write(completeOrderWithMuffins)).toEqual(expect.arrayContaining([
      'Cash:                             $20.00',
      'Change:                            $0.05',
    ]))
  })

  it('returns a muffin voucher for next time if the order includes muffins', () => {
    expect(receipt.write(completeOrderWithMuffins)).toEqual(expect.arrayContaining([
      "Voucher 10% Off All Muffins!"
    ]))
  })

  it('does not return a muffin voucher for next time if the order does not include muffins', () => {
    expect(receipt.write(completeOrderWithoutMuffins)).toEqual(expect.not.arrayContaining([
      "Voucher 10% Off All Muffins!"
    ]))
  })

  it('returns a discount line and total line with a reduced total for orders over $50', () => {
    expect(over50Receipt.write(orderOver50)).toEqual(expect.arrayContaining([
      'Table: 1 / [1]',
      "Latte Lovin' Jane",
      'Cafe Latte                    12 x $4.75',
      '',
      'Disc                      5% from $57.00',
      'Tax                                $4.92',
      'Total:                            $54.15'
    ]));
  })

})