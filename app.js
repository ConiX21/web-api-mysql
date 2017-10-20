var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mysql = require("mysql");
var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(cors());

app.use(function (req, res, next) {
    /*res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();*/
});



// First you need to create a connection to the db
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Nico1234!",
    database: "personDb"
});

con.connect(function (err) {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});





//Rouage

app.get('/api/persons', cors(), function (req, res) {
    con.query('SELECT * FROM person', function (err, rows) {
        if (err) throw err;
        
        console.log('Persons request');
        res.send(rows);
    });
});

// POST method route
app.post('/api/person/add', function (req, res, next) {
    //res.send('POST request to the homepage');
    //var t = req.body;
    
    //var person = { name: 'Winnie', location: 'Australia' };
    var person = req.body;
    var that = res;
    
    con.query('INSERT INTO person SET ?', person, function (err, res) {
        if (err)
            throw err;
        else
            that.send("true");
            console.log('Last insert ID:', res.insertId);
    });



});

app.delete('/api/person/delete/:idperson', cors(), function (req, res, next) {
    var idperson = req.params.idperson;
    console.log(idperson);
    var that = res;
    con.query('DELETE FROM person WHERE idperson = ?', [idperson],
      function (err, result) {
            if (err) throw err;
        else
            that.send("true");

            console.log('Deleted ' + result.affectedRows + ' rows');
        }
    );
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});


//con.end(function (err) {
//  // The connection is terminated gracefully
//  // Ensures all previously enqueued queries are still
//  // before sending a COM_QUIT packet to the MySQL server.
//});

