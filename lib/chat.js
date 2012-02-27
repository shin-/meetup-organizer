var io = require('stack.io')({ type : 'pub/sub' });
var redis = require('redis').createClient();

redis.setnx('msgid', 0);

var users = {
    keys : function() {
        var res = [];
        for (k in this) {
            k != 'keys' && res.push(k);
        }
        return res;
    }
};

io.expose('ChatService', {
    connect : function(nick, cb) {
        console.log('Call to connect -->' + nick);
        if (users[nick]) {
            cb({ err : 'Username taken' });
        } else {
            var key = Math.random() * 100000;
            io.emit('new_usr', nick);
            io.emit('new_usr_serv', nick, key);
            cb({ key : key, users : users.keys() });
        }
    },
    
    get : function(ids, cb) {
        if (typeof ids == 'function') {
            cb = ids;
            redis.hgetall('messages', function(err, data) {
                cb(data);
            });
        } else if (typeof ids == 'number') {
            redis.hget('messages', ids, function(err, data) {
                cb(data);
            });
        } else {
            redis.hmget('messages', ids, function(err, data) {
                cb(data);
            });
        }
    },

    send : function(nick, key, msg, cb) {
        if (users[nick] && users[nick].key === key) {
            redis.incr('msgid', function(err, id) {
                var message = {
                    author : nick,
                    msg : msg,
                    id : id
                };
                redis.hset('messages', id, JSON.stringify(message));
                io.emit('new_msg', message);
                cb(null, message);
            });
        } else {
            cb('Invalid key');
        }
    },
    
    disc : function(nick, key, cb) {
        if (users[nick] && users[nick].key === key) {
            io.emit('disc', nick);
            cb(null, 'ok');
        } else {
            cb('Invalid key');
        }
    }
});

io.on('new_usr_serv', function(nick, key) {
    users[nick] = { key : key };
});

/*io.on('new_msg', function(nick, msg) {
    messages.push({ author : nick, msg : msg });
});*/

io.on('disc', function(nick) {
    delete users[nick];
});
