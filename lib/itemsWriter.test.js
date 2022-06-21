const ItemsWriter = require('./itemsWriter');

describe(ItemsWriter, () => {
  let write = new ItemsWriter;
  let order = {
    table: "1",
    noOfCustomers: "1",
    customerNames: "Jane",
    items: {
      "Cafe Latte": 2, 
      "Blueberry Muffin": 1, 
      "Choc Mudcake": 1
    }
  };

  let orderForCustomerWithMuffinVoucher = {
    table: "1",
    noOfCustomers: "1",
    customerNames: "Jane",
    items: {
      "Cafe Latte": 2, 
      "Blueberry Muffin": 1, 
      "Choc Mudcake": 1
    },
    muffinDiscount: true
  };
  
  it("returns the order items as an array of strings", () => {
    expect(write.list(order)).toEqual([
                                       'Cafe Latte                     2 x $4.75',
                                       'Blueberry Muffin               1 x $4.05',
                                       'Choc Mudcake                   1 x $6.40',
                                       ''
                                    ])
  })

  it("returns the order with the muffin items 10% cheaper", () => {
    expect(write.list(orderForCustomerWithMuffinVoucher)).toEqual([
                                       'Cafe Latte                     2 x $4.75',
                                       'Blueberry Muffin               1 x $3.65',
                                       'Choc Mudcake                   1 x $6.40',
                                       ''
                                    ])
  })

  it("returns the order items as an array of strings which are each 40 characters long", () => {
    expect(write.list(order)[0].length).toEqual(40);
    expect(write.list(order)[1].length).toEqual(40);
    expect(write.list(order)[2].length).toEqual(40);
    expect(write.list(order)[3].length).toEqual(0);
  })

})