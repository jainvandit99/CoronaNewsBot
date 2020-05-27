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

app.intent('Default Welcome Intent', async(conv) => {
    conv.ask("Hey, ask me number of cases or deaths in some district")
    try{
        let districtData = await helperFunctions.getAllDistricts()
        conv.data.districtData = districtData
        var areas = []
        for(var i=0; i<districtData.states.length; i++){
            areas.push(districtData.states[i])
            for(var j=0; j<districtData.districts[districtData.states[i]].length; j++){
                areas.push(districtData.districts[districtData.states[i]][j])
            }
        }
        console.log(areas)
        let entities = Array.from(areas).map(area => {
            return {
              value: area,
              synonyms: [area]
            }
        })
        console.log(entities)
        await conv.sessionEntities.add({
            name: 'district',
            entities: entities
          });
        await conv.sessionEntities.send();
    }catch(error){
        console.error(error)
        conv.ask("Some error has occured, try again later")
    }
})

app.intent('Default Fallback Intent', (conv) => {
    conv.ask("I'm Sorry, I don't know how to do that yet!")
    conv.ask("You can ask me number of cases or deaths in each district")
})

app.intent('totalCountIntent', async (conv,{scenario,deathorcase,district,date,isNew}) => {
    try{
        let result = await helperFunctions.getConvForCases({
            scenario: scenario,
            district: district,
            date: date,
            isNew: isNew,
            deathorcase: deathorcase
        },conv.data.districtData)
        conv.ask(result)
    }catch (error) {
        console.error(error)
        conv.ask("Some error has occured, try again later")
    }
})

app.catch((conv, error) => {
    console.error(error);
    conv.ask('I encountered a glitch. Can you say that again?');
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);