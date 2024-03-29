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
    includesMuffin: true,
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

  let mockedItemsWriterNoMuffins = {
    list: (completeOrderWithoutMuffins) => [
      'Cafe Latte                     2 x $4.75',
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
  let noMuffinReceipt = new Receipt(mockedItemsWriterNoMuffins);
  let over50Receipt = new Receipt(mockedItemsWriterOver50);

  it('creates a new instance of items writer by default', () => {
    let unmockedReceipt = new Receipt;
    expect(unmockedReceipt.itemsWriter).toBeDefined();
  })

  it('returns the date and cafe details at the top', () => {
    let dateAndTime = new Date().toLocaleString();
    expect(receipt.write(basicOrder)).toEqual(expect.stringContaining(
      `${dateAndTime}\nThe Coffee Connection\n\n123 Lakeside Way\n+16503600708`
     )
    ) 
  })

  it('does not return a thank you message at the bottom of the page if the receipt is not paid', () => {
    expect(receipt.write(basicOrder)).toEqual(expect.not.stringContaining('Thank you!'))
  })
  
  it('returns details about the customers, followed by a breakdown of the cost, followed by tax and total cost', () => {
    expect(receipt.write(basicOrder)).toEqual(expect.stringContaining(
      `Table: 1 / [1]\nJane\nCafe Latte                     2 x $4.75\nBlueberry Muffin               1 x $4.05\nChoc Mudcake                   1 x $6.40\n\nTax                                $1.72\nTotal:                            $19.95`
    ));
  })

  it('returns a thank you message at the bottom of the page if the receipt is paid', () => {
    expect(receipt.write(completeOrderWithMuffins)).toEqual(expect.stringContaining(
      `\n\n                              Thank you!`
    ))
  })

  it('returns the amount paid and the change if the order has been paid', () => {
    expect(receipt.write(completeOrderWithMuffins)).toEqual(expect.stringContaining(
      `Cash:                             $20.00\nChange:                            $0.05`
    ))
  })

  it('returns a muffin voucher for next time if the order includes muffins and has been paid', () => {
    expect(receipt.write(completeOrderWithMuffins)).toEqual(expect.stringContaining("Voucher 10% Off All Muffins!"))
  })

  it('does not return a muffin voucher for next time if the order does not include muffins', () => {
    expect(noMuffinReceipt.write(completeOrderWithoutMuffins)).toEqual(expect.not.stringContaining(
      "Voucher 10% Off All Muffins!"
    ))
  })

  it('returns a discount line and total line with a reduced total for orders over $50', () => {
    expect(over50Receipt.write(orderOver50)).toEqual(expect.stringContaining(
      `Disc                      5% from $57.00\nTax                                $4.92\nTotal:                            $54.15`
    ));
  })

})