const Receipt = require('./receipt');

describe(Receipt, () => {
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
   let receipt = new Receipt(order);

  it('returns the date and cafe details at the top', () => {
    let date = new Date().toLocaleString();
    expect(receipt.print()[0]).toEqual(date);
    expect(receipt.print()[1]).toEqual('The Coffee Connection');
    expect(receipt.print()[3]).toEqual('123 Lakeside Way');
    expect(receipt.print()[4]).toEqual('+16503600708');
  })

  it('returns details about the customers', () => {
    expect(receipt.print()).toEqual(expect.arrayContaining([
      'Table: 1 / [1]',
      'Jane'
    ]));
  })

  it('returns a breakdown of the cost of each item', () => {
    expect(receipt.print()).toEqual(expect.arrayContaining([
      'Cafe Latte                     2 x $4.75',
      'Blueberry Muffin               1 x $4.05',
      'Choc Mudcake                   1 x $6.40'
   ]))
  })

  it('returns a the tax followed by the total cost', () => {
    expect(receipt.print()).toEqual(expect.arrayContaining([
      'Tax:                               $1.72',
      'Total:                            $19.95'
    ]))
  })

  it('returns a thank you message at the bottom of the page', () => {
    expect(receipt.print()).toEqual(expect.arrayContaining([
      '',
      '',
      '                              Thank you!'
    ]))
  })

})