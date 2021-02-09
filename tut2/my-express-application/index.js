// // CREATING AND DEPLOYING A SINGLE ENDPOINT

// // Simple application that returns "Hello World!" when a request comes in on the root path

// // Import the 'serverless-http' package - middleware that handles the interface between 
// // your Node.js application and the specifics of API Gateway
// const serverless = require('serverless-http');
// const express = require('express');
// const app = express()

// // '/' => root path
// app.get('/', function(req,res) { 
//     res.send('Hello World!')
// })

// // Exported a 'handler' function which is our application wrapped in the 'serverless' package
// module.exports.handler = serverless(app);

// ------------------------------------------------------------------------------------------- //

// // ADDING A DYNAMODB TABLE WITH REST-LIKE ENDPOINTS && PATH-SPECIFIC ROUTING

// // In addition to the base "Hello World" endpoint, we have two new endpoints:
// // 'GET /users/:userId' for getting a User
// // 'POST /users' for creating a new User

// const serverless = require('serverless-http');
// const bodyParser = require('body-parser');
// const express = require('express');
// const app = express()
// const AWS = require('aws-sdk');
// const { DynamoDB } = require('aws-sdk');

// const USERS_TABLE = process.env.USERS_TABLE;
// const dynamoDb = new AWS.DynamoDB.DocumentClient();

// app.use(bodyParser.json({ strict:false }));

// app.get('/', function(req,res) {
//     res.send('Hello World!')
// });

// // Get User endpoint
// app.get('/users/:userId', function (req, res) {
//     const params = {
//         TableName: USERS_TABLE,
//         Key: {
//             userId: req.params.userId,
//         },
//     }

//     dynamoDb.get(params,(error, result) => {
//         if (error) {
//             console.log(error);
//             res.status(400).json({ error: 'Could not get user'}); // bad request
//         }
//         if (result.Item) {
//             const {userId, name} = result.Item;
//             res.json({ userId, name }); // send a json response
//         } else {
//             res.status(404).json({ error: "User not found"}); // not found 
//         }
//     });
// })

// // Create User endpoint
// app.post('/users', function (req,res) {
//     const { userId, name } = req.body;
//     if (typeof userId !== 'string') {
//         res.status(400).json({ error: '"userId" must be a string'}); 
//     } else if (typeof name !== 'string') {
//         res.status(400).json({ error: '"name" must be a string'}); 
//     }

//     const params = {
//         TableName: USERS_TABLE,
//         Item: {
//             userId: userId,
//             name: name,
//         },
//     };

//     dynamoDb.put(params, (error) => {
//         if (error) {
//             console.log(error);
//             res.status(400).json({ error: 'Could not create user'});
//         }
//         res.json({ userId, name});
//     });
// })

// module.exports.handler = serverless(app);

// // In terminal:
// // To create a new user
// // $ curl -H "Content-Type: application/json" -X POST ${BASE_DOMAIN}/users -d '{"userId": "alexdebrie1", "name": "Alex DeBrie"}'
// // To retrieve an existing user
// // $ curl -H "Content-Type: application/json" -X GET ${BASE_DOMAIN}/users/alexdebrie1
// // Will output on console: {"userId":"alexdebrie1","name":"Alex DeBrie"}

// // Not a full-fledged REST API
// // Want to add error handling, authentication, additional business logic 

// ------------------------------------------------------------------------------------------- //

// LOCAL DEVELOPMENT CONFIGURATION WITH SERVERLESS OFFLINE PLUGIN

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express()
const AWS = require('aws-sdk');

const USERS_TABLE = process.env.USERS_TABLE;

// NEW
// When instantiating the DynamoDB client, we've added in some special configuration if we're  in  local,
// offline environment
// 'serverless-offline' plugin sets an environment variable of 'IS_OFFLINE' to 'true' 
// so we've used that  to handle the config
const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamoDb;
if (IS_OFFLINE === 'true') {
    dynamoDb =  new AWS.DynamoDB.DocumentClient({
        refion: 'localhost',
        endpoint: 'http://localhost:8000'
    })
    console.log(dynamoDb);
} else{
    dynamoDb = new AWS.DynamoDB.DocumentClient();
};
// up to here

app.use(bodyParser.json({ strict:false }));

app.get('/', function(req,res) {
    res.send('Hello World!')
});

// Get User endpoint
app.get('/users/:userId', function (req, res) {
    const params = {
        TableName: USERS_TABLE,
        Key: {
            userId: req.params.userId,
        },
    }

    dynamoDb.get(params,(error, result) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Could not get user'}); // bad request
        }
        if (result.Item) {
            const {userId, name} = result.Item;
            res.json({ userId, name }); // send a json response
        } else {
            res.status(404).json({ error: "User not found"}); // not found 
        }
    });
})

// Create User endpoint
app.post('/users', function (req,res) {
    const { userId, name } = req.body;
    if (typeof userId !== 'string') {
        res.status(400).json({ error: '"userId" must be a string'}); 
    } else if (typeof name !== 'string') {
        res.status(400).json({ error: '"name" must be a string'}); 
    }

    const params = {
        TableName: USERS_TABLE,
        Item: {
            userId: userId,
            name: name,
        },
    };

    dynamoDb.put(params, (error) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Could not create user'});
        }
        res.json({ userId, name});
    });
})

module.exports.handler = serverless(app);