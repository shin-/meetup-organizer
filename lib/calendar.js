var fs = reauire('fs');
var settings = JSON.parse(fs.readFileSync('../settings.json').oauth;
var url = require('url');
var https = require('https');

var scope = 'https://www.googleapis.com/auth/calendar';

var oauth = {
    buildURL : function(params) {
    var r = 'https://accounts.google.com/o/oauth2/auth?response_type=code';
    for (var k in params) {
        r += '&' + k + '=' + params[k];
    }
    return r;
    },

    handleResponse : function (resParams, otherParams) {
        if (resParams.error) {
            return null;
        } else {
            var r = 'https://accounts.google.com/o/oauth2/token?code=' + resParams.code +
                '&grant_type=authorization_code';
            for (var k in otherParams) {
                r += '&' + k + '=' + otherParams[k];
            }
            return r;
        }
    }

};

function request(url_, headers, method, data, cb) {
    var opts = url.parse(url_);
    opts.method = method || 'GET';
    opts.headers = headers;
    var req = https.request(opts, function(res) {
        var data = '';
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
            cb(res.statusCode, res.headers, data);
        });
    });
    
    if (data) {
        req.write(data);
    }
    req.end();
}

exports.auth = function(uId) {
    var url_ = oauth.buildURL({
        client_id : settings.client_id,
        redirect_uri : setting.redirect_uri,
        scope : scope,
        access_type : 'online'
    });
}
