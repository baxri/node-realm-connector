## Node Realm Connector

### Instalation

Clone this repositorie and run following commands:

```
npm install
npm start
```

### Get list

To retrive information from specifiec table of realm you need to access folowing url:

```
curl http://localhost:8080/?document={REALM_TABLE_NAME}
```

### Filter information

Pass two additional parameters for filtering

```
# filter
# filter_args
```

example:

```
curl http://localhost:8080/?document={REALM_TABLE_NAME}&filter=date/$0 and count/$1&filter_args[]=2018-01-05&filter_args[]=5
```

#### Note

for Comparision you need to pass "/" and not "=" for example: date/$0 and not date=$0.

### Sorting

For sorting you can pass ```sorted``` parameter, example:

```
curl http://localhost:8080/?document={REALM_TABLE_NAME}&sorted=date/desc
```

### Limits and pagination

You have two additional arguments to make pagination functionality:

```
curl http://localhost:8080/?document={REALM_TABLE_NAME}&limit=5&limitstart=0
```

To get infomation from 0 and 5 rows.







