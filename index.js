var Realm = require('realm');
var express = require('express');
const app = express();
const realmPath = './DB/haccp-db-8.realm';

let realm = new Realm({
    path: realmPath,
});

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

app.get('/', function (req, res) {
    let result = realm.objects(req.query.document);
    if (req.query.filter.length > 0 && req.query.filter_args.length > 0) {
        let filter = replaceAll(req.query.filter, '/', '=');
        result = result.filtered(...[filter, ...req.query.filter_args]);
    }

    res.json(result);
});

app.listen(8080, function () {
    console.log('App listening on port 8080!');
});

console.log(app);



