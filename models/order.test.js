const mongoose = require("mongoose");
const basicOrder = { table: '1',
    noOfCustomers: '1',
    customerNames: 'Somebody',
    items: { 'Cafe Latte': 1, 'Choc Mudcake': 1 } 
  };
const Order = require("./order");
require("./mongodb_helper");

describe("Order model", () => {
  beforeEach((done) => {
    mongoose.connection.collections.orders.drop(() => {
      done();
    });
  });

  it("has an order", () => {
    let details = Object.assign({}, basicOrder);
    let order = new Order(details);
    expect(order.table).toEqual("1");
    expect(order.noOfCustomers).toEqual("1");
    expect(order.customerNames).toEqual("Somebody");
    expect(order.items).toEqual({ 'Cafe Latte': 1, 'Choc Mudcake': 1 });
  });

  it("can list all orders", (done) => {
    Order.find((err, orders) => {
      expect(err).toBeNull();
      expect(orders).toEqual([]);
      done();
    });
  });

  it("can save an order", (done) => {
    let details = Object.assign({}, basicOrder);
    let order = new Order(details);
    order.save((err) => {
      expect(err).toBeNull();

      Order.find((err, orders) => {
        expect(err).toBeNull();

        expect(orders[0]).toMatchObject(details);
        done();
      });
    });
  });
});
