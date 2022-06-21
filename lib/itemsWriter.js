const menu = require('./hipstercoffee.json')[0].prices[0];
const muffinDiscountMenu = require('./muffindiscountmenu.json')

class ItemsWriter {
  list(order) {
    const orderedItems = order.items;
    const muffinDiscount = order.muffinDiscount;
    const items = Object.keys(orderedItems);
    let output = [];
    items.forEach((item) =>{
      let amountAndPrice = orderedItems[item] + ' x $' + Number(menu[item]).toFixed(2);
      if (muffinDiscount && item.includes('Muffin')) {
        amountAndPrice = orderedItems[item] + ' x $' + Number(muffinDiscountMenu[item]).toFixed(2);
      }
      output.push(item + (amountAndPrice.padStart(40 - item.length)))
    })
    output.push('');
    return output;
  }
}

module.exports = ItemsWriter;