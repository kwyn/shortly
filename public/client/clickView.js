Shortly.ClickView = Backbone.View.extend({
  className: 'click',
  template: _.template("<div><%= created_at %></div>"),
  render: function(){
    // console.log(this.model.attributes);
    this.$el.html( this.template(this.model.attributes) );
    return this;
  }


});