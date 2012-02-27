var Org = Ember.Application.create();

Org.stackioAdapter = DS.Adapter.create({
    find: function(store, type, id) {
        io.call(type.svc, 'get')(id, function(data) {
            store.load(type, id, JSON.parse(data));
        });
    },
    
    findMany: function(store, type, ids) {
        io.call(type.svc, 'get')(ids, function(data) {
            for (var k in data) {
                data[k] = JSON.parse(data[k]);
            }
            store.loadMany(type, ids, data);
        });
    },
    
    findAll: function(store, type) {
        io.call(type.svc, 'get')(function(data) {
            var ids = [];
            for (var k in data) {
                ids.push(k);
                data[k] = JSON.parse(data[k]);
            }
            store.loadMany(type, ids, data);
        });
    },
    
    createRecord: function(store, type, model) {
        io.call(type.svc, 'send')(model.get('author'), Org.key, model.get('msg'), 
            function(err, data) {
                if (err) console.log(err);
                else store.didCreateRecord(model, data);
            });
    }
});

Org.store = DS.Store.create({
    adapter: Org.stackioAdapter
});

Org.Message = DS.Model.extend({
    author: DS.attr('string'),
    msg: DS.attr('string')
});

Org.Message.reopenClass({
    svc: 'ChatService'
});

$(window).ready(function() {
    Org.messages = Org.store.findAll(Org.Message);
});
