let shortestPathQuery = Backbone.View.extend({
  defaultQueryProperties: {
    query: "shortestPath",
    sourceNodes: [],
    targetNodes: [],
    sourceColor: "#00ff00",
    targetColor: "#ff0000",
    pathColor: "#ffff00",
    highlightWidth: 10
  },
  currentQueryProperties: null,
  initialize: function () {
    let self = this;
    self.copyProperties();
    let temp = _.template($("#shortestPath-settings-template").html());
    self.template = temp(this.currentQueryProperties);
  },
  copyProperties: function () {
    this.currentQueryProperties = _.clone(this.defaultQueryProperties);
  },
  getProperties: function () {
    return this.currentQueryProperties;
  },  
/*   applyLayout: async function () {
    await applyLayoutFunction(this);
  }, */
  render: function (previousQuery, nodeData) {
    let self = this;
    let temp = _.template($("#shortestPath-settings-template").html());
    self.template = temp(this.currentQueryProperties);
    $("#" + previousQuery + "-query-table").hide();
    $(self.el).html(self.template);
    fillNodesFunc("shortestPath", nodeData);
    $(self.el).show();

    $(document).off("click", "#shortestPath-save-query").on("click", "#shortestPath-save-query", function (evt) {
      self.currentQueryProperties.sourceNodes = [document.getElementById("sourceNodes").value];
      self.currentQueryProperties.targetNodes = [document.getElementById("targetNodes").value];
      self.currentQueryProperties.sourceColor = document.getElementById("sourceColor1").value;
      self.currentQueryProperties.targetColor = document.getElementById("targetColor1").value;
      self.currentQueryProperties.pathColor = document.getElementById("pathColor1").value;
      self.currentQueryProperties.highlightWidth = Number(document.getElementById("highlightWidth1").value);
    });
    
    $(document).off("click", "#shortestPath-default-query").on("click", "#shortestPath-default-query", function (evt) {
      self.copyProperties();
      let temp = _.template($("#shortestPath-settings-template").html());
      self.template = temp(self.currentQueryProperties);
      $(self.el).html(self.template);
      fillNodesFunc("shortestPath", nodeData);
    });

    return this;
  }
});

let fillNodesFunc = function(queryType, nodeData){
  if(queryType == "shortestPath") {
    let sourceList = document.getElementById('sourceNodes');
    for (const [key, value] of Object.entries(nodeData)) {
      sourceList.innerHTML += '<option value="' + key + '">'+ value + " (" + key + ')' + '</option>';
    }
    let targetList = document.getElementById('targetNodes');
    for (const [key, value] of Object.entries(nodeData)) {
      targetList.innerHTML += '<option value="' + key + '">'+ value + " (" + key + ')' + '</option>';
    }
  }
}