const mongoose = require('mongoose');
const { menuItem, orderItem } = require("./db");

mongoose.connect('mongodb+srv://smit:smit@mernapp.vpo7txs.mongodb.net/WhatsappRestroBot')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("[Database Connected]")
});

const adminAccess = () => {
    return `✨Hello Smit✨\n
    *Welcome to Admin Access*\n
    A. Add Item to Menu
    B. Remove Item from Menu
    C. View Menu
    D. Exit`
}



const initialiseMenu = (menu) => {
    const iniMenu = async () => {
        const users = await menuItem.find().sort({ id: 1 })
            .then((data) => {
                return data
            })
        temp = [...users];
        console.log(temp)
        return temp;
    }
    iniMenu().then(() => {

        menu.length = 0
        for (let i = 0; i < temp.length; i++) {
            menu.push(temp[i])
        }
    }
    ).then(() => {
        return true;
    }).catch((err) => {
        console.log(err)
        return false
    });
}
        

const addItemToMenu = async (newItem) => {
    try {
        const i1 = new menuItem({
            id: newItem.id,
            item: newItem.item,
            price: newItem.price,
        });

        await i1.save();
        console.log(i1+ "\nItem added successfully.");
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

const removeItemFromMenu = async (item) => {
    menuItem.findOneAndRemove({ item: item }).then((item) => {
        if (!item) {
            console.log("Item not found");
        } else {
            console.log(i1 + "\nItem Removed");
        }
    }).then(() => {
        return true;
    }).catch((err) => {
        console.log(err)
        return false
    });
}

const orderHistoryArchive = async (newItem) => {
    try {
        const i1 = new orderItem
        i1.id= newItem[0]
        for (let i = 0; i < newItem[1].length; i++) {
            i1.orderDetails.push(newItem[1][i])
        }
        i1.timestamp = newItem[2]
        await i1.save()
    }
    catch (err) {
        console.error(err);

    }
}

async function last5Reset(last5Orders,totalOrders) {
    const last5func = async () => {

        const users = await orderItem.find().sort({ timestamp: -1 }).limit(5)
            .then((data) => {
                return data
            })

        last5 = [...users];
        return last5;
    }

    last5func().then(() => {

        last5Orders.length = 0
        for (let i = 0; i < last5.length; i++) {
            last5Orders.push([last5[i].id,last5[i].orderDetails, last5[i].timestamp])
        }
         if (last5Orders.length != 0 && totalOrders !=undefined) {
            
            totalOrders[0]=last5Orders[0][0]
            console.log("last 5 orders initialised\nTotal Orders: "+ totalOrders[0])
        }
        console.log(last5Orders)
    }
    )
}
module.exports = { adminAccess, addItemToMenu, removeItemFromMenu, orderHistoryArchive, last5Reset, initialiseMenu };