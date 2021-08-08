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
            'width': 64,
            'height': 64,
            'text-valign': 'center',
            'text-wrap': 'wrap',
            'font-size': 20,
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
            'text-margin-y': 2,
            'background-opacity': 0.3
          }
        },
        {
          selector: 'node.reaction',
          style: {
            'shape': 'rectangle',
            'width': 25,
            'height': 25,
            'text-valign': 'bottom',
            'background-color': "#ffffff"
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
            'arrow-scale': 2
          }
        },
        {
          selector: 'edge.modifierEdge',
          style: {
            'line-color': '#555555',
            'target-arrow-shape': 'triangle-tee',
            'target-arrow-color': '#555555',
            'target-arrow-fill': 'hollow',
            'arrow-scale': 2
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
            'label': function(node){
              return node.data('label') ? node.data('label') : ""
            },
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

