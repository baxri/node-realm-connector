var Realm = require('realm');
var express = require('express');

const app = express();

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

app.get('/', function (req, res) {

    var realmPath = (require('./config/index')).db;

    if (req.query.realm_path) {
        realmPath = req.query.realm_path;
    }

    let realm = new Realm({
        path: realmPath,
    });

    let result = realm.objects(req.query.document);

    if (req.query.filter && req.query.filter_args) {
        let filter = replaceAll(req.query.filter, '/', '=');
        result = result.filtered(...[filter, ...req.query.filter_args]);
    }

    if (req.query.sorted) {
        let sorted = req.query.sorted.split('/');
        let field = sorted[0];
        let dir = sorted[1] == 'asc' ? false : true;
        result = result.sorted(field, dir);
    }

    let limitstart = 0;

    if (req.query.limitstart) {
        limitstart = req.query.limitstart;
    }

    if (req.query.limit) {
        result = result.slice(limitstart, req.query.limit);
    }

    var arr = [];
    Object.keys(result).map(([key]) => {
        arr.push(result[key])
    });

    res.json(arr);
});

app.listen(8080, function () {
    console.log('App listening on port 8080!');
});

console.log(app);



