let resultJson = [];
let speciesCompartmentMap = new Map;

const convertSBMLtoCytoscape = function(libsbmlInstance, sbmlText) {
  
    let reader = new libsbmlInstance.SBMLReader();
    
    // get document and model from sbml text
    let doc = reader.readSBMLFromString(sbmlText);
    let model = doc.getModel();
    
    // add compartments, species and reactions
    addCompartments(libsbmlInstance, model);
    addSpecies(libsbmlInstance, model);
    addReactions(model);
    
    let result = resultJson;
    resultJson = [];
    speciesCompartmentMap = new Map;
    
    return result;
};

// add compartment nodes
const addCompartments = function (libsbmlInstance, model) {
  let plugin = model.findPlugin('layout');
  let layoutplugin;
  let layout;
  
  if(plugin) {
    layoutplugin = libsbmlInstance.castObject(plugin, libsbmlInstance.LayoutModelPlugin);
    layout = layoutplugin.layouts[0];
  }
  
  for(let i = 0; i < model.getNumCompartments(); i++){
    let compartment = model.getCompartment(i);
    if(compartment.getId() !== "default") {
    let compartmentData = {"id": compartment.getId(), "label": compartment.getName()};
      compartmentData.width = layout ? layout.getCompartmentGlyph(i).getBoundingBox().width : 100;
      compartmentData.height = layout ? layout.getCompartmentGlyph(i).getBoundingBox().height : 100;
      resultJson.push({"data": compartmentData, "group": "nodes", "classes": "compartment"});
    }
  }
};

// add species nodes
const addSpecies = function(libsbmlInstance, model) {
  let plugin = model.findPlugin('layout');
  let layoutplugin;
  let layout;

  if(plugin) {
    layoutplugin = libsbmlInstance.castObject(plugin, libsbmlInstance.LayoutModelPlugin);
    layout = layoutplugin.layouts[0];
  }

  for(let i = 0; i < model.getNumSpecies(); i++){
    let species = model.getSpecies(i);
    speciesCompartmentMap.set(species.getId(), species.getCompartment());
    let speciesData = {"id": species.getId(), "label": species.getName(), "parent": species.getCompartment()};
    speciesData.width = layout ? layout.specglyphs[i].getBoundingBox().width : 60;
    speciesData.height = layout ? layout.specglyphs[i].getBoundingBox().height : 30;
    resultJson.push({"data": speciesData, "group": "nodes", "classes": "species"});
  }  
};

// add reaction nodes and corresponding edges
const addReactions = function(model) {
  for(let i = 0; i < model.getNumReactions(); i++){

    let reaction = model.getReaction(i);
    let reactionParentMap = new Map();

    // add reactant->reaction edges
    for(let j = 0; j < reaction.getNumReactants(); j++){
      let reactant = reaction.getReactant(j);
      let reactantEdgeData = {"id": reactant.getSpecies() + '_' + reaction.getId(), "source": reactant.getSpecies(), "target": reaction.getId()};
      resultJson.push({"data": reactantEdgeData, "group": "edges", "classes": "reactantEdge"});
      
      // collect possible parent info
      let speciesCompartment = speciesCompartmentMap.get(reactant.getSpecies());
      if(reactionParentMap.has(speciesCompartment))
        reactionParentMap.set(speciesCompartment, reactionParentMap.get(speciesCompartment) + 1);
      else
        reactionParentMap.set(speciesCompartment, 1);
    }
    
    // add reaction->product edges
    for(let k = 0; k < reaction.getNumProducts(); k++){
      let product = reaction.getProduct(k);
      let productEdgeData = {"id": reaction.getId() + '_' + product.getSpecies(), "source": reaction.getId(), "target": product.getSpecies()};
      resultJson.push({"data": productEdgeData, "group": "edges", "classes": "productEdge"});
      
      // collect possible parent info
      let speciesCompartment = speciesCompartmentMap.get(product.getSpecies());
      if(reactionParentMap.has(speciesCompartment))
        reactionParentMap.set(speciesCompartment, reactionParentMap.get(speciesCompartment) + 1);
      else
        reactionParentMap.set(speciesCompartment, 1);      
    }
    
    // add modifier->reaction edges
    for(let l = 0; l < reaction.getNumModifiers(); l++){
      let modifier = reaction.getModifier(l);
      let modifierEdgeData = {"id": modifier.getSpecies() + '_' + reaction.getId(), "source": modifier.getSpecies(), "target": reaction.getId()};
      resultJson.push({"data": modifierEdgeData, "group": "edges", "classes": "modifierEdge"});
      
      // collect possible parent info
      let speciesCompartment = speciesCompartmentMap.get(modifier.getSpecies());
      if(reactionParentMap.has(speciesCompartment))
        reactionParentMap.set(speciesCompartment, reactionParentMap.get(speciesCompartment) + 1);
      else
        reactionParentMap.set(speciesCompartment, 1);      
    }

    // add reaction node
    let parent = reaction.getCompartment();
    if(!parent) {
      // find the max occurrence
      var max_count = 0, result = -1;
      reactionParentMap.forEach((value, key) => {
          if (max_count < value) {
              result = key;
              max_count = value;
          }
      });
      parent = result;
    }
    
    let reactionData = {"id": reaction.getId(), "label": reaction.getName(), "parent": parent};
    reactionData.width = 20;
    reactionData.height = 20;
    resultJson.push({"data": reactionData, "group": "nodes", "classes": "reaction"});    
  }  
};

module.exports = {
  convertSBMLtoCytoscape
};