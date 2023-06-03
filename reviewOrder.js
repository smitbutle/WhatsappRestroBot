const Numbers = require('number-to-emoji');

const reviewOrder = (selectedItems,menu) => {
    if (selectedItems.length === 0) {
        return "You haven't selected any items yet. ";
    }

    let amt = 0;
    orderMsg = "*📄Your Order*\n\n";
    for (let i = 0; i < selectedItems.length; i++) {
        const ele = selectedItems[i] - 1;
        amt += menu[ele].price;
        orderMsg = orderMsg + Numbers.toEmoji(i + 1) + " " + menu[ele].item + ": " + menu[ele].price + "/-" + '\n';
    }

    orderMsg += "\n\n*💵Total Amount: " + amt + "/-💵*";
    orderMsg += "\nTo place order, type #️⃣";
    orderMsg += "\n\nTo go back to main menu type 0️⃣";
    console.log(orderMsg);
    return orderMsg;
};

exports.reviewOrder = reviewOrder;