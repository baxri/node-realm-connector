var Realm = require('realm');
var express = require('express');

const app = express();

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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



