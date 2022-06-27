# till_tech_test

## Overview
This is a project, written in JavaScript, which aims to provide a useful interface for tech-phobe coffee shop employees. An overview of the assignment can be found here: https://github.com/makersacademy/course/blob/main/individual_challenges/till_tech_test.md


## Getting started
Fork this project, then if necessary, either download or install Node.js (guidance here if required https://heynode.com/tutorial/install-nodejs-locally-nvm/) then npm (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). Then run `npm install` to ensure the dependencies match those in the file. Jest is the chosen testing framework. Run tests using `npm test`. It is also recommended to add `node_modules` & `coverage` to a `.gitignore` folder within your fork of the project if you intend to host it on Github or a similar website, as there will be a lot of files in there!


## Explanation
The user interacts with the Till class. To load an instance of the Till class:

`node`

`const Till = require('./till')`

`const till = new Till`

To create an order, enter the details of the customers = (table number (if `undefined` defaults to 'Takeaway'), optional number of customers, and optional names of customers), then the items the customer would like, along with the quantities of each, as an object. E.g.:

`till.create("1", "1", "Sarah", {"Cafe Latte": 1, "Blueberry Muffin": 1,"Choc Mudcake": 1})`


or (for a takeaway order):


`till.create(undefined, undefined, "Geoff", {"Double Espresso": 1})`


These orders can also be added to (before they are completed i.e. paid for) by entering the table number, as well as the items and quantitities of each to add. E.g.

`till.add("1", {"Single Espresso": 1})`



The print method can be called in two different main use cases: 
- When a cash amount is not included - this would be most suitable for dine in customers

`till.print("1")`
(which would print the bill to present to table 1)

- When a cash amount is included - this is most suitable for takeaway customers, and for when dine in customers are ready to pay (let's hope they don't run away)

`till.print("2", "40")`

or (for a takeaway order):

`till.print("t", "20")`


As receipts are flimsy, and can be easily forgotten/ screwed-up at the bottom of a pocket/ bag, the muffin discount can be applied either when the bill is requested, or when it is paid.

`till.print("2", undefined, true)`

or

`till.print("t", "20", true)`

When the print method is called, the Charges class is called to calculate the total and tax amount, and then calculate the amount of change to be returned. All of these values are then passed back to the Till class, before being stored on the order object, and then passed on to the Receipt class. The particularly tricky task for the Receipt class, of working out the formatting and the total for each item (edited in the case of being a muffin and the customer having a muffin voucher), are out-sourced to the ItemsWriter class. The Receipt class then returns the receipt to the Till class, which then passes the receipt along to the user.

For information on menu contents and prices, both the Charges and ItemsWriter classes refer to 'prices' section of the hipstercoffee.JSON file or the muffinsdiscountmenu.json for when there is a mufin voucher and the item is a muffin. The Receipt class refers to the hipstercoffee.JSON file for the contact details. In order to use this project in your own restaraunt, simply edit the hipstercoffee.JSON file, or provide one in a similar format - an array consisting of one object (hash), of which the 'prices' key points to an array of one object (hash), of which the item names point to their prices.

### Schema of the project
<img width="716" alt="Screenshot 2022-06-27 at 20 04 01" src="https://user-images.githubusercontent.com/98953155/176016708-39bd402f-d68a-48eb-b214-05963fc4269e.png">


## Assumptions
As this project will eventually have a user interface in which employees will choose options from a list to add to customer orders, many edge cases are not covered within the classes themselves. It is assumed that an optimal width for a receipt would be 40 characters. It is also assumed that the coffee shop are liable for the full tax when the total of the items is reduced by 5% (for orders over $50), but this is however not the case for muffin discount, in which case the 10% discount is taken from the total (and each individual muffin) before the tax calculation. If you intend to use this product professionally please adjust according to your local tax laws. It is also assumed that muffin discount applies only when a muffin has already been bought (and the previous receipt shown) at some time during the previous month (though not on the same day, to prevent sneaky pre-main-order muffin purchases). It is down to your own discretion whether or not you would then seize the used receipt in your own establishment. It is also assumed that there are no other current deals on other items, though these could of course be implemented by using similar methodology to the muffins.

The date format I have employed doesn't currently match that of the receipt (the one at the top of the receipt anyway). As the two date formats didn't actually even match, I elected to use the Date ToLocaleDateString() & ToLocaleString() methods, without arguments, so that they match whichever location you find yourself in. The closest that I could find to the format at the top was from this w3schools.com source https://www.w3schools.com/jsref/jsref_tolocalestring.asp - the Hungarian format, which wasn't actually that good of a match. The date inconstistency also had a knock-on effect on the timing of the muffin voucher validity -  the user has to either wait for a month and half, or two and a half months, to then have a window of less than a week to use the voucher. I decided these were both rather impractical, and that I would be a little more generous in terms of muffins, and also use a uniform date format in both instances to prevent customer confusion.


### The example receipt taken from the task specifications
![receipt](https://user-images.githubusercontent.com/98953155/170071613-31bc0f8d-c486-4992-8dda-fc90c1e2de3f.jpeg)


## Identified areas for improvement
Currently, the one test related to the output of the time stamp on the receipt will fail very occasionally on the odd occassion that the declaration of the variable happens during a different second to the next line, which contains the 'expect' statement. 

Also, partly due to my being unsure in which location the tests would be run, and also to avoid copying and pasting the rather long #tomorrowAndOneMonth() private method from the Receipt class into the test for the muffin voucher lines, only the voucher offer text ("Voucher 10% Off All Muffins!") is being tested for. There are also some limitations in the current Till class tests for the print() method- they rely on testing changes of state rather than behaviour.

The project will eventually have the command line interface specification as refered to above, so as to be foolproof for less tech savvy members of staff. End-to-end tests will also be employed at that time.

