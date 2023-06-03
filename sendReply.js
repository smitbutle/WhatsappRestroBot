const axios = require('axios');
const permaToken = `EAALPvIea2l4BAH4PCYuHIT9RbrPGF2MZC6w9ZCOWUvPGjSh52UyHXJRbHwIi3iSg5QFdifV944qHZCw2l9P0kUAjblgCCiIszcGJZBOchHb9tmvFq7JS1RhnYwfHC5U7mTIRGRPYsEZC6zbyIrLsPqNR7a3kbad4GUFEtolChSUzATQ5hKMEf`
async function sendReply(phoneReceiver, messageBody) {
    console.log("sending-reply------");
    try {
        const response = await axios.post('https://graph.facebook.com/v17.0/119592584472561/messages', {
            "messaging_product": "whatsapp",
            "to": phoneReceiver,
            "type": "text",
            "text": {
                "preview_url": false,
                "body": messageBody
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${permaToken}`
            }
        });

        console.log(response.data);

        console.log("---------[LOG] DONE---------");
    } catch (error) {
        console.error(error);
    }
}
exports.sendReply = sendReply;
