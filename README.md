# till_tech_test

## Overview
This is a project, written in JavaScript, which aims to provide a useful interface for tech-phobe coffee shop employees. An overview of the assignment can be found here: https://github.com/makersacademy/course/blob/main/individual_challenges/till_tech_test.md

## Getting started
Fork this project, then if necessary, either download or install Node.js (guidance here if required https://heynode.com/tutorial/install-nodejs-locally-nvm/) then npm (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). Then run `npm install` to ensure the dependencies match those in the file. Jest is the chosen testing framework. Run tests using `jest`. It is also recommend to add `node_modules` to a `.gitignore` folder within your forl of the fproject if you intend to host it on github or a similar website, as there will be a lot of files in there!.

## Explanation
The user interacts with the Till class, entering the details of the customers (table number(or takeaway), optional names of customers, and number of customers) when creating an order, then the items the customer would like, along with the quantities of each. These orders can also be added to (before they are completed) by entering the table number, as well as the items and quantitities of each to add.

The print method can be called in two different main use cases: 
- When a cash amount is not included - this would be most suitable for dine in customers
- When a cash amount is included - this is most suitable for takeaway customers, and for when dine in customers are ready to pay (let's hope they don't run away)

As receipts are flimsy, and can be easily forgotten/ screwed-up at the bottom of a pocket/ bag, the muffin discount can be applied either when the bill is requested, or when it is paid.

When the print method is called, the Charges class is called to calculate the total and tax amount, and then calculate the amount of change to be returned. All of these values are then passed back to the Till class, before being passed on to the Receipt class. The particulkarly tricky task for the Receipt class, of working out the formatting and the total for each item (edited in the case of being a muffin and the customer having a muffin voucher) are out-sourced to the ItemsWriter class. The Receipt class then returns the receipt to the Till class, which then passes the receipt along to the user.

For information on menu contents and prices, both the Charges and ItemsWriter classes refer to 'prices' section of the hipstercoffee.JSON file. The Receipt class refers to the hipstercoffee.JSON file for the contact details. In order to use this proiject in your own restataunt, simpley eidt the hipstercoffee.JSON file, or provide one in a similar format - an array consisting of one object (hash), of which the 'prices' key point to an array of one object (hash), of the item names point to the prices.

### Schema of the project
<img width="979" alt="Screenshot 2022-05-24 at 16 03 53" src="https://user-images.githubusercontent.com/98953155/170068628-107fbf9d-0097-48b9-90e6-511a8646acc1.png">



## Assumptions
As this project will eventually have a user interface in which employees will choose options from a list to add to customer orders many edge cases are not covered within the classes themselves. It is assumed that an optimal width for a receipt would be 40 characters. It is also assumed that the coffee shop are liable for the full tax when the total of the items is reduced by 5% (for orders over $50), but this is however not the case for muffin discount, in which case the 10% discount is taken from the total (and each individual muffin) before the tax calculation. If you intend to use this product professionally please adjust according to the local tax laws. It is also assumed that muffin discount applies only when a muffin has already been bought (and the previous receipt shown) at some time during the previous month (though not on the same day, to prevent sneaky pre-main-order muffin purchases). It is also assumed that there are no other current deals on other items, though these could of course be implemented by using similar methodology to the muffins.

The date format I have employed doesn't currently match that of the receipt (the one at the top of the receipt anyway). As the two date formats didn't actually even match, I elected to use the Date ToLocaleString() method, without arguments, so that it matches whichever location you find yourself in. The closest that I could find to the format at the top was from this w3schools.com source https://www.w3schools.com/jsref/jsref_tolocalestring.asp was the Hungarian format, which wasn't actually that good of a match. The date inconstistency also had a knock-on effect on the timing of the muffin voucher validity -  the user has to either wait for a month and half, or two and a half months, to then have a window of less than a week to use the voucher. I decided to be a little more generous in terms of muffins, and also use a uniform date format to prevent customer confusion.

### The example receipt taken from the task specifications
![receipt](https://user-images.githubusercontent.com/98953155/170071613-31bc0f8d-c486-4992-8dda-fc90c1e2de3f.jpeg)

## Identified areas for improvement
Currently, the one test related to the output of the time stamp on the receipt will fail very occasionally on the odd occassion that the declaration of the variable happens during a different second to the next line, which contains the 'expect' statement. Also, partly due to my being unsure in which location the tests would be run, and also to avoid copying and pasting the rather long #tomorrowAndOneMonth() private method from the Receipt class into the test for the muffin voucher lines, only the voucher offer text ("Voucher 10% Off All Muffins!") is being tested for. There are also some limitations in my current mocking for the Till class tests - the return values from the Charges class (although tested separately within the class itself) have no bearing on the output from the print() method, which instead of course rely on the returns of the mocked Receipt class. Both of these last issues have been heavily manually tested for using Node.

