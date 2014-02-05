Shortly.SearchView = Backbone.View.extend({

  className: 'creator',

  template: _.template(' \
    <form> \
        <input class="text" type="text" name="query"> \
        <input type="submit" value="Search"> \
    </form> \
    <img class="spinner" src="/spiffygif_46x46.gif"> '
  ),

  events: {
    "submit": "filter"
  },

  render: function() {
    this.$el.html( this.template() );
    return this;
  },

  filter: function(e){
    e.preventDefault();
    var $form = this.$el.find('form .text');
    var searchTerm = $form.val();
    this.collection.trigger("filter");
    this.collection.fetch({ data: {query: searchTerm} });
    $form.val('');
  }
});