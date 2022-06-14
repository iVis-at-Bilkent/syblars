let degreeCentralityQuery = Backbone.View.extend({
  defaultQueryProperties: {
    query: "degreeCentrality",
    cropToResult: false,
    direction: "DIRECTED",
    highlight: true,
    highlightColor: "#00ff00"
  },
  currentQueryProperties: null,
  initialize: function () {
    let self = this;
    self.copyProperties();
    let temp = _.template($("#degreeCentrality-settings-template").html());
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
    let temp = _.template($("#degreeCentrality-settings-template").html());
    self.template = temp(this.currentQueryProperties);
    $("#" + previousQuery + "-query-table").hide();
    $(self.el).html(self.template);
    fillNodesFunc("degreeCentrality", nodeData);
    document.getElementById("directionDC").value = self.currentQueryProperties.direction;
    document.getElementById("highlightColorDC").disabled = self.currentQueryProperties.highlightColorDisabled;
    $(self.el).show();

    $(document).off("change", "#highlightDC").on("change", "#highlightDC", function() {
      if(this.checked) {
        $("#highlightColorDC").attr("disabled", false);
      }
      else {
        $("#highlightColorDC").attr("disabled", true);
      }
    }); 

    $(document).off("click", "#degreeCentrality-save-query").on("click", "#degreeCentrality-save-query", function (evt) {
      self.currentQueryProperties.direction = document.getElementById("directionDC").value;
      self.currentQueryProperties.highlight = document.getElementById("highlightDC").checked;
      self.currentQueryProperties.highlightColor = document.getElementById("highlightColorDC").value;
      self.currentQueryProperties.highlightColorDisabled = document.getElementById("highlightColorDC").disabled;
      self.currentQueryProperties.cropToResult = document.getElementById("cropToResult").checked;
    });
    
    $(document).off("click", "#degreeCentrality-default-query").on("click", "#degreeCentrality-default-query", function (evt) {
      self.copyProperties();
      let temp = _.template($("#degreeCentrality-settings-template").html());
      self.template = temp(self.currentQueryProperties);
      $(self.el).html(self.template);
      fillNodesFunc("degreeCentrality", nodeData);
      document.getElementById("cropToResult").checked = false;
    });

    return this;
  }
});

let closenessCentralityQuery = Backbone.View.extend({
  defaultQueryProperties: {
    query: "closenessCentrality",
    cropToResult: false,
    direction: "DIRECTED",
    highlight: true,
    highlightColor: "#00ff00"
  },
  currentQueryProperties: null,
  initialize: function () {
    let self = this;
    self.copyProperties();
    let temp = _.template($("#closenessCentrality-settings-template").html());
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
    let temp = _.template($("#closenessCentrality-settings-template").html());
    self.template = temp(this.currentQueryProperties);
    $("#" + previousQuery + "-query-table").hide();
    $(self.el).html(self.template);
    fillNodesFunc("closenessCentrality", nodeData);
    document.getElementById("directionCC").value = self.currentQueryProperties.direction;
    document.getElementById("highlightColorCC").disabled = self.currentQueryProperties.highlightColorDisabled;
    $(self.el).show();

    $(document).off("change", "#highlightCC").on("change", "#highlightCC", function() {
      if(this.checked) {
        $("#highlightColorCC").attr("disabled", false);
      }
      else {
        $("#highlightColorCC").attr("disabled", true);
      }
    });

    $(document).off("click", "#closenessCentrality-save-query").on("click", "#closenessCentrality-save-query", function (evt) {
      self.currentQueryProperties.direction = document.getElementById("directionCC").value;
      self.currentQueryProperties.highlight = document.getElementById("highlightCC").checked;      
      self.currentQueryProperties.highlightColor = document.getElementById("highlightColorCC").value;
      self.currentQueryProperties.highlightColorDisabled = document.getElementById("highlightColorCC").disabled;
      self.currentQueryProperties.cropToResult = document.getElementById("cropToResult").checked;
    });
    
    $(document).off("click", "#closenessCentrality-default-query").on("click", "#closenessCentrality-default-query", function (evt) {
      self.copyProperties();
      let temp = _.template($("#closenessCentrality-settings-template").html());
      self.template = temp(self.currentQueryProperties);
      $(self.el).html(self.template);
      fillNodesFunc("closenessCentrality", nodeData);
      document.getElementById("cropToResult").checked = false;
    });

    return this;
  }
});

