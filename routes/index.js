
/*
 * GET home page.
 */
var mysql      = require('mysql');
var User = require('../models/User');
var Group = require('../models/Group');

var config = require('../config');

var db_config = config.db_config;

exports.index = function(req, res){
    var conn = mysql.createConnection(db_config);
    //var userList = [];
    var users = [];
    var groups = [];

    conn.connect();
    conn.query('SELECT * FROM MT_GROUP', function(err, rows, fields) {
        if (err) throw err;

        var i;
        for(i in rows){
            var group = new Group(rows[i]);
            groups.push(group);
            var arr = [];
            users.push(arr);
        }

    });
    //console.log(groups);
    conn.query('SELECT * FROM MT_USER', function(err, rows, fields) {
        if (err) throw err;

        var i;
        for(i in rows){
            var user = new User(rows[i]);
            var j;
            for(j in groups){
                if (user.group == groups[j].id){
                    users[j].push(user);
                }
            }
        }
        console.log(groups);
        console.log(users);
        res.render('index', {
            title: '点餐',
            'groups': groups,
            'users': users
        });
    });
    conn.end();
};

exports.reset = function(req, res){
    var conn = mysql.createConnection(db_config);
    conn.connect();
    conn.query('UPDATE MT_USER SET STATUS = 0', function(err, rows, fields) {
        if (err) throw err;
        console.log('reset');
        res.redirect('/');
    });
    conn.end();
};

exports.add = function(req, res){
    var conn = mysql.createConnection(db_config);
    var id=req.body['id'];
    if(id){
        conn.connect();
        conn.query('UPDATE MT_USER SET STATUS = 1 WHERE ID ='+id, function(err, rows, fields) {
            if (err) throw err;
            console.log('ADD: ', id);
            res.redirect('/');
        });
        conn.end();
    }
};

exports.addUser = function(req, res){
    var conn = mysql.createConnection(db_config);
    var name=req.body['name'];
    var group=req.body['group'];
    if(name){
        conn.connect();
        conn.query('INSERT INTO MT_USER VALUES (null, "'+name+'", "'+group+'", "0")', function(err, rows, fields) {
            if (err) throw err;
            console.log('addUser');
            res.json({
                id:rows.insertId
            });
        });
        conn.end();
    }
};

exports.addGroup = function(req, res){
    var conn = mysql.createConnection(db_config);
    var name=req.body['name'];
    if(name){
        conn.connect();
        conn.query('INSERT INTO MT_GROUP VALUES (null, "'+name+'")', function(err, rows, fields) {
            if (err) throw err;
            console.log('addGroup');
            res.json({
                id:rows.insertId
            });
        });
        conn.end();
    }

    res.redirect('/');
};


exports.del = function(req, res){
    var conn = mysql.createConnection(db_config);
    var id=req.body['id'];
    if(id){
        conn.connect();
        conn.query('DELETE FROM MT_USER WHERE ID ='+id, function(err, rows, fields) {
            if (err) throw err;
            console.log('DEL: ', id);

            res.redirect('/');
        });
        conn.end();
    }
};

exports.delGroup = function(req, res){
    var conn = mysql.createConnection(db_config);
    var id=req.body['id'];
    if(id){
        conn.connect();
        conn.query('DELETE FROM MT_GROUP WHERE ID ='+id, function(err, rows, fields) {
            if (err) throw err;
            console.log('DEL: ', id);

            res.redirect('/');
        });
        conn.end();
    }
};

exports.editGroup = function(req, res){
    var conn = mysql.createConnection(db_config);
    var id=req.body['id'];
    var name = req.body['name'];
    console.log(name);
    if(id){
        conn.connect();
        conn.query('UPDATE MT_GROUP SET NAME = "'+name+'" WHERE ID ='+id, function(err, rows, fields) {
            if (err) throw err;
            console.log('UPDATE: ', id);

            res.redirect('/');
        });
        conn.end();
    }
};

exports.remove = function(req, res){
    var conn = mysql.createConnection(db_config);
    var id=req.body['id'];
    if(id){
        conn.connect();
        conn.query('UPDATE MT_USER SET STATUS = 0 WHERE ID ='+id, function(err, rows, fields) {
            if (err) throw err;
            console.log('REMOVE: ', id);
            res.redirect('/');
        });
        conn.end();
    }
};

