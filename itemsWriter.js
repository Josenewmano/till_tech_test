const menu = require('./hipstercoffee.json')[0].prices[0];

class ItemsWriter {
  list(order) {
    const orderedItems = order.items;
    const items = Object.keys(orderedItems);
    let output = [];
    items.forEach((item) =>{
      let amountAndPrice = orderedItems[item] + ' x $' + Number(menu[item]).toFixed(2);
      output.push(item + (amountAndPrice.padStart(40 - item.length)))
    })
    return output;
  }
}

module.exports = ItemsWriter;