let betweennessCentralityQuery = Backbone.View.extend({
  defaultQueryProperties: {
    query: "betweennessCentrality",
    cropToResult: false,
    direction: "DIRECTED",
    highlight: true,
    highlightColor: "#00ff00"
  },
  currentQueryProperties: null,
  initialize: function () {
    let self = this;
    self.copyProperties();
    let temp = _.template($("#betweennessCentrality-settings-template").html());
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
    let temp = _.template($("#betweennessCentrality-settings-template").html());
    self.template = temp(this.currentQueryProperties);
    $("#" + previousQuery + "-query-table").hide();
    $(self.el).html(self.template);
    fillNodesFunc("betweennessCentrality", nodeData);
    document.getElementById("directionBC").value = self.currentQueryProperties.direction;
    document.getElementById("highlightColorBC").disabled = self.currentQueryProperties.highlightColorDisabled;
    $(self.el).show();

    $(document).off("change", "#highlightBC").on("change", "#highlightBC", function() {
      if(this.checked) {
        $("#highlightColorBC").attr("disabled", false);
      }
      else {
        $("#highlightColorBC").attr("disabled", true);
      }
    });

    $(document).off("click", "#betweennessCentrality-save-query").on("click", "#betweennessCentrality-save-query", function (evt) {
      self.currentQueryProperties.direction = document.getElementById("directionBC").value;
      self.currentQueryProperties.highlight = document.getElementById("highlightBC").checked;
      self.currentQueryProperties.highlightColor = document.getElementById("highlightColorBC").value;
      self.currentQueryProperties.highlightColorDisabled = document.getElementById("highlightColorBC").disabled;
      self.currentQueryProperties.cropToResult = document.getElementById("cropToResult").checked;
    });
    
    $(document).off("click", "#betweennessCentrality-default-query").on("click", "#betweennessCentrality-default-query", function (evt) {
      self.copyProperties();
      let temp = _.template($("#betweennessCentrality-settings-template").html());
      self.template = temp(self.currentQueryProperties);
      $(self.el).html(self.template);
      fillNodesFunc("betweennessCentrality", nodeData);
      document.getElementById("cropToResult").checked = false;
    });

    return this;
  }
});

let pageRankQuery = Backbone.View.extend({
  defaultQueryProperties: {
    query: "pageRank",
    cropToResult: false,
    highlight: true,
    highlightColor: "#00ff00"
  },
  currentQueryProperties: null,
  initialize: function () {
    let self = this;
    self.copyProperties();
    let temp = _.template($("#pageRank-settings-template").html());
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
    let temp = _.template($("#pageRank-settings-template").html());
    self.template = temp(this.currentQueryProperties);
    $("#" + previousQuery + "-query-table").hide();
    $(self.el).html(self.template);
    fillNodesFunc("pageRank", nodeData);
    document.getElementById("highlightColorPR").disabled = self.currentQueryProperties.highlightColorDisabled;
    $(self.el).show();

    $(document).off("change", "#highlightBPR").on("change", "#highlightPR", function() {
      if(this.checked) {
        $("#highlightColorPR").attr("disabled", false);
      }
      else {
        $("#highlightColorPR").attr("disabled", true);
      }
    });

    $(document).off("click", "#pageRank-save-query").on("click", "#pageRank-save-query", function (evt) {
      self.currentQueryProperties.highlight = document.getElementById("highlightPR").checked;      
      self.currentQueryProperties.highlightColor = document.getElementById("highlightColorPR").value;
      self.currentQueryProperties.highlightColorDisabled = document.getElementById("highlightColorPR").disabled;
      self.currentQueryProperties.cropToResult = document.getElementById("cropToResult").checked;
    });
    
    $(document).off("click", "#pageRank-default-query").on("click", "#pageRank-default-query", function (evt) {
      self.copyProperties();
      let temp = _.template($("#pageRank-settings-template").html());
      self.template = temp(self.currentQueryProperties);
      $(self.el).html(self.template);
      fillNodesFunc("pageRank", nodeData);
      document.getElementById("cropToResult").checked = false;
    });

    return this;
  }
});

