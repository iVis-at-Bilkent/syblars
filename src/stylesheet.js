// define stylesheets

const sbgnStylesheet = require('cytoscape-sbgn-stylesheet');

let adjustStylesheet = function(format, colorScheme) {
  let stylesheet;
  if(format == 'sbgnml') {
    if(colorScheme == 'black_white') {
      stylesheet = function(){       
        return sbgnStylesheet(cytoscape, 'black_white');
      };
    }
    else if(colorScheme == 'greyscale') {
      stylesheet = function(){
        return sbgnStylesheet(cytoscape, 'greyscale');
      };
    }
    else if(colorScheme == 'bluescale') {
      stylesheet = function(){
        return sbgnStylesheet(cytoscape, 'bluescale');
      };
    }
    else if(colorScheme == 'red_blue') {
      stylesheet = function(){
        return sbgnStylesheet(cytoscape, 'red_blue');
      };
    }
    else if(colorScheme == 'green_brown') {
      stylesheet = function(){
        return sbgnStylesheet(cytoscape, 'green_brown');
      };
    }
    else if(colorScheme == 'purple_brown') {
      stylesheet = function(){
        return sbgnStylesheet(cytoscape, 'purple_brown');
      };
    }
    else if(colorScheme == 'purple_green') {
      stylesheet = function(){
        return sbgnStylesheet(cytoscape, 'purple_green');
      };
    }
    else if(colorScheme == 'grey_red') {
      stylesheet = function(){
        return sbgnStylesheet(cytoscape, 'grey_red');
      };
    }
    else {
      if(!isColor(colorScheme))
        colorScheme = undefined;
      stylesheet = function(){
        return sbgnStylesheet(cytoscape, colorScheme);
      };      
    }
    return stylesheet;
  }
  else if(format == 'sbml') {
    stylesheet =  function(){
      return [
        {
          selector: 'node',
          style: {
            'background-color': function(node){
              return node.data('backgroundColor') ? node.data('backgroundColor') : "#ffffff"
            },
            'width': function(node){
              return node.data('width') ? node.data('width') : 60;
            },
            'height': function(node){
              return node.data('height') ? node.data('height') : 30;
            },
            'text-valign': 'center',
            'text-wrap': 'wrap',
            'font-size': 12,
            "border-width": 2,
            'border-color': '#555555',
            'label': function(node){
              return node.data('label') ? node.data('label') : ""
            },
          }
        },
        {
          selector: 'node.compartment',
          style: {
            'shape': 'barrel',
            'text-valign': 'bottom',
            'text-margin-y': 3,
            'background-opacity': 0.2,
            "border-width": 4,
          }
        },
        {
          selector: 'node.reaction',
          style: {
            'shape': 'rectangle',
            'width': function(node){
              return node.data('width') ? node.data('width') : 15;
            },
            'height': function(node){
              return node.data('height') ? node.data('height') : 15;
            },
            'text-valign': 'bottom',
            'background-color': "#ffffff"
          }
        },
        {
          selector: 'node[sboTerm = 334]',
          style: {
            'shape': 'rhomboid'
          }
        },        
        {
          selector: 'node[sboTerm = 253]',
          style: {
            'shape': 'cut-rectangle',
            'text-valign': 'bottom',
            'background-opacity': 0.3,
            'text-margin-y': 3
          }
        },
        {
          selector: 'node[sboTerm = 289]',
          style: {
            'shape': 'cut-rectangle',
            'border-style': 'dashed',
            'background-opacity': 0.3,
            'text-margin-y': 3
          }
        },
        {
          selector: 'node[sboTerm = 291]',
          style: {
            'shape': 'polygon',
            'shape-polygon-points': "-1, 1, 1, -1, 0.625, -0.625, 0.5, -0.75, 0.25, -0.875,\n\
              0, -0.875, -0.25, -0.875, -0.5, -0.75, -0.625, -0.625, -0.75, -0.375, -0.875, 0,\n\
              -0.75, 0.375, -0.625, 0.625, -0.5, 0.75, -0.25, 0.875, 0, 0.875, 0.25, 0.875,\n\
               0.5, 0.75, 0.625, 0.625, 0.75, 0.375, 0.875, 0, 0.75, -0.375, 0.625, -0.625",
            'width': function(node){
              return node.data('width') ? node.data('width') : 25;
            },
            'height': function(node){
              return node.data('height') ? node.data('height') : 25;
            },
          }
        },        
        {
          selector: 'node[sboTerm = 298]',
          style: {
            'shape': 'ellipse',
            'border-style': 'double',
            'background-opacity': 0.8
          }
        },        
        {
          selector: 'node[sboTerm = 243]',
          style: {
            'shape': 'rectangle'
          }
        },
        {
          selector: 'node[sboTerm = 252]',
          style: {
            'shape': 'round-rectangle'
          }
        },
        {
          selector: 'node[sboTerm = 327]',
          style: {
            'shape': 'ellipse',
            'background-opacity': 0.8,
            'width': function(node){
              return node.data('width') ? node.data('width') : 30;
            },
            'height': function(node){
              return node.data('height') ? node.data('height') : 30;
            },
          }
        },
        {
          selector: 'node[sboTerm = 284]',
          style: {
            'shape': 'polygon',
            'shape-polygon-points': "-1, -0.8, -0.96, -0.86, -0.87, -0.96, -0.8, -1,\n\
               0.25, -1, 0.31, -0.96, 0.41, -0.86, 0.45, -0.8, 0.45, 0.8, 0.49, 0.86, \n\
                0.59, 0.96, 0.7, 1, 0.8, 1, 0.86, 0.96, 0.96, 0.86, 1, 0.8, 1, -0.8,\n\
                0.96, -0.86, 0.86, -0.96, 0.8, -1, 0.65, -1, 0.59, -0.96, 0.49, -0.86,\n\
                0.45, -0.8, 0.45, 0.8, 0.41, 0.86, 0.31, 0.96, 0.25, 1, -0.8, 1, -0.84, 0.96, -0.96, 0.86, -1, 0.8",
            'background-opacity': 0.8
          }
        },        
        {
          selector: 'node[sboTerm = 358]',
          style: {
            'shape': 'hexagon'
          }
        },
        {
          selector: 'node[sboTerm = 244]',
          style: {
            'shape': 'polygon',
            'shape-polygon-points': "-1, -1, 0, -0.6, 1, -1, 1, 0.6, 0, 1, -1, 0.6"
          }
        },
        {
          selector: 'node[sboTerm = 278]',
          style: {
            'shape': 'polygon',
            'shape-polygon-points': "-0.5, -1, 1, -1, 0.5, 1, -1, 1"
          }
        },        
        {
          selector: 'node[sboTerm = 247]',
          style: {
            'shape': 'ellipse',
            'background-opacity': 0.6
          }
        },
        {
          selector: 'node[sboTerm = 252]',
          style: {
            'shape': 'round-rectangle'
          }
        },        
        {
          selector: 'node[sboTerm = 285]',
          style: {
            'shape': 'ellipse',
            'border-width': 0,
            'background-opacity': 0.4
          }
        },
        {
          selector: 'node[sboTerm = 173]',
          style: {
            'shape': 'ellipse',
            'label': 'AND',
            'text-valign': 'center',
            'width': 30,
            'height': 30,
            'background-color': "#F2F2F2"      
          }
        },
        {
          selector: 'node[sboTerm = 174]',
          style: {
            'shape': 'ellipse',
            'label': 'OR',
            'text-valign': 'center',
            'width': 25,
            'height': 25,
            'background-color': "#F2F2F2"           
          }
        },        
        {
          selector: 'node[sboTerm = 238]',
          style: {
            'shape': 'ellipse',
            'label': 'NOT',
            'text-valign': 'center',
            'width': 25,
            'height': 25,
            'background-color': "#F2F2F2"
          }
        },
        {
          selector: 'node[sboTerm = 398]',
          style: {
            'shape': 'ellipse',
            'width': 25,
            'height': 25,
            'background-color': "#F2F2F2"
          }
        },        
        {
          selector: 'edge',
          style: {
            'curve-style': 'bezier',
            'line-color': '#555555',
            'width': 1.5
          }
        },
        {
          selector: 'edge.productEdge',
          style: {
            'line-color': '#555555',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#555555',
            'arrow-scale': 1.25
          }
        },
        {
          selector: 'edge.modifierEdge',
          style: {
            'line-color': '#555555',
            'target-arrow-shape': 'triangle-tee',
            'target-arrow-color': '#555555',
            'target-arrow-fill': 'hollow',
            'arrow-scale': 1.25
          }
        },
        {
          selector: 'edge[sboTerm = 13]',
          style: {
            'line-color': '#555555',
            'target-arrow-shape': 'circle',
            'target-arrow-color': '#555555',
            'target-arrow-fill': 'hollow',
            'arrow-scale': 1.25
          }
        },
        {
          selector: 'edge[sboTerm = 537]',
          style: {
            'line-color': '#555555',
            'target-arrow-shape': 'tee',
            'target-arrow-color': '#555555',
            'arrow-scale': 1.25
          }
        },
        {
          selector: 'edge[sboTerm = 594]',
          style: {
            'line-color': '#555555',
            'target-arrow-shape': 'diamond',
            'target-arrow-color': '#555555',
            'target-arrow-fill': 'hollow',
            'arrow-scale': 1.25
          }
        },
        {
          selector: 'edge[sboTerm = 459]',
          style: {
            'line-color': '#555555',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#555555',
            'target-arrow-fill': 'hollow',
            'arrow-scale': 1.25
          }
        },
        {
          selector: 'edge[sboTerm = 461]',
          style: {
            'line-color': '#555555',
            'target-arrow-shape': 'triangle-tee',
            'target-arrow-color': '#555555',
            'target-arrow-fill': 'hollow',
            'arrow-scale': 1.25
          }
        },
        {
          selector: 'edge[sboTerm = 462]',
          style: {
            'line-color': '#555555',
            'line-style': 'dashed',
            'target-arrow-shape': 'circle',
            'target-arrow-color': '#555555',
            'target-arrow-fill': 'hollow',
            'arrow-scale': 1.25
          }
        },
        {
          selector: 'edge[sboTerm = 536]',
          style: {
            'line-color': '#555555',
            'line-style': 'dashed',            
            'target-arrow-shape': 'tee',
            'target-arrow-color': '#555555',
            'arrow-scale': 1.25
          }
        }        
      ];        
    };      

    return stylesheet;             
  }      
  else {
    stylesheet =  function(){
      return [
        {
          selector: 'node',
          style: {
            'background-color': function(node){
              return node.data('backgroundColor') ? node.data('backgroundColor') : "#ffffff"
            },
            "border-width": 2,
            'border-color': '#555555',
            'width': function(node){
              return node.data('width') ? node.data('width') : 30;
            },
            'height': function(node){
              return node.data('height') ? node.data('height') : 30;
            },            
            'label': function(node){
              if(node.data('label')) {
                return node.data('label');
              }
              else {
                return node.data('id');
              }
            },
            'text-wrap': 'wrap',
            "text-max-width": "100px"
          }
        },
        {
          selector: 'node:parent',
          style: {
            'background-opacity': 0.3
          }
        },          
        {
          selector: 'edge',
          style: {
            'curve-style': 'bezier',
            'line-color': '#555555',
            'width': 1.5
          }
        }
      ];        
    };      

    return stylesheet;             
  }  
};

function isColor(strColor){
  var s = new Option().style;
  s.color = strColor;
  return s.color == strColor;
}

module.exports = {
  adjustStylesheet
};

