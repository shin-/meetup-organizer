var io = stackio();
var key;
var nick;
$(window).ready(function() {
    $('#chat').hide();
    io.on('new_usr', function(nick) {
        $('#users').append('<li id="' + nick + '">' + nick + '</li>');
    });

    io.on('disc', function(nick) {
        $('#' + nick).remove();
    });

    io.on('new_msg', function(nick, msg) {
        $('#talk').append('<li><span style="font-weight:bold;">' + nick + '</span>: ' + msg + '</li>');
    });

    $('#frm').submit(function(e) {
        e.preventDefault();
        io.call('ChatService', 'send')(nick, key, $('#msg').val(), function(err, data) {
            if (err) console.log(err);
            $('#msg').val('');
        });
        return false;
    });

    $('#login').submit(function(e) {
        e.preventDefault();
        nick = $('#nick').val();
        io.call('ChatService', 'connect')(nick, function(data) {
            if (data.err) {
                console.log(err);
            } else {
                key = data.key;
                for (var i = 0, l = data.users.length; i < l; i++) {
                    var nick = data.users[i];
                    $('#users').append('<li id="' + nick + '">' + nick + '</li>');
                }
                $('#login').hide();
                $('#chat').show();
            }
        });
        return false;
    });
    
    $('#disc').click(function() {
        io.call('ChatService', 'disc')(nick, key, function(err) {
            if (err) console.log(err);
            else {
                $('#chat').hide();
                $('#users').empty();
                $('#login').show();
            }
        });
    });
});
