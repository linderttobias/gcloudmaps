const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const fs = require('fs');
require('dotenv').config();


const env = process.env.ENVIRONMENT; //dev, test, prod
 
const app = express();

app.use(express.json({limit: "500kb", extended: true}))
app.use(express.urlencoded({limit: "500kb", extended: true}))
 
app.use(cors());
app.use(bodyParser.json());


app.post('/save',(req, res) => {
    const data = JSON.stringify(req.body)
    const now = new Date();
    console.log("POST REQUEST: " + now.toLocaleTimeString());
    const service = req.query['service'];
    const fileName = './data/' + service + '.json'
    console.log(service)
    console.log(req.query)
    fs.writeFile(fileName, data, function (err) {
        if (err) {
        res.statusCode = 500;
        res.end('Error saving object to file');
        } else {
        res.end('success');
        }
    });
});

app.get("/data", async (req, res, next) => {
    const now = new Date();
    console.log("GET REQUEST: " + now.toLocaleTimeString());
    const service = req.query['service'];
    const fileName = './data/' + service + '.json'
    fs.readFile(fileName, (err, data) => {
        if (err) throw err;
        let parsedJson = JSON.parse(data);
        res.json(parsedJson);
    });


});

app.listen(3001, () => {
    console.log("Server running successfully on 3001");
    console.log("selected env: " + env);
});