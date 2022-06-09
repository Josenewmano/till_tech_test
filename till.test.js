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

  let thisIsAMuffinDiscount = true;

  let mockedReceipt = {
    write: () => 'A receipt'
  }
  let mockedCharges = {
    total: () => 
    ({ 
      taxAmount: 'Something',
      finalTotal: 45 
    }),
    changeBack: () => 'Something'
  }

  let till = new Till(mockedReceipt);

  it('has a functioning constructor method', () => {
    let unmockedTill = new Till;
    expect(unmockedTill.receipt).toBeDefined();
    expect(unmockedTill.orders).toBeDefined();
    expect(unmockedTill.charges).toBeDefined();
    expect(unmockedTill.completeOrders).toBeDefined();
  })
  
  it("creates a new order with create()", () =>  {
    expect(till.orders).toEqual({});
    expect(till.create("5", "1","Fred", orderedItems)).toEqual([
      'Table: 5 / [1]',
      'Fred',
      '',
      '                          2 x Cafe Latte',
      '                    1 x Blueberry Muffin',
      '                        1 x Choc Mudcake',
    ])
    expect(till.orders[5]).toBeDefined();
  })

  it("creates a new order with create() when number of customers is not defined", () =>  {
    expect(till.create("6", undefined,"Ed", orderedItems)).toEqual([
      'Table: 6 / []',
      'Ed',
      '',
      '                          2 x Cafe Latte',
      '                    1 x Blueberry Muffin',
      '                        1 x Choc Mudcake',
    ])
  })

  it("creates a new order with create() when customer names are not defined", () =>  {
    expect(till.create("7", "2", undefined, orderedItems)).toEqual([
      'Table: 7 / [2]',
      '',
      '',
      '                          2 x Cafe Latte',
      '                    1 x Blueberry Muffin',
      '                        1 x Choc Mudcake',
    ])
  })

  it("creates a takeaway order with create()", () =>  {
    expect(till.create(undefined, "1", "Fred", orderedItems)).toEqual([
      'TAKEAWAY',
      'Fred',
      '',
      '                          2 x Cafe Latte',
      '                    1 x Blueberry Muffin',
      '                        1 x Choc Mudcake',
    ])
  })

  it("throws an error if an order is created on a table which is filled()", () =>  {
    till.create("2", undefined, undefined, orderedItems);
    expect(till.orders[2]).toBeDefined();
    expect(till.create("2", undefined, "This new order has a customer name", orderedItems)).toEqual(
      'That table is already filled...'
    );
    expect(till.orders[2].customerNames).toEqual("");
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

  it("correctly handles a order without a muffin voucher with print()", () => {
    till.create("8", "2", "Two gents in the corner", orderedItems);
    expect(till.orders[8].totalInfo).toBeUndefined();
    expect(till.orders[8].muffinDiscount).toBeUndefined();
    expect(till.print('8')).toEqual('A receipt');
    expect(till.orders[8].totalInfo).toBeDefined();
    expect(till.orders[8].muffinDiscount).toBeUndefined();
  })

  it("correctly handles an order with a muffin voucher with print()", () => {
    till.create("17", "2", "That lovely young couple", orderedItems);
    expect(till.orders[17].totalInfo).toBeUndefined();
    expect(till.orders[17].muffinDiscount).toBeUndefined();
    expect(till.print('17', undefined, thisIsAMuffinDiscount)).toEqual('A receipt');
    expect(till.orders[17].muffinDiscount).toBeDefined();
    expect(till.orders[17].totalInfo).toBeDefined();
  })

  it("correctly handles a completed order with print()", () => {
    let newTill = new Till(mockedReceipt, mockedCharges);
    newTill.create("22", "1", "That librarian guy", orderForOne);
    expect(newTill.orders[22]).toBeDefined();
    expect(newTill.orders[22].totalInfo).toBeUndefined();
    expect(newTill.orders[22].cash).toBeUndefined();
    expect(newTill.orders[22].change).toBeUndefined();
    expect(newTill.completeOrders.length).toEqual(0);
    expect(newTill.print('22', "50")).toEqual('A receipt');
    expect(newTill.orders[22]).toBeUndefined();
    expect(newTill.completeOrders.length).toEqual(1);
    expect(newTill.completeOrders[0].totalInfo.paidAmount).toBeDefined();
    expect(newTill.completeOrders[0].cash).toBeDefined();
    expect(newTill.completeOrders[0].change).toBeDefined();
  })

  it("correctly handles multiple orders", () => {
    let newerTill = new Till(mockedReceipt, mockedCharges);
    newerTill.create("1", "1", "Someone", orderForOne);
    expect(newerTill.orders[1].items["Blueberry Muffin"]).toEqual(1);
    newerTill.create("2", "1", "Someone Else", orderForOne);
    expect(newerTill.orders[2].items["Blueberry Muffin"]).toEqual(1);
    newerTill.add("2", orderForOne);
    expect(newerTill.orders[1].items["Blueberry Muffin"]).toEqual(1);
    expect(newerTill.orders[2].items["Blueberry Muffin"]).toEqual(2);
    expect(newerTill.print('1', "50")).toEqual('A receipt');
    expect(newerTill.orders[1]).toBeUndefined();
    expect(newerTill.completeOrders.length).toEqual(1);
    expect(newerTill.print('2', "50")).toEqual('A receipt');
    expect(newerTill.orders[2]).toBeUndefined();
    expect(newerTill.completeOrders.length).toEqual(2);
  })
})