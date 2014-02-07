Shortly.ClicksView = Backbone.View.extend({

  className: 'clicks',

  initialize: function(options){
    this.collection.graphData = {};
    this.collection.realData = [];
    this.collection.displayData = {};
    this.collection.on('sync', this.groupData, this);
    this.collection.fetch({data: {id: options.id}});
  },

  groupData: function() {
    this.collection.forEach(this.group, this);

    _.each(this.collection.graphData, function(value, key) {
      this.collection.realData.push({x: parseInt(key), y: value});
    }, this);

    this.collection.displayData["values"] = this.collection.realData.slice();
    this.collection.displayData["color"] = "#000";
    this.render();
  },

  group: function(item) {
    var original = new Date(this.collection.at(0).get('created_at'));
    var current = new Date(item.get('created_at'));
    var timeElapsed = (current - original) / 1000 / 60;
    var grouping = Math.ceil(timeElapsed / 5);
    var graph = this.collection.graphData;

    (graph[grouping]) ? graph[grouping]++ : graph[grouping] = 1;
    this.collection.graphData = graph;
  },

  render: function() {
    $("#container").empty();
    d3.select("#container").append("div").attr("id", "chart").append("svg")
      .attr("height", "500px").attr("width", "500px");
    this.collection.displayData = [this.collection.displayData];

    var that = this;
    nv.addGraph(function() {
      var chart = nv.models.lineChart();
      chart.xAxis
          .axisLabel('Time (minutes)')
          .tickFormat(d3.format(',r'));
      chart.yAxis
          .axisLabel('Clicks')
          .tickFormat(d3.format('d'));
      d3.select('#chart svg')
          .datum(that.collection.displayData)
        .transition().duration(500)
          .call(chart);
      nv.utils.windowResize(function() { d3.select('#chart svg').call(chart) });
      return chart;
    });
  }
});