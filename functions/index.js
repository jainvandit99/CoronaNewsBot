const functions = require('firebase-functions');
const { sessionEntitiesHelper } = require('actions-on-google-dialogflow-session-entities-plugin')
const {
    dialogflow,
    Suggestions,
    actionssdk,
    Image,
    Table,
    Carousel,
    BasicCard
  } = require('actions-on-google');

  const fetch = require("node-fetch")

  const app = dialogflow({
    debug: true
}).use(sessionEntitiesHelper());


app.intent('Default Welcome Intent', (conv) => {
    conv.ask("Hey Ask Me Stuff About Corona")
})




exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);