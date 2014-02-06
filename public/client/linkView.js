Shortly.LinkView = Backbone.View.extend({

  className: 'link',

  template: _.template(' \
      <a href="#" class="add"><img src="/plus-icon.png" class="add"/></a> \
      <img src="/redirect_icon.png"/> \
      <div class="info"> \
        <div class="visits"><a href="#" class="filterVisits"><span class="count"><%= visits %></span>Visits</a></div> \
        <div class="title"><%= title %></div> \
        <div class="original"><%= url %></div> \
        <a href="<%= base_url %>/<%= code %>"><%= base_url %>/<%= code %></a> \
        <div class="last_click"><a href="#" class="filterTime"><%= updated_time %></a></div>\
      </div>'
  ),
  events: {
    "click .filterTime": "filterTime",
    "click .filterVisits": "filterVisits",
    "click .add": "addLink"
  },
  filterTime: function(e) {
    this.model.trigger("filterTime");
  },
  filterVisits: function(e) {
    this.model.trigger("filterVisits");
  },
  render: function() {
    this.$el.html( this.template(this.model.attributes) );
    return this;
  },
  addLink: function() {
    this.model.save();
  }

});