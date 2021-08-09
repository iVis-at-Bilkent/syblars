let FCOSELayout = Backbone.View.extend({
  defaultLayoutProperties: {
    name: "fcose",
    randomize: true,
    padding: 30,
    nodeDimensionsIncludeLabels: false,
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
  render: function () {
    let self = this;
    let temp = _.template($("#fcose-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
    $(self.el).html(self.template);

    $(self.el).modal({inverted: true}).modal('show');
    
    $(document).off("click", "#save-layout1").on("click", "#save-layout1", function (evt) {
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
      self.currentLayoutProperties.initialEnergyOnIncremental = Number(document.getElementById("initialEnergyOnIncremental1").value);
      $(self.el).modal('hide');
    });
    
    $(document).off("click", "#default-layout1").on("click", "#default-layout1", function (evt) {
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
    nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node

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
  render: function () {
    let self = this;
    let temp = _.template($("#cola-settings-template").html());
    self.template = temp(self.currentLayoutProperties);
    $(self.el).html(self.template);

    $(self.el).modal({inverted: true}).modal('show');

    $(document).off("click", "#save-layout2").on("click", "#save-layout2", function (evt) {
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
      $(self.el).modal('hide');
    });
    
    $(document).off("click", "#default-layout2").on("click", "#default-layout2", function (evt) {
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
  render: function () {
    let self = this;
    let temp = _.template($("#cise-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
    $(self.el).html(self.template);

    $(self.el).modal({inverted: true}).modal('show');

    $(document).off("click", "#save-layout3").on("click", "#save-layout3", function (evt) {
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
      $(self.el).modal('hide');
    });   

    $(document).off("click", "#default-layout3").on("click", "#default-layout3", function (evt) {
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
    nodeDimensionsIncludeLabels: false,
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
  render: function () {
    let self = this;
    let temp = _.template($("#dagre-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
    $(self.el).html(self.template);

    $(self.el).modal({inverted: true}).modal('show');

    $(document).off("click", "#save-layout4").on("click", "#save-layout4", function (evt) {
      self.currentLayoutProperties.nodeDimensionsIncludeLabels = document.getElementById("nodeDimensionsIncludeLabels4").checked;
      self.currentLayoutProperties.padding = Number(document.getElementById("padding4").value);
      self.currentLayoutProperties.nodeSep = Number(document.getElementById("nodeSep4").value);
      self.currentLayoutProperties.edgeSep = Number(document.getElementById("edgeSep4").value);
      self.currentLayoutProperties.rankSep = Number(document.getElementById("rankSep4").value);
      self.currentLayoutProperties.edgeWeight = Number(document.getElementById("edgeWeight4").value);     
      $(self.el).modal('hide');
    });

    $(document).off("click", "#default-layout4").on("click", "#default-layout4", function (evt) {
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
    nodeDimensionsIncludeLabels: false,
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
  render: function () {
    let self = this;
    let temp = _.template($("#klay-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
    $(self.el).html(self.template);

    $(self.el).modal({inverted: true}).modal('show');

    $(document).off("click", "#save-layout5").on("click", "#save-layout5", function (evt) {
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
      $(self.el).modal('hide');
    });

    $(document).off("click", "#default-layout5").on("click", "#default-layout5", function (evt) {
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
  render: function () {
    let self = this;
    let temp = _.template($("#avsdf-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
    $(self.el).html(self.template);

    $(self.el).modal({inverted: true}).modal('show');

    $(document).off("click", "#save-layout6").on("click", "#save-layout6", function (evt) {
      self.currentLayoutProperties.padding = Number(document.getElementById("padding6").value);
      self.currentLayoutProperties.nodeSeparation = Number(document.getElementById("nodeSeparation6").value);
      $(self.el).modal('hide');
    });

    $(document).off("click", "#default-layout6").on("click", "#default-layout6", function (evt) {
      self.copyProperties();
      let temp = _.template($("#avsdf-settings-template").html());
      self.template = temp(self.currentLayoutProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});

/*
var COSEBilkentLayout = Backbone.View.extend({
  defaultLayoutProperties: {
    name: 'cose-bilkent',
    ready: function () {
    },
    stop: function () {
    },
    refresh: 0,
    fit: true,
    padding: 10,
    incremental: true,
    debug: false,
    nodeRepulsion: 4500,
    nodeOverlap: 10,
    idealEdgeLength: 50,
    edgeElasticity: 0.45,
    nestingFactor: 0.1,
    gravity: 0.4,
    numIter: 2500,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1,
    tile: true
  },
  currentLayoutProperties: null,
  initialize: function () {
    var self = this;
    self.copyProperties();
    var temp = _.template($("#cose-bilkent-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
  },
  copyProperties: function () {
    this.currentLayoutProperties = _.clone(this.defaultLayoutProperties);
  },
  applyLayout: async function () {
    console.log("cose-bilkent layout is applied");
    await applyLayoutFunction(this);
  },
  render: function () {
    var self = this;
    var temp = _.template($("#cose-bilkent-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
    $(self.el).html(self.template);

    $(self.el).dialog();

    $("#save-layout4").on("click", function (evt) {
      self.currentLayoutProperties.nodeRepulsion = Number(document.getElementById("node-repulsion4").value);
      self.currentLayoutProperties.nodeOverlap = Number(document.getElementById("node-overlap4").value);
      self.currentLayoutProperties.idealEdgeLength = Number(document.getElementById("ideal-edge-length4").value);
      self.currentLayoutProperties.edgeElasticity = Number(document.getElementById("edge-elasticity4").value);
      self.currentLayoutProperties.nestingFactor = Number(document.getElementById("nesting-factor4").value);
      self.currentLayoutProperties.gravity = Number(document.getElementById("gravity4").value);
      self.currentLayoutProperties.numIter = Number(document.getElementById("num-iter4").value);
      // self.currentLayoutProperties.animate = document.getElementById("animate4").checked;
      self.currentLayoutProperties.refresh = Number(document.getElementById("refresh4").value);
      self.currentLayoutProperties.fit = document.getElementById("fit4").checked;
      self.currentLayoutProperties.padding = Number(document.getElementById("padding4").value);
      self.currentLayoutProperties.debug = document.getElementById("debug4").checked;
      self.currentLayoutProperties.initialTemp = Number(document.getElementById("initialTemp4").value);
      self.currentLayoutProperties.minTemp = Number(document.getElementById("minTemp4").value);
      self.currentLayoutProperties.coolingFactor = Number(document.getElementById("coolingFactor4").value);
      self.currentLayoutProperties.incremental = document.getElementById("incremental4").checked;
      self.currentLayoutProperties.tile = document.getElementById("tile4").checked;


      $(self.el).dialog('close');

    });

    $("#default-layout4").on("click", function (evt) {
      self.copyProperties();
      var temp = _.template($("#cose-bilkent-settings-template").html());
      self.template = temp(self.currentLayoutProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});
var COSELayout = Backbone.View.extend({
  defaultLayoutProperties: {
    name: 'cose',
    ready: function () {
    },
    stop: function () {
    },
    refresh: 4,
    fit: true,
    padding: 30,
    boundingBox: undefined,
    randomize: true,
    debug: false,
    nodeRepulsion: 400000,
    nodeOverlap: 10,
    idealEdgeLength: 10,
    edgeElasticity: 100,
    nestingFactor: 5,
    gravity: 250,
    numIter: 100,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1
  },
  currentLayoutProperties: null,
  initialize: function () {
    var self = this;
    self.copyProperties();
    var temp = self.template = _.template($("#cose-settings-template").html());
    self.template = temp(self.currentLayoutProperties);
  },
  copyProperties: function () {
    this.currentLayoutProperties = _.clone(this.defaultLayoutProperties);
  },
  applyLayout: async function () {
    console.log("Cose layout is applied");
    await applyLayoutFunction(this);
  },
  render: function () {
    var self = this;
    var temp = self.template = _.template($("#cose-settings-template").html());
    self.template = temp(self.currentLayoutProperties);
    $(self.el).html(self.template);

    $(self.el).dialog();

    $("#save-layout").on("click", function (evt) {
      self.currentLayoutProperties.nodeRepulsion = Number(document.getElementById("node-repulsion").value);
      self.currentLayoutProperties.nodeOverlap = Number(document.getElementById("node-overlap").value);
      self.currentLayoutProperties.idealEdgeLength = Number(document.getElementById("ideal-edge-length").value);
      self.currentLayoutProperties.edgeElasticity = Number(document.getElementById("edge-elasticity").value);
      self.currentLayoutProperties.nestingFactor = Number(document.getElementById("nesting-factor").value);
      self.currentLayoutProperties.gravity = Number(document.getElementById("gravity").value);
      self.currentLayoutProperties.numIter = Number(document.getElementById("num-iter").value);
      self.currentLayoutProperties.refresh = Number(document.getElementById("refresh").value);
      self.currentLayoutProperties.fit = document.getElementById("fit").checked;
      self.currentLayoutProperties.padding = Number(document.getElementById("padding").value);
      self.currentLayoutProperties.randomize = document.getElementById("randomize").checked;
      self.currentLayoutProperties.debug = document.getElementById("debug").checked;
      self.currentLayoutProperties.initialTemp = Number(document.getElementById("initialTemp").value);
      self.currentLayoutProperties.minTemp = Number(document.getElementById("minTemp").value);


      $(self.el).dialog('close');

    });

    $("#default-layout").on("click", function (evt) {
      self.copyProperties();
      var temp = self.template = _.template($("#cose-settings-template").html());
      self.template = temp(self.currentLayoutProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});

var ARBORLayout = Backbone.View.extend({
  defaultLayoutProperties: {
    name: 'arbor',
    maxSimulationTime: 4000, // max length in ms to run the layout
    fit: true, // on every layout reposition of nodes, fit the viewport
    padding: 30, // padding around the simulation
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    ready: undefined, // callback on layoutready
    stop: undefined, // callback on layoutstop
    repulsion: undefined,
    stiffness: undefined,
    friction: undefined,
    gravity: true,
    fps: undefined,
    precision: undefined,
    nodeMass: undefined,
    edgeLength: undefined,
    stepSize: 0.1, // smoothing of arbor bounding box
    stableEnergy: function (energy) {
      var e = energy;
      return (e.max <= 0.5) || (e.mean <= 0.3);
    },
    // infinite layout options
    infinite: false // overrides all other options for a forces-all-the-time mode
  },
  currentLayoutProperties: null,
  initialize: function () {
    var self = this;
    self.copyProperties();
    var temp = _.template($("#arbor-settings-template").html());
    self.template = temp(self.currentLayoutProperties);
  },
  copyProperties: function () {
    this.currentLayoutProperties = _.clone(this.defaultLayoutProperties);
  },
  applyLayout: async function () {
    console.log("Arbor layout is applied");
    await applyLayoutFunction(this);
  },
  render: function () {
    var self = this;
    var temp = _.template($("#arbor-settings-template").html());
    self.template = temp(self.currentLayoutProperties);
    $(self.el).html(self.template);

    $(self.el).dialog();

    $("#save-layout2").on("click", function (evt) {
      self.currentLayoutProperties.maxSimulationTime = Number(document.getElementById("maxSimulationTime2").value);
      self.currentLayoutProperties.fit = document.getElementById("fit2").checked;
      self.currentLayoutProperties.padding = Number(document.getElementById("padding2").value);
      self.currentLayoutProperties.gravity = document.getElementById("gravity2").checked;
      self.currentLayoutProperties.stepSize = Number(document.getElementById("stepSize2").value);
      self.currentLayoutProperties.infinite = document.getElementById("infinite2").checked;


      $(self.el).dialog('close');
    });

    $("#default-layout2").on("click", function (evt) {
      self.copyProperties();
      var temp = _.template($("#arbor-settings-template").html());
      self.template = temp(self.currentLayoutProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});
var SPRINGYLayout = Backbone.View.extend({
  defaultLayoutProperties: {
    name: 'springy',
    maxSimulationTime: 4000, // max length in ms to run the layout
    fit: true, // whether to fit the viewport to the graph
    padding: 30, // padding on fit
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    random: false, // whether to use random initial positions
    infinite: true, // overrides all other options for a forces-all-the-time mode
    ready: undefined, // callback on layoutready
    stop: undefined, // callback on layoutstop
    stiffness: 400,
    repulsion: 400,
    damping: 0.5
  },
  currentLayoutProperties: null,
  initialize: function () {
    var self = this;
    self.copyProperties();
    var temp = _.template($("#springy-settings-template").html());
    self.template = temp(self.currentLayoutProperties);
  },
  copyProperties: function () {
    this.currentLayoutProperties = _.clone(this.defaultLayoutProperties);
  },
  applyLayout: async function () {
    console.log("springy layout is applied");
    await applyLayoutFunction(this);
  },
  render: function () {
    var self = this;
    var temp = _.template($("#springy-settings-template").html());
    self.template = temp(self.currentLayoutProperties);
    $(self.el).html(self.template);

    $(self.el).dialog();

    $("#save-layout3").on("click", function (evt) {
      self.currentLayoutProperties.maxSimulationTime = Number(document.getElementById("maxSimulationTime3").value);
      self.currentLayoutProperties.fit = document.getElementById("fit3").checked;
      self.currentLayoutProperties.padding = Number(document.getElementById("padding3").value);
      self.currentLayoutProperties.random = document.getElementById("random3").checked;
      self.currentLayoutProperties.infinite = document.getElementById("infinite3").checked;
      self.currentLayoutProperties.stiffness = Number(document.getElementById("stiffness3").value);
      self.currentLayoutProperties.repulsion = Number(document.getElementById("repulsion3").value);
      self.currentLayoutProperties.damping = Number(document.getElementById("damping3").value);

      $(self.el).dialog('close');
    });

    $("#default-layout3").on("click", function (evt) {
      self.copyProperties();
      var temp = _.template($("#springy-settings-template").html());
      self.template = temp(self.currentLayoutProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});



var EULERLayout = Backbone.View.extend({
  defaultLayoutProperties: {
    name: "euler",
    fit: true,
    padding: 30,
    gravity: -1.2,
    pull: 0.001,
    theta: 0.666,
    dragCoeff: 0.02,
    movementThreshold: 1,
    timeStep: 20,
    refresh: 10,
    maxIterations: 1000,
    maxSimulationTime: 4000,
    boundingBox: undefined,
    randomize: true
  },
  currentLayoutProperties: null,
  initialize: function () {
    var self = this;
    self.copyProperties();
    var temp = _.template($("#euler-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
  },
  copyProperties: function () {
    this.currentLayoutProperties = _.clone(this.defaultLayoutProperties);
  },
  applyLayout: async function () {
    console.log("Euler layout is applied");
    await applyLayoutFunction(this);
  },
  render: function () {
    var self = this;
    var temp = _.template($("#euler-settings-template").html());
    let crossingMinimizationOption = '';

    self.template = temp(this.currentLayoutProperties);
    $(self.el).html(self.template);

    $(self.el).dialog();

    $("#save-layout10").on("click", function (evt) {
      self.currentLayoutProperties.fit = document.getElementById("fit10").checked;
      self.currentLayoutProperties.padding = Number(document.getElementById("padding10").value);
      self.currentLayoutProperties.gravity = Number(document.getElementById("gravity10").value);
      self.currentLayoutProperties.pull = Number(document.getElementById("pull10").value);
      self.currentLayoutProperties.theta = Number(document.getElementById("theta10").value);
      self.currentLayoutProperties.dragCoeff = Number(document.getElementById("dragCoeff10").value);
      self.currentLayoutProperties.movementThreshold = Number(document.getElementById("movementThreshold10").value);
      self.currentLayoutProperties.timeStep = Number(document.getElementById("timeStep10").value);
      self.currentLayoutProperties.refresh = Number(document.getElementById("refresh10").value);
      self.currentLayoutProperties.maxIterations = Number(document.getElementById("maxIterations10").value);
      self.currentLayoutProperties.maxSimulationTime = Number(document.getElementById("maxSimulationTime10").value);
      self.currentLayoutProperties.randomize = document.getElementById("randomize10").checked;

      $(self.el).dialog('close');
    });


    $("#default-layout10").on("click", function (evt) {
      self.copyProperties();
      var temp = _.template($("#euler-settings-template").html());
      self.template = temp(self.currentLayoutProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});
var SPREADLayout = Backbone.View.extend({
  defaultLayoutProperties: {
    name: "spread",
    fit: true,
    minDist: 20,
    padding: 20,
    expandingFactor: -1.0,
    maxExpandIterations: 4,
    randomize: false
  },
  currentLayoutProperties: null,
  initialize: function () {
    var self = this;
    self.copyProperties();
    var temp = _.template($("#spread-settings-template").html());
    self.template = temp(this.currentLayoutProperties);
  },
  copyProperties: function () {
    this.currentLayoutProperties = _.clone(this.defaultLayoutProperties);
  },
  applyLayout: async function () {
    console.log("spread layout is applied");
    await applyLayoutFunction(this);
  },
  render: function () {
    var self = this;
    var temp = _.template($("#spread-settings-template").html());
    let crossingMinimizationOption = '';

    self.template = temp(this.currentLayoutProperties);
    $(self.el).html(self.template);

    $(self.el).dialog();

    $("#save-layout11").on("click", function (evt) {
      self.currentLayoutProperties.fit = document.getElementById("fit11").checked;
      self.currentLayoutProperties.padding = Number(document.getElementById("padding11").value);
      self.currentLayoutProperties.maxExpandIterations = Number(document.getElementById("maxExpandIterations11").value);
      self.currentLayoutProperties.randomize = document.getElementById("randomize11").checked;
      self.currentLayoutProperties.minDist = Number(document.getElementById("minDist11").value);
      self.currentLayoutProperties.expandingFactor = Number(document.getElementById("expandingFactor11").value);

      $(self.el).dialog('close');
    });


    $("#default-layout11").on("click", function (evt) {
      self.copyProperties();
      var temp = _.template($("#spread-settings-template").html());
      self.template = temp(self.currentLayoutProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});
*/