let shortestPathQuery = Backbone.View.extend({
  defaultQueryProperties: {
    query: "shortestPath",
    cropToResult: false,
    sourceNodes: [],
    targetNodes: [],
    direction: "DIRECTED",
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
    document.getElementById("directionSP").value = self.currentQueryProperties.direction;
    $(self.el).show();

    $(document).off("click", "#shortestPath-save-query").on("click", "#shortestPath-save-query", function (evt) {
      self.currentQueryProperties.sourceNodes = [document.getElementById("sourceNodesSP").value];
      self.currentQueryProperties.targetNodes = [document.getElementById("targetNodesSP").value];
      self.currentQueryProperties.direction = document.getElementById("directionSP").value;
      self.currentQueryProperties.sourceColor = document.getElementById("sourceColorSP").value;
      self.currentQueryProperties.targetColor = document.getElementById("targetColorSP").value;
      self.currentQueryProperties.pathColor = document.getElementById("pathColorSP").value;
      self.currentQueryProperties.highlightWidth = Number(document.getElementById("highlightWidthSP").value);
      self.currentQueryProperties.cropToResult = document.getElementById("cropToResult").checked;
    });
    
    $(document).off("click", "#shortestPath-default-query").on("click", "#shortestPath-default-query", function (evt) {
      self.copyProperties();
      let temp = _.template($("#shortestPath-settings-template").html());
      self.template = temp(self.currentQueryProperties);
      $(self.el).html(self.template);
      fillNodesFunc("shortestPath", nodeData);
      document.getElementById("cropToResult").checked = false;
    });

    return this;
  }
});

let kNeighborhoodQuery = Backbone.View.extend({
  defaultQueryProperties: {
    query: "kNeighborhood",
    cropToResult: false,
    sourceNodes: [],
    limit: 1,
    direction: "BOTHSTREAM",
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
    document.getElementById("directionKN").value = self.currentQueryProperties.direction;
    $(self.el).show();

    $(document).off("click", "#kNeighborhood-save-query").on("click", "#kNeighborhood-save-query", function (evt) {
      self.currentQueryProperties.sourceNodes = $("#sourceNodesKN").dropdown("get value");
      self.currentQueryProperties.direction = document.getElementById("directionKN").value;
      self.currentQueryProperties.limit = Number(document.getElementById("limitKN").value);
      self.currentQueryProperties.sourceColor = document.getElementById("sourceColorKN").value;
      self.currentQueryProperties.pathColor = document.getElementById("pathColorKN").value;
      self.currentQueryProperties.highlightWidth = Number(document.getElementById("highlightWidthKN").value);
      self.currentQueryProperties.cropToResult = document.getElementById("cropToResult").checked;
    });
    
    $(document).off("click", "#kNeighborhood-default-query").on("click", "#kNeighborhood-default-query", function (evt) {
      self.copyProperties();
      let temp = _.template($("#kNeighborhood-settings-template").html());
      self.template = temp(self.currentQueryProperties);
      $(self.el).html(self.template);
      fillNodesFunc("kNeighborhood", nodeData);
      document.getElementById("cropToResult").checked = false;
    });

    return this;
  }
});

