var Realm = require('realm');
var express = require('express');

const app = express();

const realmPath = './DB/haccp-db-8.realm';


let realm = new Realm({
    path: realmPath,
});

app.get('/', function (req, res) {
    let items = realm.objects(req.query.document);
    res.json(items);
});

app.listen(8080, function () {
    console.log('App listening on port 8080!');
});

console.log(app);



