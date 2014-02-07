Shortly.MyLinksView = Backbone.View.extend({

  initialize: function() {
    this.collection.on('sync', this.addAll, this);
    this.collection.fetch({ data: {myLinks: true} });
  },

  render: function() {
    this.$el.empty();
    return this;
  },

  addAll: function(){
    console.log("Adding all!");
    this.collection.forEach(this.addOne, this);
  },

  addOne: function(item){
    var view = new Shortly.LinkView( {model: item} );
    $('#container').append(view.render().el);
  }

});