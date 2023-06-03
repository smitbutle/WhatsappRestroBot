const crypto = require('crypto');
const express = require('express');

const { reviewOrder } = require("./reviewOrder");
const { orderHistory } = require("./orderHistory");
const { sendReply } = require("./sendReply");
const { foodMenu } = require("./foodMenu");
const { placeOrder } = require("./placeOrder");
const { adminAccess, addItemToMenu, removeItemFromMenu , initialiseMenu,last5Reset} = require("./adminAccess");
const landingPageData = "*✨Welcome to our Restaurant✨*\n\nSelect Option to proceed 🍽️\n\n1. Show Menu📃\n2. Review Order👀\n3. Place Order✅\n4. Cancel Order❌\n5. Order History🕜"
let passKey="smithere"

const last5Orders = []



const totalOrders=[0]

last5Reset(last5Orders,totalOrders)
// .then(()=>{
//   if (last5Orders.length===0){
//   }
//   else {totalOrders = last5Orders[0][0].id}
//   console.log("total orders : "+totalOrders)
// })



const menu = []
initialiseMenu(menu)
const selectedItems = []

const menuAddLocal = (obj) => {
  menu.push(obj)
  menu.sort(function compare(a, b) {
    if (a.id < b.id) {
      return -1;
    }
    if (a.id > b.id) {
      return 1;
    }
    return 0;
  })
}
const menuRemoveLocal = (inputReply) => {
  function sortById(item) {
    return item.id === parseInt(inputReply);
  }
  const index = menu.findIndex(sortById);
  if (index !== -1) {
    menu.splice(index, 1);
  }
}
currentPage = "beforeLandingPage"
function replyHandler(menu, last5Orders, payload, selectedItems) {

  const entry = payload.entry;
  if (entry[0].changes[0].value.messages === undefined || entry[0].changes[0].value.contacts === undefined){
    return
  }
  console.log("---------inReply handler---------")
  console.log('Payload is genuine');
    const messages = entry[0].changes[0].value.messages[0].text.body;
  const phoneReciever = entry[0].changes[0].value.contacts[0].wa_id;

  console.log('--------------');
  console.log(messages);
  console.log(phoneReciever);
  console.log(currentPage);
  console.log('--------------');

  if (messages === "0" || currentPage === "beforeLandingPage") {
    sendReply(phoneReciever, landingPageData);
    currentPage = "afterLandingPage"
  }
  else if (messages === "1" && currentPage === "afterLandingPage") {
    sendReply(phoneReciever, foodMenu(0, selectedItems, menu));
    currentPage = "inFoodMenu"
  }
  else if (messages === "RESETMENU") {
    
          initialiseMenu(menu)
          sendReply(phoneReciever, "RESETTING MenuList, try again in few seconds 🧰")
          // currentPage = "inFoodMenu"
        }
        
        else if (messages === "RESETORDERS") {
          last5Reset(last5Orders)
          sendReply(phoneReciever, "RESETTING OrderList, try again in few seconds 🧰")
        }
  else if ((messages === "1" || messages === "2" || messages === "3" || messages === "4") && currentPage === "inFoodMenu") {

    sendReply(phoneReciever, foodMenu(messages, selectedItems, menu));
    // currentPage = "inFoodMenu"
  }

  else if (((messages === "#") && currentPage === "inFoodMenu") || ((messages === "2") && currentPage === "afterLandingPage")) {
    sendReply(phoneReciever, reviewOrder(selectedItems,menu));
    currentPage = "afterReview"
  }

  else if (((messages === "#") && currentPage === "afterReview") || ((messages === "3") && currentPage === "afterLandingPage")) {
    totalOrders[0] = totalOrders[0]+ 1
    sendReply(phoneReciever, placeOrder(selectedItems, last5Orders,totalOrders));
    selectedItems.length = 0;
    currentPage = "beforeLandingPage"
  }
  else if ((messages === "4") && currentPage === "afterLandingPage") {
    if (selectedItems.length === 0) {
      sendReply(phoneReciever, "None items selected to cancle. Please select items first");
      sendReply(phoneReciever, landingPageData);
      currentPage = "afterLandingPage"
    }
    else {
      selectedItems.length = 0
      sendReply(phoneReciever, "Your Order is Cancelled");
      sendReply(phoneReciever, landingPageData);
      currentPage = "afterLandingPage"
    }
  }
  else if ((messages === "5") && currentPage === "afterLandingPage") {
    sendReply(phoneReciever, orderHistory(last5Orders, menu));
    currentPage = "beforeLandingPage"
  }
  else if ((messages === passKey) && (currentPage === "afterLandingPage" || currentPage === "beforeLandingPage")) {
    sendReply(phoneReciever, adminAccess());
    currentPage = "admin"
  }
  else if ((messages.slice(0, passKey.length+15) === "CHANGEKEYFROM"+passKey+"TO") && currentPage === "admin") {
    passKey = messages.slice(passKey.length + 15, messages.length)
    
    sendReply(phoneReciever, "Key Changed Successfully 😉\n--------------------\n" + adminAccess());
    currentPage = "admin"
  }
  else if ((messages === "A" || messages === "a") && currentPage === "admin") {

    sendReply(phoneReciever, `Enter the item id 🔑`);
    currentPage = "adminID"
  }
  else if ((messages) && currentPage === "adminID") {
    nItem = `{
      "id": ${messages},`
    sendReply(phoneReciever, `Enter the item name 🍜`);
    currentPage = "adminName"
  }
  else if ((messages) && currentPage === "adminName") {
    nItem += `
    "item": "${messages}",`
    sendReply(phoneReciever, `Enter the item price 💲`);
    currentPage = "adminAddItem"
  }
  else if ((messages) && currentPage === "adminAddItem") {
    nItem += `
    "price": "${messages}"
  }`
    tempVar = 10
    const chkAdd = async () => {
      const res = await addItemToMenu(JSON.parse(nItem))
        .then((data) => {
          return data
        })
      tempVar = res;
      return tempVar;
    }
    chkAdd().then(() => {
      if (tempVar === true) {
        menuAddLocal(JSON.parse(nItem))
        sendReply(phoneReciever, "🟢Item Added Successfully🟢\nUpdated Food Menu\n----------------\n" + foodMenu(0, selectedItems, menu))
      }
      else {
        sendReply(phoneReciever, "🔴Operation Failed🔴")
      }
    })
    currentPage = "admin"
  }
  else if ((messages === "B" || messages === "b") && currentPage === "admin") {
    sendReply(phoneReciever, "🔴 Enter the item id to remove 🔴");
    currentPage = "adminRemoveItem"
  }
  else if ((messages) && currentPage === "adminRemoveItem") {
    tempVar = 10
    const chkRemove = async () => {
      const res = await removeItemFromMenu(messages)
        .then((data) => {
          return data
        })
      tempVar = res;
      return tempVar;
    }

    chkRemove().then(() => {
      if (res === true) {
        menuRemoveLocal(messages)
        sendReply(phoneReciever, "🟢Item Removed Successfully🟢\nUpdated Food Menu\n----------------\n" + foodMenu(0, selectedItems, menu))
      }
      else {
        sendReply(phoneReciever, "🔴Operation Failed🔴")
      }
    })
  }
  else if ((messages === "C" || messages === "c") && currentPage === "admin") {
    sendReply(phoneReciever, foodMenu(0, selectedItems, menu) + "\nDisplayed Cached Menu\n*D* to exit");
    currentPage = "admin"
  }
  else if ((messages === "D" || messages === "d") && currentPage === "admin") {
    sendReply(phoneReciever, "Successfully Exit from Admin Access 👨‍💻");
    currentPage = "beforeLandingPage"
  }
  else {
    sendReply(phoneReciever, landingPageData);
    currentPage = "afterLandingPage"
  }
}

