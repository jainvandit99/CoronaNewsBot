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

const app = dialogflow({
    debug: true
}).use(sessionEntitiesHelper());

const helperFunctions = require('./functions')

app.intent('Default Welcome Intent', (conv) => {
    conv.ask("Hey ask me number of cases or deaths in some district")
})

app.intent('Default Fallback Intent', (conv) => {
    conv.ask("I'm Sorry, I don't know how to do that yet!")
    conv.ask("You can ask me number of cases or deaths in each district")
})

app.intent('totalCountIntent', async (conv,{scenario,district,date,isNew}) => {
    conv.ask(`${scenario} ${district} ${date} ${isNew}`)
})

app.catch((conv, error) => {
    console.error(error);
    conv.ask('I encountered a glitch. Can you say that again?');
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);