let commonStreamQuery = Backbone.View.extend({
  defaultQueryProperties: {
    query: "commonStream",
    cropToResult: false,
    sourceNodes: [],
    limit: 1,
    direction: "BOTHSTREAM",
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
    document.getElementById("directionCS").value = self.currentQueryProperties.direction;
    $(self.el).show();

    $(document).off("click", "#commonStream-save-query").on("click", "#commonStream-save-query", function (evt) {
      self.currentQueryProperties.sourceNodes = $("#sourceNodesCS").dropdown("get value");
      self.currentQueryProperties.direction = document.getElementById("directionCS").value;
      self.currentQueryProperties.limit = Number(document.getElementById("limitCS").value);
      self.currentQueryProperties.sourceColor = document.getElementById("sourceColorCS").value;
      self.currentQueryProperties.targetColor = document.getElementById("targetColorCS").value;      
      self.currentQueryProperties.pathColor = document.getElementById("pathColorCS").value;
      self.currentQueryProperties.highlightWidth = Number(document.getElementById("highlightWidthCS").value);
      self.currentQueryProperties.cropToResult = document.getElementById("cropToResult").checked;
    });
    
    $(document).off("click", "#commonStream-default-query").on("click", "#commonStream-default-query", function (evt) {
      self.copyProperties();
      let temp = _.template($("#commonStream-settings-template").html());
      self.template = temp(self.currentQueryProperties);
      $(self.el).html(self.template);
      fillNodesFunc("commonStream", nodeData);
      document.getElementById("cropToResult").checked = false;
    });

    return this;
  }
});

let pathsBetweenQuery = Backbone.View.extend({
  defaultQueryProperties: {
    query: "pathsBetween",
    cropToResult: false,
    sourceNodes: [],
    limit: 1,
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
      self.currentQueryProperties.limit = Number(document.getElementById("limitPB").value);
      self.currentQueryProperties.sourceColor = document.getElementById("sourceColorPB").value;
      self.currentQueryProperties.pathColor = document.getElementById("pathColorPB").value;
      self.currentQueryProperties.highlightWidth = Number(document.getElementById("highlightWidthPB").value);
      self.currentQueryProperties.cropToResult = document.getElementById("cropToResult").checked;
    });
    
    $(document).off("click", "#pathsBetween-default-query").on("click", "#pathsBetween-default-query", function (evt) {
      self.copyProperties();
      let temp = _.template($("#pathsBetween-settings-template").html());
      self.template = temp(self.currentQueryProperties);
      $(self.el).html(self.template);
      fillNodesFunc("pathsBetween", nodeData);
      document.getElementById("cropToResult").checked = false;
    });

    return this;
  }
});

let pathsFromToQuery = Backbone.View.extend({
  defaultQueryProperties: {
    query: "pathsFromTo",
    cropToResult: false,
    sourceNodes: [],
    targetNodes: [],
    limit: 1,
    furtherDistance: 1,
    direction: "DIRECTED",
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
    document.getElementById("directionPFT").value = self.currentQueryProperties.direction;
    $(self.el).show();

    $(document).off("click", "#pathsFromTo-save-query").on("click", "#pathsFromTo-save-query", function (evt) {
      self.currentQueryProperties.sourceNodes = $("#sourceNodesPFT").dropdown("get value");
      self.currentQueryProperties.targetNodes = $("#targetNodesPFT").dropdown("get value");
      self.currentQueryProperties.direction = document.getElementById("directionPFT").value;
      self.currentQueryProperties.limit = Number(document.getElementById("limitPFT").value);
      self.currentQueryProperties.furtherDistance = Number(document.getElementById("furtherDistancePFT").value);
      self.currentQueryProperties.sourceColor = document.getElementById("sourceColorPFT").value;
      self.currentQueryProperties.targetColor = document.getElementById("targetColorPFT").value;
      self.currentQueryProperties.pathColor = document.getElementById("pathColorPFT").value;
      self.currentQueryProperties.highlightWidth = Number(document.getElementById("highlightWidthPFT").value);
      self.currentQueryProperties.cropToResult = document.getElementById("cropToResult").checked;
    });
    
    $(document).off("click", "#pathsFromTo-default-query").on("click", "#pathsFromTo-default-query", function (evt) {
      self.copyProperties();
      let temp = _.template($("#pathsFromTo-settings-template").html());
      self.template = temp(self.currentQueryProperties);
      $(self.el).html(self.template);
      fillNodesFunc("pathsFromTo", nodeData);
      document.getElementById("cropToResult").checked = false;
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