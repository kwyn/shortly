window.Shortly = Backbone.View.extend({

  template: _.template(' \
      <h1>Shortly</h1> \
      <div class="navigation"> \
      <ul> \
        <li><a href="#" class="index">All Links</a></li> \
        <li><a href="#" class="addLink">Add link </a></li> \
        <li><a href="#" class="myLinks">My Links </a></li> \
        <li><a href="/logout" class="logout">Log Out</a></li> \
      </ul> \
      </div> \
      <form id="shorten"> \
        <input class="text" type="text" name="url"> \
        <input type="submit" value="Shorten"> \
      </form> \
      <img class="spinner" src="/spiffygif_46x46.gif"> \
      <div class="message"></div> \
      <div class="search"></div> \
      <div id="container"></div>'
  ),

  events: {
    "click li a.index":  "renderIndexView",
    "click li a.myLinks": "renderMyLinksView",
    "submit #shorten": "shortenUrl",
    "click li a.addLink": "showLink"
    // "click li a.login": "login"
  },

  initialize: function(){
    console.log( "Shortly is running" );
    $('body').append(this.render().el);
    this.renderIndexView(); // default view
  },

  render: function(){
    this.$el.html( this.template() );
    return this;
  },

  renderIndexView: function(e){
    e && e.preventDefault();
    var links = new Shortly.Links();
    var linksView = new Shortly.LinksView( {collection: links} );
    this.$el.find('#container').html( linksView.render().el );
    var searchView = new Shortly.SearchView( {collection: links});
    $("#shorten").hide();
    $('.search').slideDown();
    this.$el.find('.search').html( searchView.render().el );
    this.updateNav('index');
  },

  renderMyLinksView: function(e){
    e && e.preventDefault();
    var links = new Shortly.Links();
    var linksView = new Shortly.MyLinksView( {collection: links} );
    this.$el.find('#container').html( linksView.render() );
    // var searchView = new Shortly.SearchView( {collection: links});
    $('.search').hide();
    $('#shorten').hide();
    // this.$el.find('.search').html( searchView.render().el );
    this.updateNav('myLinks');
  },

  shortenUrl: function(e){
    e.preventDefault();
    this.startSpinner();
    var $form = $('input[name=url]');
    var link = new Shortly.Link( {url: $form.val()} )
    link.on('sync',    this.success,      this );
    link.on('error',   this.failure,      this );
    $form.val('');
    link.save();
  },

  success: function(link){
    this.stopSpinner();
    console.log(link);
    var view = new Shortly.LinkView( {model: link} );
    $('#container').prepend(view.render().$el.hide().fadeIn());
  },

  failure: function(){
    this.stopSpinner();
    $('.message').html("Please enter a valid URL").addClass('error');
  },

  startSpinner: function(){
    $('img.spinner').show();
    $('#shorten input[type=submit]').attr('disabled', "true");
    $('.message').html("").removeClass('error');
  },

  stopSpinner: function(){
    $('img.spinner').fadeOut('fast');
    $('#shorten input[type=submit]').attr('disabled', null);
    $('.message').html("").removeClass('error');
  },

  showLink: function(e) {
    e.preventDefault();
    $("#container").empty();
    $(".search").hide();
    $("#shorten").slideDown();
    this.updateNav('addLink');
  },

  updateNav: function(className){
    this.$el.find('.navigation li a')
            .removeClass('selected')
            .filter('.'+className)
            .addClass('selected');
  }

  // login: function() {
  //   $(".login").remove();
  //   $(".nav").append("<li><a href='/logout' class='logout'>Log Out</a></li>");
  // }

  // logout: function() {
  //   this.user = null;
  // }

});