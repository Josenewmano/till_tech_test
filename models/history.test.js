const mongoose = require("mongoose");
const basicOrder = { 
  items: { 'Cafe Latte': 1, 'Choc Mudcake': 1 },
  muffinDiscount: undefined,
  totalInfo: { taxAmount: 'Something', finalTotal: 11.15, paidAmount: '20' },
  cash: '$20.00',
  change: '$8.85',
  receipt: ['A receipt']
};
const History = require("./history");
require("./mongodb_helper");

describe("History model", () => {
  beforeEach((done) => {
    mongoose.connection.collections.histories.drop(() => {
      done();
    });
  });

  it("has a history item", () => {
    let details = Object.assign({}, basicOrder);
    let history = new History(details);
    expect(history.items).toEqual({ 'Cafe Latte': 1, 'Choc Mudcake': 1 });
    expect(history.muffinDiscount).toEqual(undefined);
    expect(history.totalInfo).toEqual({ taxAmount: 'Something', finalTotal: 11.15, paidAmount: '20' });
    expect(history.cash).toEqual('$20.00');
    expect(history.change).toEqual('$8.85');
    expect(history.receipt).toEqual(expect.arrayContaining(['A receipt']))
  });

  it("can list all history", (done) => {
    History.find((err, history) => {
      expect(err).toBeNull();
      expect(history).toEqual([]);
      done();
    });
  });

  it("can save an item of history", (done) => {
    let details = Object.assign({}, basicOrder);
    let history = new History(details);
    history.save((err) => {
      expect(err).toBeNull();

      History.find((err, history) => {
        expect(err).toBeNull();

        expect(history[0]).toMatchObject(details);
        done();
      });
    });
  });
});