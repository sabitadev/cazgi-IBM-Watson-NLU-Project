const express = require('express');
const dotenv = require ('dotenv');
dotenv.config();
const app = new express();

app.use(express.static('client'))
const cors_app = require('cors');
app.use(cors_app());

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
            version: '2020-08-01',
            authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

let analyzeParamsForUrl = {
    'url':'',
    'features': {
        'entities': {
        'emotion': true,
        'sentiment': true,
        'limit': 2,
        },
    },
};

let analyzeParamsForText = {
    'text':'',
     'features': {
        'keywords': {
        'emotion': true,
        'sentiment': true,
         }
    }
};

app.get("/",(req,res)=>{
    res.render('index.html'); 
});

app.get("/url/emotion", (req,res) => {
   let naturalLanguageUnderstanding = getNLUInstance();
   const url = (req.query.url).trim();
   analyzeParamsForUrl['url'] = url;
   naturalLanguageUnderstanding.analyze(analyzeParamsForUrl)
    .then(analysisResults => {
        return res.send(analysisResults.result.entities[0].emotion);
        })
    .catch(err => {
            console.log('error:', err);
        });  
});

app.get("/url/sentiment", (req,res) => {
    let naturalLanguageUnderstanding = getNLUInstance();
    const url = (req.query.url).trim();
    analyzeParamsForUrl['url'] = url;
    naturalLanguageUnderstanding.analyze(analyzeParamsForUrl)
        .then(analysisResults => {
            return res.send(analysisResults.result.entities[0].sentiment.label);
            })
        .catch(err => {
                console.log('error:', err);
            });  
}); 

app.get("/text/emotion", (req,res) => {
   let naturalLanguageUnderstanding = getNLUInstance();
   analyzeParamsForText['text'] = req.query.text;
   naturalLanguageUnderstanding.analyze(analyzeParamsForText)
    .then(analysisResults => {
        return res.send(analysisResults.result.keywords[0].emotion);
        })
    .catch(err => {
            console.log('error:', err);
        });  
});

app.get("/text/sentiment", (req,res) => {
    let naturalLanguageUnderstanding = getNLUInstance();
    analyzeParamsForText['text'] = req.query.text;
    naturalLanguageUnderstanding.analyze(analyzeParamsForText)
        .then(analysisResults => {
            return res.send(analysisResults.result.keywords[0].sentiment.label);
            })
        .catch(err => {
                console.log('error:', err);
            });  
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})
