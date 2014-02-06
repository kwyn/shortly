Shortly.LinksView = Backbone.View.extend({

  className: 'links',

  initialize: function(){
    this.collection.on('sync', this.addAll, this);
    this.collection.on('filter', this.render, this);
    this.collection.on('filterTime', this.filterTime, this);
    this.collection.on('filterVisits', this.filterVisits, this);
    this.collection.fetch();
  },
  filterTime: function() {
    this.render();
    this.collection.fetch({data: {sortBy: "updated_at" }});
  },
  filterVisits: function() {
    this.render();
    this.collection.fetch({data: {sortBy: "visits" }});
  },
  render: function() {
    this.$el.empty();
    return this;
  },
  addAll: function(){
    this.collection.forEach(this.addOne, this);
  },

  addOne: function(item){
    var view = new Shortly.LinkView( {model: item} );
    this.$el.append(view.render().el);
  }

});