function orderHistory(last5Orders, menu) {
    let historyMsg = "*🕜Order History🕜*\n";

    for (let i = 0; i <last5Orders.length; i++) {
        
        const ele = last5Orders[i][1];
        console.log("ele", ele);
        historyMsg = historyMsg + "\n------------------------\n" + "📃 Order no. " + last5Orders[i][0] + ":\n ";

        for (let j = 0; j < ele.length; j++) {
            const ele2 = ele[j] - 1;
            historyMsg = historyMsg + "👉" + menu[ele2].item + "\n ";
        }

        historyMsg += "🗓️ " + new Date(last5Orders[i][2]).toLocaleString() + "\n------------------------\n";
    }

    historyMsg += "\nTo go back to main menu type 0️⃣";
    console.log(historyMsg);
    return historyMsg;

}

exports.orderHistory = orderHistory;