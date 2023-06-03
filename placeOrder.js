const { orderHistoryArchive, last5Reset } = require("./adminAccess");
const placeOrder = (selectedItems, last5Orders, totalOrders) => {

    if (selectedItems.length === 0) {
        console.log("You haven't selected any items yet. \nEnter 0 to go back to main menu");
        return "You haven't selected any items yet. \nEnter 0 to go back to main menu";
    }
    if (last5Orders.length === 5) {
        last5Orders.shift();
    }

    const temp = [...selectedItems]

    const asyFunc = async () => {
    await orderHistoryArchive([totalOrders[0],temp, Date.now()])
    }
    asyFunc().then(() => {
        last5Reset(last5Orders);
    })

    console.log("last5Orders", last5Orders);

    console.log("Thankyou for placing your order.\nYour order will be delivered in 30 minutes. 😋");
    selectedItems.length = 0;
    return "Thankyou for placing your order.\nYour order will be delivered in 30 minutes. 😋";

};

exports.placeOrder = placeOrder;