const express = require('express');
const app = express();
const cytoscape = require('cytoscape');
const fs = require('fs');
const cors = require('cors');
const libsbml = require('libsbmljs_stable');
const libsbmlInstance = libsbml();
const convertSBGNtoCytoscape = require('sbgnml-to-cytoscape'); // to support sbgnml type of input
const { convertSBMLtoCytoscape } = require('./sbml-to-cytoscape'); // to support sbml type of input
const { adjustStylesheet } = require('./stylesheet');

const cytosnap = require('cytosnap');
cytosnap.use(['cytoscape-fcose', 'cytoscape-cola', 'cytoscape-cise', 'cytoscape-dagre', 'cytoscape-klay', 'cytoscape-avsdf'], {sbgnStylesheet: 'cytoscape-sbgn-stylesheet', layoutUtilities: 'cytoscape-layout-utilities', svg: 'cytoscape-svg'});
let snap = cytosnap();

const port = process.env.PORT || 3000;

// to serve the html
const path = require("path");
// app.set( "view engine", any );

// for graphml
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

// for queries
const graphAlgos = require("cytoscape-graph-algos");
cytoscape.use(graphAlgos);

const $ = jQuery = require('jquery')(window);

const graphml = require('cytoscape-graphml');
cytoscape.use(graphml, $);

// for fcose
const fcose = require('cytoscape-fcose');
cytoscape.use(fcose);

// for cise layout, Needs to be fixed, some problems
const cise = require('cytoscape-cise');
cytoscape.use(cise);

// for dagre layout
const dagre = require('cytoscape-dagre');
cytoscape.use(dagre);

// for klay layout
const klay = require('cytoscape-klay');
cytoscape.use(klay);

// for avsdf layout
const avsdf = require('cytoscape-avsdf');
cytoscape.use(avsdf);

// for cola layout
const cola = require('cytoscape-cola');
cytoscape.use(cola);

let cy;
let options;
let data;
let body;

app.use(express.static(path.join(__dirname, "../public/")));
app.use(cors());

// middleware to manage the formats of files
app.use((req, res, next) => {
    if (req.method === "POST") {
        body = '';
        isJson = false;
        options = '';
        data = '';
        errorMessage = undefined;

        req.on('data', chunk => {
            body += chunk;
        })

        req.on('end', () => {
            for (id = 0; id < body.length && body[id] != '{'; id++);
            options = body.substring(id);
            data = body.substring(0, id);

            let foundSBGN = body.includes("sbgn");
            let foundSBML = body.includes("sbml");
            let foundGML = body.includes("graphml");
            let isJson = !(foundGML || foundSBGN || foundSBML);

            if (isJson) {
                try {
                    body = JSON.parse(body);
                }
                catch (e) {
                  errorMessage = "Sorry! Cannot process the given file!"
                }
                data = body[0];
                options = body[1];
            }
            else {
                try {
                    options = JSON.parse(options);
                }
                catch (e) {
                  errorMessage = "Sorry! Cannot process the given options!"
                }
                try {
                  if (foundSBGN) { // sbgnml
                    data = convertSBGNtoCytoscape(data);
                  }
                  else if (foundSBML) {
                      data = convertSBMLtoCytoscape(libsbmlInstance, data);
                  }
                }
                catch (e) {
                  errorMessage = "Sorry! Cannot process the given file!"
                }
            }
            if(errorMessage) {
              return res.status(500).send({
                errorMessage: errorMessage
             });
            }
            else {
              next();
            }
        });
    }
    else
        next();
});
// check if an object is empty or not

