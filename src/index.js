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
                    console.log(e);
                }
                data = body[0];
                options = body[1];
            }
            else {
                try {
                    options = JSON.parse(options);
                }
                catch (e) {
                    console.log(e);
                }
                if (foundSBGN) { // sbgnml
                    data = convertSBGNtoCytoscape(data);
                }
                else if (foundSBML) {
                    data = convertSBMLtoCytoscape(libsbmlInstance, data);
                }
                  
            }
            next();
        });
    }
    else
        next();
});
// check if an object is empty or not

// whether to include edges in the output or not
// POST /layout/:format?edges=true 
// POST /layout/:format?clusters=true
app.post('/layout/:format', (req, res) => {
    options.layoutOptions.animate = false;
    let size = 30;
    let format = req.params.format;
        
    cy = cytoscape({
        styleEnabled: true,
        headless: true
    });

    if (req.params.format === "graphml") {
      cy.graphml(data);
      cy.filter((element, i) => {
          return element.isNode();
      }).forEach((node) => {
          node.css("width", parseInt(node.data('width')) || size);
          node.css("height", parseInt(node.data('height')) || size);
          node.data("backgroundColor", options.imageOptions.color || "white");
      });
    }
    else {
      cy.add(data);

      cy.filter((element, i) => {
          return element.isNode();
      }).forEach((node) => {
          if (req.params.format === "json" || req.params.format === "sbml") {
              node.css("width", node.data().width || size);
              node.css("height", node.data().height || size);
              node.data("backgroundColor", options.imageOptions.color || "white");
          }
          else {
              node.css("width", node.data().bbox.w || size);
              node.css("height", node.data().bbox.h || size);
          }
      });
    }
    
    if(req.params.format === 'sbgnml' && options.imageOptions.format === 'svg') {
      options.imageOptions.format = 'png';
    }
    
    if(options.layoutOptions.name == 'cise') {
      if(options.layoutOptions.clusters == undefined || options.layoutOptions.clusters.length == 0) {
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
        
        options.layoutOptions.clusters = clusters;
      }
    }

    let ret = {};
    
    function setJson(result){
      ret["layout"] = {};
      // whether to return edges or not
      cy.filter((element, i) => {
          return true;
      }).forEach((ele) => {
          if (ele.isNode()) {
              if (req.params.format === "json" || req.params.format === "sbml") {
                  let obj = {};
                  obj["position"] = result.positions[ele.id()];
                  obj["data"] = { width: result.widths[ele.data().id], height: result.heights[ele.data().id], clusterID: parseInt(ele.data('clusterID')), parent: ele.data("parent") };
                  ret["layout"][ele.id()] = obj;
              }
              else if (req.params.format === "graphml") {
                  let obj = {};
                  obj["position"] = result.positions[ele.id()];
                  obj["data"] = { width: result.widths[ele.data().id], height: result.heights[ele.data().id], clusterID: parseInt(ele.data('clusterID')), parent: ele.data("parent") };
                  ret["layout"][ele.id()] = obj;
              }
              else if (req.params.format === "sbgnml") {
                  let obj = {};
                  obj["position"] = result.positions[ele.id()];
                  obj["data"] = { width: result.widths[ele.data().id], height: result.heights[ele.data().id], clusterID: parseInt(ele.data('clusterID')), parent: ele.data("parent") };
                  ret["layout"][ele.id()] = obj;
              }          
          }
          else if (!ele.isNode() && req.query.edges) {
              ret["layout"][ele.id()] = { source: ele.data().source, target: ele.data().target };
          }
      });
    }   
    
    let colorScheme = options.imageOptions.color || "white";
    let stylesheet = adjustStylesheet(format, colorScheme);

    if(options.imageOptions) {
        snap.start().then(function(){
          return snap.shot({
            elements: cy.json().elements,
            layout: options.layoutOptions,
            style: stylesheet,
            resolvesTo: 'all',
            format: options.imageOptions.format || 'png',
            quality: 100,
            width: options.imageOptions.width || 1280,
            height: options.imageOptions.height || 720,
            background: options.imageOptions.background
          }).then(function( result ){
            ret["image"] = result.image;
            setJson(result);
            return res.status(200).send(ret);
          }).then(function(){
            snap.stop();
          });
        });
    }
    else {
      return res.status(200).send(ret);
    }
});

module.exports = {
    port,
    app
};