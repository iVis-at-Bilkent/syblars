let FCOSELayout = Backbone.View.extend({
  defaultLayoutProperties: {
    name: "fcose",
    randomize: true,
    padding: 30,
    nodeDimensionsIncludeLabels: true,
    uniformNodeDimensions: false,
    packComponents: true,
    nodeRepulsion: 4500,
    idealEdgeLength: 50,
    edgeElasticity: 0.45,
    nestingFactor: 0.1,
    numIter: 2500,
    tile: true,
    tilingPaddingVertical: 10,
    tilingPaddingHorizontal: 10,
    gravity: 0.25,
    gravityRange: 3.8,
    gravityCompound: 1.0,    
    gravityRangeCompound: 1.5,
    initialEnergyOnIncremental: 0.3
  },
  currentLayoutProperties: null,
  initialize: function () {
    let self = this;
    self.copyProperties();
    let temp = _.template($("#fcose-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
  },
  copyProperties: function () {
    this.currentLayoutProperties = _.clone(this.defaultLayoutProperties);
  },
  getProperties: function () {
    return this.currentLayoutProperties;
  },  
  applyLayout: async function () {
    await applyLayoutFunction(this);
  },
  render: function (previousLayout) {
    let self = this;
    let temp = _.template($("#fcose-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
    $("#" + previousLayout + "-layout-table").hide();
    $(self.el).html(self.template);
    $(self.el).show();

    $(document).off("click", "#fcose-save-layout").on("click", "#fcose-save-layout", function (evt) {
      self.currentLayoutProperties.padding = Number(document.getElementById("padding1").value);
      self.currentLayoutProperties.nodeDimensionsIncludeLabels = document.getElementById("nodeDimensionsIncludeLabels1").checked;
      self.currentLayoutProperties.uniformNodeDimensions = document.getElementById("uniformNodeDimensions1").checked;
      self.currentLayoutProperties.packComponents = document.getElementById("packComponents1").checked;
      self.currentLayoutProperties.nodeRepulsion = Number(document.getElementById("nodeRepulsion1").value);
      self.currentLayoutProperties.idealEdgeLength = Number(document.getElementById("idealEdgeLength1").value);
      self.currentLayoutProperties.edgeElasticity = Number(document.getElementById("edgeElasticity1").value);
      self.currentLayoutProperties.nestingFactor = Number(document.getElementById("nestingFactor1").value);
      self.currentLayoutProperties.numIter = Number(document.getElementById("numIter1").value);
      self.currentLayoutProperties.tile = document.getElementById("tile1").checked;
      self.currentLayoutProperties.tilingPaddingVertical = Number(document.getElementById("tilingPaddingVertical1").value);
      self.currentLayoutProperties.tilingPaddingHorizontal = Number(document.getElementById("tilingPaddingHorizontal1").value);      
      self.currentLayoutProperties.gravity = Number(document.getElementById("gravity1").value);
      self.currentLayoutProperties.gravityRange = Number(document.getElementById("gravityRange1").value);
      self.currentLayoutProperties.gravityCompound = Number(document.getElementById("gravityCompound1").value);
      self.currentLayoutProperties.gravityRangeCompound = Number(document.getElementById("gravityRangeCompound1").value);
    });
    
    $(document).off("click", "#fcose-default-layout").on("click", "#fcose-default-layout", function (evt) {
      self.copyProperties();
      let temp = _.template($("#fcose-settings-template").html());
      self.template = temp(self.currentLayoutProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});

let COLALayout = Backbone.View.extend({
  defaultLayoutProperties: {
    name: 'cola',
    animate: false,
    padding: 30, // padding around the simulation
    nodeDimensionsIncludeLabels: true, // whether labels should be included in determining the space used by a node

    // positioning options
    randomize: true, // use random node positions at beginning of layout
    avoidOverlap: true, // if true, prevents overlap of node bounding boxes
    handleDisconnected: true, // if true, avoids disconnected components from overlapping
    convergenceThreshold: 0.01, // when the alpha value (system energy) falls below this value, the layout stops
    nodeSpacing: 10,

    // different methods of specifying edge length
    // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
    edgeLength: 50, // sets edge length directly in simulation
    edgeSymDiffLength: 0, // symmetric diff edge length in simulation
    edgeJaccardLength: 0, // jaccard edge length in simulation

    // iterations of cola algorithm; uses default values on undefined
    unconstrIter: 10, // unconstrained initial layout iterations
    userConstIter: 15, // initial layout iterations with user-specified constraints
    allConstIter: 20, // initial layout iterations with all constraints including non-overlap
  },
  currentLayoutProperties: null,
  initialize: function () {
    let self = this;
    self.copyProperties();
    let temp = _.template($("#cola-settings-template").html());
    self.template = temp(self.currentLayoutProperties);
  },
  copyProperties: function () {
    this.currentLayoutProperties = _.clone(this.defaultLayoutProperties);
  },
  getProperties: function () {
    return this.currentLayoutProperties;
  },   
  applyLayout: async function () {
    await applyLayoutFunction(this);
  },
  render: function (previousLayout) {
    let self = this;
    let temp = _.template($("#cola-settings-template").html());
    self.template = temp(self.currentLayoutProperties);
    $("#" + previousLayout + "-layout-table").hide();
    $(self.el).html(self.template);
    $(self.el).show();

    $(document).off("click", "#cola-save-layout").on("click", "#cola-save-layout", function (evt) {
      self.currentLayoutProperties.padding = Number(document.getElementById("padding2").value);     
      self.currentLayoutProperties.nodeDimensionsIncludeLabels = document.getElementById("nodeDimensionsIncludeLabels2").checked;
      self.currentLayoutProperties.avoidOverlap = document.getElementById("avoidOverlap2").checked;
      self.currentLayoutProperties.handleDisconnected = document.getElementById("handleDisconnected2").checked;
      self.currentLayoutProperties.convergenceThreshold = Number(document.getElementById("convergenceThreshold2").value);
      self.currentLayoutProperties.nodeSpacing = Number(document.getElementById("nodeSpacing2").value);
      self.currentLayoutProperties.edgeLength = Number(document.getElementById("edgeLength2").value);
      self.currentLayoutProperties.edgeSymDiffLength = Number(document.getElementById("edgeSymDiffLength2").value);
      self.currentLayoutProperties.edgeJaccardLength = Number(document.getElementById("edgeJaccardLength2").value);
      self.currentLayoutProperties.unconstrIter = Number(document.getElementById("unconstrIter2").value);
      self.currentLayoutProperties.userConstIter = Number(document.getElementById("userConstIter2").value);
      self.currentLayoutProperties.allConstIter = Number(document.getElementById("allConstIter2").value);
    });
    
    $(document).off("click", "#cola-default-layout").on("click", "#cola-default-layout", function (evt) {
      self.copyProperties();
      let temp = _.template($("#cola-settings-template").html());
      self.template = temp(self.currentLayoutProperties);
      $(self.el).html(self.template);
    });    

    return this;
  }
});

let CISELayout = Backbone.View.extend({
  defaultLayoutProperties: {
    name: "cise",
    clusters: [],
    randomize: true,
    animate: false,
    nodeDimensionsIncludeLabels: true,
    packComponents: true,
    allowNodesInsideCircle: false,    
    padding: 30,
    nodeSeparation: 12.5,
    idealInterClusterEdgeLengthCoefficient: 1.4,
    maxRatioOfNodesInsideCircle: 0.1,
    springCoeff: 0.45,
    nodeRepulsion: 4500,
    gravity: 0.25,
    gravityRange: 3.8
  },
  currentLayoutProperties: null,
  initialize: function () {
    let self = this;
    self.copyProperties();
    let temp = _.template($("#cise-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
  },
  copyProperties: function () {
    this.currentLayoutProperties = _.clone(this.defaultLayoutProperties);
  },
  getProperties: function () {
    return this.currentLayoutProperties;
  },  
  applyLayout: async function () {
    await applyLayoutFunction(this);
  },
  render: function (previousLayout) {
    let self = this;
    let temp = _.template($("#cise-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
    $("#" + previousLayout + "-layout-table").hide();
    $(self.el).html(self.template);
    $(self.el).show();

    $(document).off("click", "#cise-save-layout").on("click", "#cise-save-layout", function (evt) {
      self.currentLayoutProperties.nodeDimensionsIncludeLabels = document.getElementById("nodeDimensionsIncludeLabels3").checked;
      self.currentLayoutProperties.packComponents = document.getElementById("packComponents3").checked;
      self.currentLayoutProperties.allowNodesInsideCircle = document.getElementById("allowNodesInsideCircle3").checked;      
      self.currentLayoutProperties.padding = Number(document.getElementById("padding3").value);
      self.currentLayoutProperties.nodeSeparation = Number(document.getElementById("nodeSeparation3").value);
      self.currentLayoutProperties.idealInterClusterEdgeLengthCoefficient = Number(document.getElementById("idealInterClusterEdgeLengthCoefficient3").value);
      self.currentLayoutProperties.maxRatioOfNodesInsideCircle = Number(document.getElementById("maxRatioOfNodesInsideCircle3").value);
      self.currentLayoutProperties.springCoeff = Number(document.getElementById("springCoeff3").value);
      self.currentLayoutProperties.nodeRepulsion = Number(document.getElementById("nodeRepulsion3").value);
      self.currentLayoutProperties.gravity = Number(document.getElementById("gravity3").value);
      self.currentLayoutProperties.gravityRange = Number(document.getElementById("gravityRange3").value);
    });   

    $(document).off("click", "#cise-default-layout").on("click", "#cise-default-layout", function (evt) {
      self.copyProperties();
      var temp = _.template($("#cise-settings-template").html());
      self.template = temp(self.currentLayoutProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});

let DAGRELayout = Backbone.View.extend({
  defaultLayoutProperties: {
    name: "dagre",
    nodeDimensionsIncludeLabels: true,
    animate: false,
    padding: 30,
    nodeSep: 50,
    edgeSep: 10,
    rankSep: 50,
    edgeWeight: 1,
    rankDir: 'TB'    
  },
  currentLayoutProperties: null,
  initialize: function () {
    let self = this;
    self.copyProperties();
    let temp = _.template($("#dagre-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
  },
  copyProperties: function () {
    this.currentLayoutProperties = _.clone(this.defaultLayoutProperties);
  },
  getProperties: function () {
    return this.currentLayoutProperties;
  },  
  applyLayout: async function () {
    await applyLayoutFunction(this);
  },
  render: function (previousLayout) {
    let self = this;
    let temp = _.template($("#dagre-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
    $("#" + previousLayout + "-layout-table").hide();
    $(self.el).html(self.template);
    $(self.el).show();

    $(document).off("click", "#dagre-save-layout").on("click", "#dagre-save-layout", function (evt) {
      self.currentLayoutProperties.nodeDimensionsIncludeLabels = document.getElementById("nodeDimensionsIncludeLabels4").checked;
      self.currentLayoutProperties.padding = Number(document.getElementById("padding4").value);
      self.currentLayoutProperties.nodeSep = Number(document.getElementById("nodeSep4").value);
      self.currentLayoutProperties.edgeSep = Number(document.getElementById("edgeSep4").value);
      self.currentLayoutProperties.rankSep = Number(document.getElementById("rankSep4").value);
      self.currentLayoutProperties.edgeWeight = Number(document.getElementById("edgeWeight4").value);
    });

    $(document).off("click", "#dagre-default-layout").on("click", "#dagre-default-layout", function (evt) {
      self.copyProperties();
      let temp = _.template($("#dagre-settings-template").html());
      self.template = temp(self.currentLayoutProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});

var KLAYLayout = Backbone.View.extend({
  defaultLayoutProperties: {
    name: "klay",
    animate: false,
    nodeDimensionsIncludeLabels: true,
    padding: 30,
    klay: {
      addUnnecessaryBendpoints: false,
      compactComponents: false,
      feedbackEdges: false,      
      layoutHierarchy: false,
      mergeEdges: false,
      mergeHierarchyCrossingEdges: true,
      routeSelfLoopInside: false,
      separateConnectedComponents: true,      
      aspectRatio: 1.6,
      borderSpacing: 20,
      edgeSpacingFactor: 0.5,      
      inLayerSpacingFactor: 1.0,
      linearSegmentsDeflectionDampening: 0.3,
      randomizationSeed: 1,
      spacing: 20,
      thoroughness: 7
    }
  },
  currentLayoutProperties: null,
  initialize: function () {
    let self = this;
    self.copyProperties();
    let temp = _.template($("#klay-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
  },
  copyProperties: function () {
    this.currentLayoutProperties = _.clone(this.defaultLayoutProperties);
    this.currentLayoutProperties.klay = _.clone(this.defaultLayoutProperties.klay);     
  },
  getProperties: function () {
    return this.currentLayoutProperties;
  },  
  applyLayout: async function () {
    await applyLayoutFunction(this);
  },
  render: function (previousLayout) {
    let self = this;
    let temp = _.template($("#klay-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
    $("#" + previousLayout + "-layout-table").hide();
    $(self.el).html(self.template);
    $(self.el).show();

    $(document).off("click", "#klay-save-layout").on("click", "#klay-save-layout", function (evt) {
      self.currentLayoutProperties.nodeDimensionsIncludeLabels = document.getElementById("nodeDimensionsIncludeLabels5").checked;      
      self.currentLayoutProperties.padding = Number(document.getElementById("padding5").value);
      self.currentLayoutProperties.klay.addUnnecessaryBendpoints = document.getElementById("addUnnecessaryBendpoints5").checked;
      self.currentLayoutProperties.klay.compactComponents = document.getElementById("compactComponents5").checked;
      self.currentLayoutProperties.klay.feedbackEdges = document.getElementById("feedbackEdges5").checked;
      self.currentLayoutProperties.klay.layoutHierarchy = document.getElementById("layoutHierarchy5").checked;
      self.currentLayoutProperties.klay.mergeEdges = document.getElementById("mergeEdges5").checked;
      self.currentLayoutProperties.klay.mergeHierarchyCrossingEdges = document.getElementById("mergeHierarchyCrossingEdges5").checked;
      self.currentLayoutProperties.klay.routeSelfLoopInside = document.getElementById("routeSelfLoopInside5").checked;
      self.currentLayoutProperties.klay.separateConnectedComponents = document.getElementById("separateConnectedComponents5").checked;      
      self.currentLayoutProperties.klay.aspectRatio = Number(document.getElementById("aspectRatio5").value);
      self.currentLayoutProperties.klay.borderSpacing = Number(document.getElementById("borderSpacing5").value);
      self.currentLayoutProperties.klay.edgeSpacingFactor = Number(document.getElementById("edgeSpacingFactor5").value);
      self.currentLayoutProperties.klay.inLayerSpacingFactor = Number(document.getElementById("inLayerSpacingFactor5").value);
      self.currentLayoutProperties.klay.linearSegmentsDeflectionDampening = Number(document.getElementById("linearSegmentsDeflectionDampening5").value);
      self.currentLayoutProperties.klay.randomizationSeed = Number(document.getElementById("randomizationSeed5").value);
      self.currentLayoutProperties.klay.spacing = Number(document.getElementById("spacing5").value);
      self.currentLayoutProperties.klay.thoroughness = Number(document.getElementById("thoroughness5").value);
    });

    $(document).off("click", "#klay-default-layout").on("click", "#klay-default-layout", function (evt) {
      self.copyProperties();
      let temp = _.template($("#klay-settings-template").html());
      self.template = temp(self.currentLayoutProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});

let AVSDFLayout = Backbone.View.extend({
  defaultLayoutProperties: {
    name: "avsdf",
    animate: false,
    padding: 30,
    nodeSeparation: 60
  },
  currentLayoutProperties: null,
  initialize: function () {
    let self = this;
    self.copyProperties();
    let temp = _.template($("#avsdf-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
  },
  copyProperties: function () {
    this.currentLayoutProperties = _.clone(this.defaultLayoutProperties);
  },
  getProperties: function () {
    return this.currentLayoutProperties;
  },  
  applyLayout: async function () {
    await applyLayoutFunction(this);
  },
  render: function (previousLayout) {
    let self = this;
    let temp = _.template($("#avsdf-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
    $("#" + previousLayout + "-layout-table").hide();
    $(self.el).html(self.template);
    $(self.el).show();


    $(document).off("click", "#avsdf-save-layout").on("click", "#avsdf-save-layout", function (evt) {
      self.currentLayoutProperties.padding = Number(document.getElementById("padding6").value);
      self.currentLayoutProperties.nodeSeparation = Number(document.getElementById("nodeSeparation6").value);
    });

    $(document).off("click", "#avsdf-default-layout").on("click", "#avsdf-default-layout", function (evt) {
      self.copyProperties();
      let temp = _.template($("#avsdf-settings-template").html());
      self.template = temp(self.currentLayoutProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});

let PRESETLayout = Backbone.View.extend({
  defaultLayoutProperties: {
    name: "preset",
    padding: 30
  },
  currentLayoutProperties: null,
  initialize: function () {
    let self = this;
    self.copyProperties();
    let temp = _.template($("#preset-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
  },
  copyProperties: function () {
    this.currentLayoutProperties = _.clone(this.defaultLayoutProperties);
  },
  getProperties: function () {
    return this.currentLayoutProperties;
  },  
  applyLayout: async function () {
    await applyLayoutFunction(this);
  },
  render: function (previousLayout) {
    let self = this;
    let temp = _.template($("#preset-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
    $("#" + previousLayout + "-layout-table").hide();
    $(self.el).html(self.template);
    $(self.el).show();

    $(document).off("click", "#preset-save-layout").on("click", "#preset-save-layout", function (evt) {
      self.currentLayoutProperties.padding = Number(document.getElementById("padding7").value);
    });

    $(document).off("click", "#preset-default-layout").on("click", "#preset-default-layout", function (evt) {
      self.copyProperties();
      let temp = _.template($("#preset-settings-template").html());
      self.template = temp(self.currentLayoutProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});