const app = express();
const appSecret = '1614ebf680e3dbdf0486946b5581ada0';
app.use(express.json());

app.get('/webhooks', (req, res) => {

  const mode = req.query['hub.mode'];
  const challenge = req.query['hub.challenge'];
  const verifyToken = req.query['hub.verify_token'];

  if (mode === 'subscribe' && verifyToken === 'meatyhamhock') {

    console.log('[LOG] Verification successful');
    res.status(200).send(challenge);
  } else {

    console.log('[LOG] Verification failed');
    res.sendStatus(403);
  }
});

app.post('/webhooks', (req, res) => {
  const payload = req.body;
  const signature = req.headers['x-hub-signature'];

  const generatedSignature = 'sha1=' + crypto.createHmac('sha1', appSecret)
    .update(JSON.stringify(payload))
    .digest('hex');

  if (signature === generatedSignature) {
    replyHandler(menu, last5Orders, payload, selectedItems);
    res.sendStatus(200);
  }
  else {

    console.log('[LOG] Invalid payload signature');
    res.sendStatus(403);
  }

});

app.listen(3000, () => {
  console.log('[LOG] Server is running on port 3000');
});


// tempVar = false
    // const chkRESET = async () => {
      //   const res = await initialiseMenu(menu).then(() => {
    //     tempVar = res
    //   return res})
    // }
    // chkRESET().then(() => {
      //   if (tempVar === true) {
        //     sendReply(phoneReciever, "🟢RESET Successfully🟢\n\n" + foodMenu(0, selectedItems, menu))
        //   }
        //   else {
          //     sendReply(phoneReciever, "🔴Operation Failed, Try Again🔴")
          //   }
          // })