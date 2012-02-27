var stackioAdapter = DS.Adapter.create({
    find: function(store, type, id) {
        io.call(type.svc, 'get')(id, function(data) {
            store.load(type, id, data);
        });
    },
    
    findAll: function(store, type) {
        io.call(type.svc, 'get')(function(data) {
            store.loadMany(type, data);
        });
    },
    
    createRecord: function(store, type, model) {
        io.call(type.svc, 'send')(model.get('author'), Org.key, model.get('msg'), 
            function(data) {
                
            });
    }
});

Org.store = DS.Store.create({
    adapter: stackioAdapter
});

Org.Message = DS.Model.extend({
    svc: 'ChatService',
    author: DS.attr('string'),
    msg: DS.attr('string')
});

Org.key = key;
