var Realm = require('realm');
var express = require('express');

const app = express();

const port = process.env.PORT || 8080;

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
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
        result = result.slice(limitstart, limitstart + req.query.limit + 1);
    }

    var arr = [];
    Object.keys(result).map((key) => {
        arr.push(result[key])
    });

    arr = arr.map(picture => {
        return {
            id: picture.id,
            source: picture.source,
            date: picture.date,
            created_at: picture.created_at,
        }
    })

    res.json(arr);
});

app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});