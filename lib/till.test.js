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

  let mockedReceipt = {
    write: () => 'A receipt'
  }

  let mockedCharges = {
    total: () => 
    ({ 
      taxAmount: 'Something',
      finalTotal: 1 
    }),
    changeBack: () => 'Something'
  }

  it('has a functioning constructor method', () => {
    let unmockedTill = new Till;
    expect(unmockedTill.receipt).toBeDefined();
    expect(unmockedTill.orders).toBeDefined();
    expect(unmockedTill.charges).toBeDefined();
    expect(unmockedTill.completeOrders).toBeDefined();
  })
  
  it("creates a new order with create()", () =>  {
    let till = new Till(mockedReceipt);
    expect(till.orders).toEqual([]);
    let order = Object.assign({}, orderedItems);
    expect(till.create("5", "1","Fred", order)).toEqual(
      `\nTable: 5 / [1]\nFred\n\n                          2 x Cafe Latte\n                    1 x Blueberry Muffin\n                        1 x Choc Mudcake\n`
    )
    expect(till.orders[0]).toBeDefined();
  })

  it("creates a new order with create() when number of customers is not defined", () =>  {
    let till = new Till(mockedReceipt);
    let order = Object.assign({}, orderedItems);
    expect(till.create("6", undefined,"Ed", order)).toEqual(expect.stringContaining('Table: 6 / []'))
  })

  it("creates a new order with create() when customer names are not defined", () =>  {
    let till = new Till(mockedReceipt);
    let order = Object.assign({}, orderedItems);
    expect(till.create("7", "2", undefined, order)).toEqual(expect.stringContaining(`Table: 7 / [2]\n\n\n`)
    )
  })

  it("creates a takeaway order with create()", () =>  {
    let till = new Till(mockedReceipt);
    let order = Object.assign({}, orderedItems);
    expect(till.create("Takeaway", "1", "Fred", order)).toEqual(expect.stringContaining('TAKEAWAY'))
  })

  it("adds to an existing order with add()", () => {
    let till = new Till;
    let order = Object.assign({}, orderedItems);
    let coffeeAndCoffee = Object.assign({}, coffeesAndCoffeeIceCream);
    till.create("1", "2", "Jane & Jess", order);
    expect(till.add("1", coffeeAndCoffee)).toEqual(
      `\nTable: 1 / [2]\nJane & Jess\n\n                          2 x Cafe Latte\n                            1 x Affogato\n`
    )
    expect(till.orders[0].items).toEqual({
      "Cafe Latte": 4, 
      "Blueberry Muffin": 1, 
      "Choc Mudcake": 1,
      "Affogato": 1,
    });
  })

  it("correctly handles a order without a muffin voucher with print()", () => {
    let till = new Till(mockedReceipt);
    let order = Object.assign({}, orderedItems);
    till.create("8", "2", "Two gents in the corner", order);
    expect(till.orders[0].totalInfo).toBeUndefined();
    expect(till.orders[0].muffinDiscount).toBeUndefined();
    expect(till.print('8')).toEqual('A receipt');
    expect(till.orders[0].totalInfo).toBeDefined();
    expect(till.orders[0].muffinDiscount).toBeUndefined();
  })

  it("correctly handles an order with a muffin voucher with print()", () => {
    let till = new Till;
    let order = Object.assign({}, orderedItems);
    till.create("17", "2", "That lovely young couple", order);
    expect(till.orders[0].totalInfo).toBeUndefined();
    expect(till.orders[0].muffinDiscount).toBeUndefined();
    till.print('17', undefined, true);
    expect(till.orders[0].muffinDiscount).toEqual(true);
    expect(till.orders[0].totalInfo).toBeDefined();
  })

  it("correctly handles a completed order with print()", () => {
    let till = new Till(mockedReceipt, mockedCharges);
    let smallOrder = Object.assign({}, orderForOne);
    till.create("22", "1", "That librarian guy", smallOrder);
    expect(till.orders[0]).toBeDefined();
    expect(till.orders[0].totalInfo).toBeUndefined();
    expect(till.orders[0].cash).toBeUndefined();
    expect(till.orders[0].change).toBeUndefined();
    expect(till.completeOrders.length).toEqual(0);
    expect(till.print('22', "50")).toEqual('A receipt');
    expect(till.orders.length).toEqual(0);
    expect(till.completeOrders.length).toEqual(1);
    expect(till.completeOrders[0].totalInfo.paidAmount).toBeDefined();
    expect(till.completeOrders[0].cash).toBeDefined();
    expect(till.completeOrders[0].change).toBeDefined();
  })

  it("correctly handles an order without a muffin discount with showTotal()", () => {
    let till = new Till(undefined, mockedCharges);
    let order = Object.assign({}, orderedItems);
    till.create("20", "2", "Two friends", order);
    expect(till.orders[0].totalInfo).toBeUndefined();
    expect(till.orders[0].muffinDiscount).toBeUndefined();
    expect(till.showTotal('20')).toEqual(1);
    expect(till.orders[0].muffinDiscount).toBeUndefined();
  })

  it("correctly handles an order with a muffin discount with showTotal()", () => {
    let till = new Till(undefined, mockedCharges);
    let order = Object.assign({}, orderedItems);
    till.create("20", "2", "Two friends", order);
    expect(till.orders[0].totalInfo).toBeUndefined();
    expect(till.orders[0].muffinDiscount).toBeUndefined();
    expect(till.showTotal('20', true)).toEqual(1);
    expect(till.orders[0].muffinDiscount).toBeDefined();
  })

  it("isThereAMuffin() returns true when there is a muffin, and returns nothing when there is no muffin", () => {
    let till = new Till;
    let order = Object.assign({}, coffeesAndCoffeeIceCream);
    let followUpOrderWithAMuffin = Object.assign({}, orderedItems);
    till.create("5", "2", "", order);
    expect(till.isThereAMuffin("5")).toEqual(undefined);
    till.add('5', followUpOrderWithAMuffin);
    expect(till.isThereAMuffin("5")).toEqual(true);
  })

  it("updateTables() correctly returns lists of occupied and unoccupied tables based on order history", () => {
    let till = new Till;
    let order = Object.assign({}, orderedItems);
    let tables = ["1", "2", "3"];
    till.create("1", "", "", order);
    expect(till.updateTables(tables)).toEqual(expect.arrayContaining([["2", "3"], ["1"]]));
    till.create("2", "", "", order);
    expect(till.updateTables(tables)).toEqual(expect.arrayContaining([["3"], ["1", "2"]]));
  })

  it("correctly handles multiple orders", () => {
    let till = new Till;
    let order = Object.assign({}, orderedItems);
    let order2 = Object.assign({}, orderedItems);
    let smallOrder = Object.assign({}, orderForOne);
    till.create("1", "1", "Someone", order);
    expect(till.orders[0].items["Blueberry Muffin"]).toEqual(1);
    till.create("2", "1", "Someone Else", order2);
    expect(till.orders[1].items["Blueberry Muffin"]).toEqual(1);
    till.add("2", smallOrder);
    expect(till.orders[0].items["Blueberry Muffin"]).toEqual(1);
    expect(till.orders[1].items["Blueberry Muffin"]).toEqual(2);
    till.print('1', "50");
    expect(till.orders.length).toEqual(1);
    expect(till.orders[0].table).toEqual('2');
    expect(till.completeOrders.length).toEqual(1);
    till.print('2', "50");
    expect(till.orders.length).toEqual(0);
    expect(till.completeOrders.length).toEqual(2);
  })

  it("correctly handles multiple calls of print() on the same order", () => {
    let till = new Till(undefined, mockedCharges);
    let smallOrder = Object.assign({}, orderForOne);
    till.create("1", "1", "New guy", smallOrder);
    till.print('1');
    expect(till.orders[0].totalInfo).toBeDefined();
    expect(till.orders[0].cash).toBeUndefined();
    till.print('1', "50");
    expect(till.completeOrders[0].cash).toBeDefined();
  })
})