const Numbers = require('number-to-emoji');

function foodMenu(lastAdded, selectedItems, menu) {
    let prevLine = "";
    if (lastAdded != 0) {
        selectedItems.push(lastAdded)
        let prevItems = "";
        for (let i = 0; i < selectedItems.length; i++) {
            const ele = selectedItems[i] - 1;
            prevItems += '👉' + " " + menu[ele].item + '\n';
        }
        prevLine = "Your previous selection:\n" + prevItems + " \n\n";
    }

    menuMsg = "*🍟MENU*\n\n";
    for (let i = 0; i < menu.length; i++) {
        const ele = menu[i];
        menuMsg = menuMsg + Numbers.toEmoji(ele.id) + " " + ele.item + ": " + ele.price + "/-" + '\n';
    }
    menuMsg += "\nTo proceed with your order, type #️⃣";
    menuMsg += "\nTo go back to main menu type 0️⃣";
    console.log(menuMsg + "\n------------------------\n" + prevLine);
    return menuMsg + "\n------------------------\n" + prevLine;
}
exports.foodMenu = foodMenu;