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

  render: function (previousQuery, nodeData) {
    let self = this;
    let temp = _.template($("#shortestPath-settings-template").html());
    self.template = temp(this.currentQueryProperties);
    $("#" + previousQuery + "-query-table").hide();
    $(self.el).html(self.template);
    fillNodesFunc("shortestPath", nodeData);
    $(self.el).show();

    $(document).off("click", "#shortestPath-save-query").on("click", "#shortestPath-save-query", function (evt) {
      self.currentQueryProperties.sourceNodes = [document.getElementById("sourceNodesSP").value];
      self.currentQueryProperties.targetNodes = [document.getElementById("targetNodesSP").value];
      self.currentQueryProperties.sourceColor = document.getElementById("sourceColorSP").value;
      self.currentQueryProperties.targetColor = document.getElementById("targetColorSP").value;
      self.currentQueryProperties.pathColor = document.getElementById("pathColorSP").value;
      self.currentQueryProperties.highlightWidth = Number(document.getElementById("highlightWidthSP").value);
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

let kNeighborhoodQuery = Backbone.View.extend({
  defaultQueryProperties: {
    query: "kNeighborhood",
    sourceNodes: [],
    limit: 1,
    direction: "bothstream",
    sourceColor: "#00ff00",
    pathColor: "#ffff00",
    highlightWidth: 10
  },
  currentQueryProperties: null,
  initialize: function () {
    let self = this;
    self.copyProperties();
    let temp = _.template($("#kNeighborhood-settings-template").html());
    self.template = temp(this.currentQueryProperties);
  },
  copyProperties: function () {
    this.currentQueryProperties = _.clone(this.defaultQueryProperties);
  },
  getProperties: function () {
    return this.currentQueryProperties;
  },  

  render: function (previousQuery, nodeData) {
    let self = this;
    let temp = _.template($("#kNeighborhood-settings-template").html());
    self.template = temp(this.currentQueryProperties);
    $("#" + previousQuery + "-query-table").hide();
    $(self.el).html(self.template);
    fillNodesFunc("kNeighborhood", nodeData);
    $(self.el).show();

    $(document).off("click", "#kNeighborhood-save-query").on("click", "#kNeighborhood-save-query", function (evt) {
      self.currentQueryProperties.sourceNodes = $("#sourceNodesKN").dropdown("get value");
      self.currentQueryProperties.direction = document.getElementById("directionKN").value;
      self.currentQueryProperties.limit = Number(document.getElementById("limitKN").value);
      self.currentQueryProperties.sourceColor = document.getElementById("sourceColorKN").value;
      self.currentQueryProperties.pathColor = document.getElementById("pathColorKN").value;
      self.currentQueryProperties.highlightWidth = Number(document.getElementById("highlightWidthKN").value);
    });
    
    $(document).off("click", "#kNeighborhood-default-query").on("click", "#kNeighborhood-default-query", function (evt) {
      self.copyProperties();
      let temp = _.template($("#kNeighborhood-settings-template").html());
      self.template = temp(self.currentQueryProperties);
      $(self.el).html(self.template);
      fillNodesFunc("kNeighborhood", nodeData);
    });

    return this;
  }
});

let commonStreamQuery = Backbone.View.extend({
  defaultQueryProperties: {
    query: "commonStream",
    sourceNodes: [],
    limit: 1,
    direction: "bothstream",
    sourceColor: "#00ff00",
    targetColor: "#ff0000",
    pathColor: "#ffff00",
    highlightWidth: 10
  },
  currentQueryProperties: null,
  initialize: function () {
    let self = this;
    self.copyProperties();
    let temp = _.template($("#commonStream-settings-template").html());
    self.template = temp(this.currentQueryProperties);
  },
  copyProperties: function () {
    this.currentQueryProperties = _.clone(this.defaultQueryProperties);
  },
  getProperties: function () {
    return this.currentQueryProperties;
  },  

  render: function (previousQuery, nodeData) {
    let self = this;
    let temp = _.template($("#commonStream-settings-template").html());
    self.template = temp(this.currentQueryProperties);
    $("#" + previousQuery + "-query-table").hide();
    $(self.el).html(self.template);
    fillNodesFunc("commonStream", nodeData);
    $(self.el).show();

    $(document).off("click", "#commonStream-save-query").on("click", "#commonStream-save-query", function (evt) {
      self.currentQueryProperties.sourceNodes = $("#sourceNodesCS").dropdown("get value");
      self.currentQueryProperties.direction = document.getElementById("directionCS").value;
      self.currentQueryProperties.limit = Number(document.getElementById("limitCS").value);
      self.currentQueryProperties.sourceColor = document.getElementById("sourceColorCS").value;
      self.currentQueryProperties.targetColor = document.getElementById("targetColorCS").value;      
      self.currentQueryProperties.pathColor = document.getElementById("pathColorCS").value;
      self.currentQueryProperties.highlightWidth = Number(document.getElementById("highlightWidthCS").value);
    });
    
    $(document).off("click", "#commonStream-default-query").on("click", "#commonStream-default-query", function (evt) {
      self.copyProperties();
      let temp = _.template($("#commonStream-settings-template").html());
      self.template = temp(self.currentQueryProperties);
      $(self.el).html(self.template);
      fillNodesFunc("commonStream", nodeData);
    });

    return this;
  }
});

let pathsBetweenQuery = Backbone.View.extend({
  defaultQueryProperties: {
    query: "pathsBetween",
    sourceNodes: [],
    limit: 1,
    direction: "bothstream",
    sourceColor: "#00ff00",
    pathColor: "#ffff00",
    highlightWidth: 10
  },
  currentQueryProperties: null,
  initialize: function () {
    let self = this;
    self.copyProperties();
    let temp = _.template($("#pathsBetween-settings-template").html());
    self.template = temp(this.currentQueryProperties);
  },
  copyProperties: function () {
    this.currentQueryProperties = _.clone(this.defaultQueryProperties);
  },
  getProperties: function () {
    return this.currentQueryProperties;
  },  

  render: function (previousQuery, nodeData) {
    let self = this;
    let temp = _.template($("#pathsBetween-settings-template").html());
    self.template = temp(this.currentQueryProperties);
    $("#" + previousQuery + "-query-table").hide();
    $(self.el).html(self.template);
    fillNodesFunc("pathsBetween", nodeData);
    $(self.el).show();

    $(document).off("click", "#pathsBetween-save-query").on("click", "#pathsBetween-save-query", function (evt) {
      self.currentQueryProperties.sourceNodes = $("#sourceNodesPB").dropdown("get value");
      self.currentQueryProperties.direction = document.getElementById("directionPB").value;
      self.currentQueryProperties.limit = Number(document.getElementById("limitPB").value);
      self.currentQueryProperties.sourceColor = document.getElementById("sourceColorPB").value;
      self.currentQueryProperties.pathColor = document.getElementById("pathColorPB").value;
      self.currentQueryProperties.highlightWidth = Number(document.getElementById("highlightWidthPB").value);
    });
    
    $(document).off("click", "#pathsBetween-default-query").on("click", "#pathsBetween-default-query", function (evt) {
      self.copyProperties();
      let temp = _.template($("#pathsBetween-settings-template").html());
      self.template = temp(self.currentQueryProperties);
      $(self.el).html(self.template);
      fillNodesFunc("pathsBetween", nodeData);
    });

    return this;
  }
});

let pathsFromToQuery = Backbone.View.extend({
  defaultQueryProperties: {
    query: "pathsFromTo",
    sourceNodes: [],
    targetNodes: [],
    limit: 1,
    direction: "bothstream",
    sourceColor: "#00ff00",
    targetColor: "#ff0000",
    pathColor: "#ffff00",
    highlightWidth: 10
  },
  currentQueryProperties: null,
  initialize: function () {
    let self = this;
    self.copyProperties();
    let temp = _.template($("#pathsFromTo-settings-template").html());
    self.template = temp(this.currentQueryProperties);
  },
  copyProperties: function () {
    this.currentQueryProperties = _.clone(this.defaultQueryProperties);
  },
  getProperties: function () {
    return this.currentQueryProperties;
  },  

  render: function (previousQuery, nodeData) {
    let self = this;
    let temp = _.template($("#pathsFromTo-settings-template").html());
    self.template = temp(this.currentQueryProperties);
    $("#" + previousQuery + "-query-table").hide();
    $(self.el).html(self.template);
    fillNodesFunc("pathsFromTo", nodeData);
    $(self.el).show();

    $(document).off("click", "#pathsFromTo-save-query").on("click", "#pathsFromTo-save-query", function (evt) {
      self.currentQueryProperties.sourceNodes = $("#sourceNodesPFT").dropdown("get value");
      self.currentQueryProperties.targetNodes = $("#targetNodesPFT").dropdown("get value");
      self.currentQueryProperties.direction = document.getElementById("directionPFT").value;
      self.currentQueryProperties.limit = Number(document.getElementById("limitPFT").value);
      self.currentQueryProperties.sourceColor = document.getElementById("sourceColorPFT").value;
      self.currentQueryProperties.targetColor = document.getElementById("targetColorPFT").value;
      self.currentQueryProperties.pathColor = document.getElementById("pathColorPFT").value;
      self.currentQueryProperties.highlightWidth = Number(document.getElementById("highlightWidthPFT").value);
    });
    
    $(document).off("click", "#pathsFromTo-default-query").on("click", "#pathsFromTo-default-query", function (evt) {
      self.copyProperties();
      let temp = _.template($("#pathsFromTo-settings-template").html());
      self.template = temp(self.currentQueryProperties);
      $(self.el).html(self.template);
      fillNodesFunc("pathsFromTo", nodeData);
    });

    return this;
  }
});

let fillNodesFunc = function(queryType, nodeData){
  if(queryType == "shortestPath") {
    let sourceList = document.getElementById('sourceNodesSP');
    for (const [key, value] of Object.entries(nodeData)) {
      sourceList.innerHTML += '<option value="' + key + '" title="' + value + ' (' + key + ')' + '">'+ (value.length > 10 ? (value.substring(0, 10) + "...") : value) + " (" + (key.length > 10 ? (key.substring(0, 10) + "...") : key) + ')' + '</option>';
    }
    let targetList = document.getElementById('targetNodesSP');
    for (const [key, value] of Object.entries(nodeData)) {
      targetList.innerHTML += '<option value="' + key + '" title="' + value + ' (' + key + ')' + '">'+ (value.length > 10 ? (value.substring(0, 10) + "...") : value) + " (" + (key.length > 10 ? (key.substring(0, 10) + "...") : key) + ')' + '</option>';
    }
  }
  else if(queryType == "kNeighborhood") {
    let sourceList = document.getElementById('sourceNodesKN');
    let sourceTitleArray = [];
    if(sourceList.innerHTML !== "") {
      sourceList.innerHTML = "";
    }
    sourceList.innerHTML += '<option value="">Select Nodes</option>';
    for (const [key, value] of Object.entries(nodeData)) {
      sourceList.innerHTML += '<option value="' + key + '" title="' + value + ' (' + key + ')' + '">'+ (value.length > 10 ? (value.substring(0, 10) + "...") : value) + " (" + (key.length > 10 ? (key.substring(0, 10) + "...") : key) + ')' + '</option>';
      sourceTitleArray.push(value + ' (' + key + ')');
    }
    $('#sourceNodesKN').dropdown();
    $('#sourceNodesKN').parent().children('.menu').children().each(function (index, element) {
      $(element).attr({"title": sourceTitleArray[index]});
    });
  }
  else if(queryType == "commonStream") {
    let sourceList = document.getElementById('sourceNodesCS');
    let sourceTitleArray = [];
    if(sourceList.innerHTML !== "") {
      sourceList.innerHTML = "";
    }
    sourceList.innerHTML += '<option value="">Select Nodes</option>';
    for (const [key, value] of Object.entries(nodeData)) {
      sourceList.innerHTML += '<option value="' + key + '" title="' + value + ' (' + key + ')' + '">'+ (value.length > 10 ? (value.substring(0, 10) + "...") : value) + " (" + (key.length > 10 ? (key.substring(0, 10) + "...") : key) + ')' + '</option>';
      sourceTitleArray.push(value + ' (' + key + ')');
    }
    $('#sourceNodesCS').dropdown();
    $('#sourceNodesCS').parent().children('.menu').children().each(function (index, element) {
      $(element).attr({"title": sourceTitleArray[index]});
    }); 
  }
  else if(queryType == "pathsBetween") {
    let sourceList = document.getElementById('sourceNodesPB');
    let sourceTitleArray = [];
    if(sourceList.innerHTML !== "") {
      sourceList.innerHTML = "";
    }
    sourceList.innerHTML += '<option value="">Select Nodes</option>';
    for (const [key, value] of Object.entries(nodeData)) {
      sourceList.innerHTML += '<option value="' + key + '" title="' + value + ' (' + key + ')' + '">'+ (value.length > 10 ? (value.substring(0, 10) + "...") : value) + " (" + (key.length > 10 ? (key.substring(0, 10) + "...") : key) + ')' + '</option>';
      sourceTitleArray.push(value + ' (' + key + ')');
    }
    $('#sourceNodesPB').dropdown();
    $('#sourceNodesPB').parent().children('.menu').children().each(function (index, element) {
      $(element).attr({"title": sourceTitleArray[index]});
    });
  }
  else if(queryType == "pathsFromTo") {
    let sourceList = document.getElementById('sourceNodesPFT');
    let sourceTitleArray = [];
    if(sourceList.innerHTML !== "") {
      sourceList.innerHTML = "";
    }
    sourceList.innerHTML += '<option value="">Select Nodes</option>';
    for (const [key, value] of Object.entries(nodeData)) {
      sourceList.innerHTML += '<option value="' + key + '" title="' + value + ' (' + key + ')' + '">'+ (value.length > 10 ? (value.substring(0, 10) + "...") : value) + " (" + (key.length > 10 ? (key.substring(0, 10) + "...") : key) + ')' + '</option>';
      sourceTitleArray.push(value + ' (' + key + ')');
    }
    $('#sourceNodesPFT').dropdown();
    $('#sourceNodesPFT').parent().children('.menu').children().each(function (index, element) {
      $(element).attr({"title": sourceTitleArray[index]});
    });

    let targetList = document.getElementById('targetNodesPFT');
    let targetTitleArray = [];
    if(targetList.innerHTML !== "") {
      targetList.innerHTML = "";
    }
    targetList.innerHTML += '<option value="">Select Nodes</option>';
    for (const [key, value] of Object.entries(nodeData)) {
      targetList.innerHTML += '<option value="' + key + '" title="' + value + ' (' + key + ')' + '">'+ (value.length > 10 ? (value.substring(0, 10) + "...") : value) + " (" + (key.length > 10 ? (key.substring(0, 10) + "...") : key) + ')' + '</option>';
      targetTitleArray.push(value + ' (' + key + ')');
    }
    $('#targetNodesPFT').dropdown();
    $('#targetNodesPFT').parent().children('.menu').children().each(function (index, element) {
      $(element).attr({"title": targetTitleArray[index]});
    });
  }
}