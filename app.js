const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { dirname } = require('path');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));  // Place to look for static files.

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us8.api.mailchimp.com/3.0/lists/b2bd321d48";

    const options = {
        method: "POST",
        auth: "amoghpatel1:6da48904ef7479221776faf92e14a201-us8"
    }

    const request = https.request(url, options, function(response) {
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
    })

    request.write(jsonData);
    request.end();

})

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port " + process.env.PORT);
})