// whether to include edges in the output or not
// POST :format?edges=true 
// POST :format?clusters=true
app.post('/:format', (req, res) => {

    let size = 30;
    let format = req.params.format;
    let imageWanted = true;
    if(req.query.image == "false") {
      imageWanted = false;
    }
        
    cy = cytoscape({
        styleEnabled: true,
        headless: true
    });
    
    let imageOptions = {
      format: 'png', 
      background: 'transparent',
      width: 1280,
      height: 720,
      color: '#9ecae1'
    };
    
    if(options.imageOptions) {
      $.extend(imageOptions, options.imageOptions);
    }

    if(imageOptions.format == 'jpg' && imageOptions.background == "transparent") {
      imageOptions.background = "white";
    }

    if(imageOptions.format == 'svg' && imageOptions.background == "transparent") {
      imageOptions.background = undefined;
    }

    if(imageOptions.width <= 0) {
      imageOptions.width = 1280;
    }

    if(imageOptions.height <= 0) {
      imageOptions.height = 720;
    }
    
    if (req.params.format === "graphml") {
      cy.graphml({layoutBy: function(){
        cy.nodes().forEach(function(node) {
          node.position({x: parseFloat(node.data("x")), y: parseFloat(node.data("y"))});
        }); 
      }});
      cy.graphml(data);     
      cy.nodes().forEach((node) => {        
        node.data("backgroundColor", imageOptions.color);
      });
    }
    else {
      if(req.params.format === "sbgnml") {  // add position info if exists
        let sbgnNodes = data["nodes"];
        sbgnNodes.forEach(function(node) {
          if(node["data"].bbox) {
            node["position"] = {x: node["data"].bbox.x, y: node["data"].bbox.y};
          }
        });
      }
      cy.add(data);
      cy.nodes().forEach((node) => {
        if (req.params.format === "json" || req.params.format === "sbml") {
          node.data("backgroundColor", imageOptions.color);
        }
        else {
          node.css("width", node.data().bbox.w || size);
          node.css("height", node.data().bbox.h || size);
        }
      });
    }

    if(req.query.nodeInfo) {
      let ret = {};
      cy.nodes().forEach(function(node){
        ret[node.id()] = node.data('label') ? node.data('label') : "";
      });
      return res.status(200).send(ret);
    }

    let layoutOptions = options.layoutOptions;
    
    if(!layoutOptions) {
      layoutOptions = {
        name: "preset",
        padding: 30
      }
    }
    
    layoutOptions.animate = false;
    
    if(layoutOptions.name == 'cise') {
      if(layoutOptions.clusters == undefined || layoutOptions.clusters.length == 0) {
        let clusterMap = new Map();
        cy.nodes().forEach(function(node){
          let clusterID = node.data("clusterID");
          if(clusterID) {
            if(clusterMap.has(clusterID))
              clusterMap.get(clusterID).push(node.id());
            else
              clusterMap.set(clusterID, [node.id()]);
          }
        });
        
        let clusters = [];
        for (const value of clusterMap.values()) {
          clusters.push(value);
        }
        
        layoutOptions.clusters = clusters;
      }
    }

    let queryOptions = options.queryOptions;
    let elementsToBeRendered = cy.elements();
    if(queryOptions) {
      let queryResult;  // query result may or may not contain source/target nodes based on the type of the query
      let path;
      let sourceNodes = cy.collection();
      let targetNodes = cy.collection();
      // assign default values for some of the query options
      if(!queryOptions.limit) {
        queryOptions.limit = 1;
      }
      if(!queryOptions.furtherDistance) {
        queryOptions.furtherDistance = 1;
      }
      if(!queryOptions.direction) {
        if(queryOptions.query == 'pathsFromTo') {
          queryOptions.direction = "DIRECTED";
        }
        else {
          queryOptions.direction = "BOTHSTREAM";
        }
      }
      if(queryOptions.highlight == undefined) {
        queryOptions.highlight = true;
      }

      const isCentrality = queryOptions.query == 'degreeCentrality' || queryOptions.query == 'closenessCentrality' 
        || queryOptions.query == 'betweennessCentrality' || queryOptions.query == 'pageRank';

      // run queries
      let result;
      try {
        if(!isCentrality) {
          queryOptions.sourceNodes.forEach(function(nodeId){
            let node = cy.getElementById(nodeId);
            node.addClass('source');
            node.data('highlightColor', queryOptions.sourceColor);
            sourceNodes.merge(node);
          });
          if(queryOptions.targetNodes) {
            queryOptions.targetNodes.forEach(function(nodeId){
              let node = cy.getElementById(nodeId);
              node.addClass('target');
              node.data('highlightColor', queryOptions.targetColor);
              targetNodes.merge(node);
            });
          }
        }

        if(queryOptions.query == 'degreeCentrality') {
          let direction = queryOptions.direction == "DIRECTED" ? true : false;
          queryResult = cy.elements().degreeCentralityNormalized({directed: direction});
        }
        if(queryOptions.query == 'closenessCentrality') {
          let direction = queryOptions.direction == "DIRECTED" ? true : false;
          queryResult = cy.elements().closenessCentralityNormalized({directed: direction});
        }
        if(queryOptions.query == 'betweennessCentrality') {
          let direction = queryOptions.direction == "DIRECTED" ? true : false;
          queryResult = cy.elements().betweennessCentrality({directed: direction});
        }
        if(queryOptions.query == 'pageRank') {
          queryResult = cy.elements().pageRank();
        }
        else if(queryOptions.query == 'shortestPath') {
          let direction = queryOptions.direction == "DIRECTED" ? true : false;
          queryResult = cy.elements().dijkstra(cy.getElementById(queryOptions.sourceNodes[0]), undefined, direction).pathTo(cy.getElementById(queryOptions.targetNodes[0]));
        }
        else if(queryOptions.query == 'kNeighborhood') {
          queryResult = cy.collection();
          result = cy.elements().kNeighborhood(sourceNodes, queryOptions.limit, queryOptions.direction);
          queryResult.merge(result.neighborNodes).merge(result.neighborEdges);
        }
        else if(queryOptions.query == 'commonStream') {
          queryResult = cy.collection();
          result = cy.elements().commonStream(sourceNodes, queryOptions.limit, queryOptions.direction);
          queryResult.merge(result.commonNodes).merge(result.edgesOnPath).merge(result.nodesOnPath);
        }
        else if(queryOptions.query == 'pathsBetween') {
          queryResult = cy.collection();
          result = cy.elements().pathsBetween(sourceNodes, queryOptions.limit);
          queryResult.merge(result.resultNodes).merge(result.resultEdges);
        }
        else if(queryOptions.query == 'pathsFromTo') {
          queryResult = cy.collection();
          result = cy.elements().pathsFromTo(sourceNodes, targetNodes, queryOptions.limit, queryOptions.furtherDistance, queryOptions.direction);
          queryResult.merge(result.nodesOnThePaths).merge(result.edgesOnThePaths);
        }
      }
      catch (e) {
        errorMessage = "Sorry! Cannot process the given query!"
      }
      if(errorMessage) {
        return res.status(500).send({
          errorMessage: errorMessage
       });
      }

      if(isCentrality) {
        let round2dec = num => Math.round(num * 100) / 100;

        if(queryOptions.query == 'degreeCentrality') {
          if(queryOptions.direction == "DIRECTED") {
            cy.nodes().forEach(function(node){
              if(req.params.format === 'sbgnml' || req.params.format === 'sbml') {
                if(node.data('label')) {
                  node.data('label', node.data('label') + "\n(" + round2dec(queryResult.indegree(node)) + ", " + round2dec(queryResult.outdegree(node)) + ")");
                }
                else {
                  node.data('label', "\n(" + round2dec(queryResult.indegree(node)) + ", " + round2dec(queryResult.outdegree(node)) + ")");
                }
              }
              else if(req.params.format === 'graphml' || req.params.format === 'json'){
                if(node.data('label')) {
                  node.data('label', node.data('label') + "\n(" + round2dec(queryResult.indegree(node)) + ", " + round2dec(queryResult.outdegree(node)) + ")");
                }
                else {
                  node.data('label', node.data('id') + "\n(" + round2dec(queryResult.indegree(node)) + ", " + round2dec(queryResult.outdegree(node)) + ")");
                }
              }
              if(queryOptions.highlight === true) {
                node.addClass('highlight');
                node.data('highlightColor', queryOptions.highlightColor);
                node.data('highlightWidth', (round2dec(queryResult.indegree(node)) + round2dec(queryResult.outdegree(node))) / 2 * 10);                
              }
            });
          }
          else {
            cy.nodes().forEach(function(node){
              if(req.params.format === 'sbgnml' || req.params.format === 'sbml') {
                if(node.data('label')) {
                  node.data('label', node.data('label') + "\n(" + round2dec(queryResult.degree(node)) + ")");
                }
                else {
                  node.data('label', "\n(" + round2dec(queryResult.degree(node)) + ")");
                }
              }
              else if(req.params.format === 'graphml' || req.params.format === 'json'){
                if(node.data('label')) {
                  node.data('label', node.data('label') + "\n(" + round2dec(queryResult.degree(node)) + ")");
                }
                else {
                  node.data('label', node.data('id') + "\n(" +round2dec( queryResult.degree(node)) + ")");
                }
              }
              if(queryOptions.highlight === true) {
                node.addClass('highlight');
                node.data('highlightColor', queryOptions.highlightColor);
                node.data('highlightWidth', round2dec(queryResult.degree(node)) * 10);                
              }
            });
          }
        }
        else if(queryOptions.query == 'closenessCentrality') {
          cy.nodes().forEach(function(node){
            if(req.params.format === 'sbgnml' || req.params.format === 'sbml') {
              if(node.data('label')) {
                node.data('label', node.data('label') + "\n(" + round2dec(queryResult.closeness(node)) + ")");
              }
              else {
                node.data('label', "\n(" + round2dec(queryResult.closeness(node)) + ")");
              }
            }
            else if(req.params.format === 'graphml' || req.params.format === 'json'){
              if(node.data('label')) {
                node.data('label', node.data('label') + "\n(" + round2dec(queryResult.closeness(node)) + ")");
              }
              else {
                node.data('label', node.data('id') + "\n(" + round2dec(queryResult.closeness(node)) + ")");
              }
            }
            if(queryOptions.highlight === true) {
              node.addClass('highlight');
              node.data('highlightColor', queryOptions.highlightColor);
              node.data('highlightWidth', round2dec(queryResult.closeness(node)) * 10);
            }
          });
        }
        else if(queryOptions.query == 'betweennessCentrality') {
          cy.nodes().forEach(function(node){
            if(req.params.format === 'sbgnml' || req.params.format === 'sbml') {
              if(node.data('label')) {
                node.data('label', node.data('label') + "\n(" + round2dec(queryResult.betweennessNormalized(node)) + ")");
              }
              else {
                node.data('label', "\n(" + round2dec(queryResult.betweennessNormalized(node)) + ")");
              }
            }
            else if(req.params.format === 'graphml' || req.params.format === 'json'){
              if(node.data('label')) {
                node.data('label', node.data('label') + "\n(" + round2dec(queryResult.betweennessNormalized(node)) + ")");
              }
              else {
                node.data('label', node.data('id') + "\n(" + round2dec(queryResult.betweennessNormalized(node)) + ")");
              }
            }
            if(queryOptions.highlight === true) {
              node.addClass('highlight');
              node.data('highlightColor', queryOptions.highlightColor);
              node.data('highlightWidth', round2dec(queryResult.betweennessNormalized(node)) * 10);
            }
          });
        }
        else if(queryOptions.query == 'pageRank') {
          cy.nodes().forEach(function(node){
            if(req.params.format === 'sbgnml' || req.params.format === 'sbml') {
              if(node.data('label')) {
                node.data('label', node.data('label') + "\n(" + round2dec(queryResult.rank(node)) + ")");
              }
              else {
                node.data('label', "\n(" + round2dec(queryResult.rank(node)) + ")");
              }
            }
            else if(req.params.format === 'graphml' || req.params.format === 'json'){
              if(node.data('label')) {
                node.data('label', node.data('label') + "\n(" + round2dec(queryResult.rank(node)) + ")");
              }
              else {
                node.data('label', node.data('id') + "\n(" + round2dec(queryResult.rank(node)) + ")");
              }
            }
            if(queryOptions.highlight === true) {
              node.addClass('highlight');
              node.data('highlightColor', queryOptions.highlightColor);
              node.data('highlightWidth', round2dec(queryResult.rank(node)) * 100);
            }
          });
        }
      }
      else {
        path = queryResult.difference(sourceNodes).difference(targetNodes);
        if(queryOptions.query == 'commonStream') {
          let commonNodes = cy.collection();  // change here after graph-algos bug fix
          result.commonNodes.forEach(function(node){
            commonNodes.merge(node);
          });
          path = path.difference(commonNodes);
          result.commonNodes.forEach(function(node){
            node.addClass('target');
            node.data('highlightColor', queryOptions.targetColor);
            targetNodes.merge(node);
          });
        }
        path.addClass('path');
        path.data('highlightColor', queryOptions.pathColor);
        queryResult.data('highlightWidth', queryOptions.highlightWidth);
  
        if(queryOptions.cropToResult) {
          elementsToBeRendered = queryResult.union(sourceNodes).union(targetNodes);
        }
      }
    }

    let ret = {};
    
    function setJson(result){
      ret["layout"] = {};
      // whether to return edges or not
      elementsToBeRendered.nodes().forEach((ele) => {
        let obj = {};
        obj["position"] = result.positions[ele.id()];
        obj["data"] = { width: result.widths[ele.data().id], height: result.heights[ele.data().id], parent: ele.data("parent") };
        if(ele.data('clusterID') != null) {
          obj["data"]['clusterID'] = parseInt(ele.data('clusterID'));
        }
        ret["layout"][ele.id()] = obj;
      });
      if (req.query.edges) {
        elementsToBeRendered.edges().forEach((ele) => {
          ret["layout"][ele.id()] = { source: ele.data().source, target: ele.data().target };
        });
      }
    }

    let colorScheme = imageOptions.color || "white";
    let stylesheet = adjustStylesheet(format, colorScheme);

    snap.start().then(function(){
      return snap.shot({
        elements: elementsToBeRendered.jsons(),
        layout: layoutOptions,
        style: stylesheet,
        resolvesTo: 'all',
        format: imageOptions.format,
        quality: 100,
        width: imageOptions.width,
        height: imageOptions.height,
        background: imageOptions.background
      }).then(function( result ){
        if(imageWanted) {
          ret["image"] = result.image;
        }
        if(layoutOptions.name != "preset") {
          setJson(result);
        }
        return res.status(200).send(ret);
      }).then(function(){
        snap.stop();
      });
    });

});

module.exports = {
    port,
    app
};