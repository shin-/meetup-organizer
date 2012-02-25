var io = require('stack.io')({ type : 'pub/sub' });

var users = { 
    keys : function() {
        var res = [];
        for (k in this) {
            k != 'keys' && res.push(k);
        }
        return res;
    }
};
var messages = [];

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

    send : function(nick, key, msg, cb) {
        if (users[nick] && users[nick].key === key) {
            io.emit('new_msg', nick, msg);
            cb(null, 'ok');
        } else {
            cb('Invalid key');
        }
    },
    
    disc : function(nick, key, cb) {
        console.log('predisc');
        if (users[nick] && users[nick].key === key) {
            io.emit('disc', nick);
            cb(null, 'ok');
        } else {
            cb('Invalid key');
        }
        console.log('postdisc');
    }
});

io.on('new_usr_serv', function(nick, key) {
    users[nick] = { key : key };
});

io.on('new_msg', function(nick, msg) {
    messages.push({ author : nick, msg : msg });
});

io.on('disc', function(nick) {
    delete users[nick];
});
