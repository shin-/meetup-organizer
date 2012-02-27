var io = stackio();
var nick;
$(window).ready(function() {
    $('#chat').hide();
    io.on('new_usr', function(nick) {
        $('#users').append('<li id="' + nick + '">' + nick + '</li>');
    });

    io.on('disc', function(nick) {
        $('#' + nick).remove();
    });

    io.on('new_msg', function(msg) {
        if (msg.author != nick)
            Org.store.load(Org.Message, msg.id, msg);
    });

    $('#frm').submit(function(e) {
        Org.store.createRecord(Org.Message, { msg : $('#msg').val(), author : nick });
        $('#msg').val('');
        Org.store.commit();
        return false;
    });

    $('#login').submit(function(e) {
        e.preventDefault();
        nick = $('#nick').val();
        io.call('ChatService', 'connect')(nick, function(data) {
            if (data.err) {
                console.log(data.err);
            } else {
                Org.key = data.key;
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
        io.call('ChatService', 'disc')(nick, Org.key, function(err) {
            if (err) console.log(err);
            else {
                $('#chat').hide();
                $('#users').empty();
                $('#login').show();
            }
        });
    });
});
