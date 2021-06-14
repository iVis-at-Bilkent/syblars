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
  else {
    stylesheet =  function(){
        return [ // http://js.cytoscape.org/#style
          {
            selector: 'node',
            style: {
              'background-color': function(node){
                return node.data('backgroundColor') ? node.data('backgroundColor') : "#ffffff"
              },
              "border-width": "3px",
              'border-color': 'black',
              'label': function(node){
                return node.data('label') ? node.data('label') : ""
              },
            }
          },
          {
            selector: 'edge',
            style: {
              'line-color': 'black'
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

