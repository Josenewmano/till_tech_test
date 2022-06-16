const mongoose = require("mongoose");
const basicOrder = { table: '1',
    noOfCustomers: '1',
    customerNames: 'Somebody',
    items: { 'Cafe Latte': 1, 'Choc Mudcake': 1 } 
  };
const Order = require("./order");

beforeAll(function(done) {
  mongoose.connect('mongodb://127.0.0.1/till_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  var db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.on("open", function () {
    done();
  });
});

afterAll(function (done) {
  mongoose.connection.close(true, function () {
    done();
  });
});


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
