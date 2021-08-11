let resultJson = [];
let speciesCompartmentMap = new Map;

const convertSBMLtoCytoscape = function(libsbmlInstance, sbmlText) {
  
    let reader = new libsbmlInstance.SBMLReader();
    
    // get document and model from sbml text
    let doc = reader.readSBMLFromString(sbmlText);
    let model = doc.getModel();

    let result = []; 
    
    let plugin = model.findPlugin('layout');
    let layoutplugin;
    let layout;    
    
    if(plugin) {
      layoutplugin = libsbmlInstance.castObject(plugin, libsbmlInstance.LayoutModelPlugin);
      layout = layoutplugin.layouts[0];
    }    
    
    if(layout) {
      let edgeArray = [];
      let compoundMap = new Map();
      let compartmentMap = new Map();
      let compartmentNodeMap = new Map();

      // traverse compartments
      for(let i = 0; i < model.getNumCompartments(); i++){
        let compartment = model.getCompartment(i);
        if(compartment.getId() !== "default") {
          compartmentMap.set(compartment.getId(), compartment.getName());
        }
      }

      // traverse compartment glyphs
      for(let i = 0; i < layout.getNumCompartmentGlyphs(); i++){
        let compartmentGlyph = layout.getCompartmentGlyph(i);
        if(compartmentGlyph.getCompartmentId() !== "default") {
          let bbox = compartmentGlyph.getBoundingBox();
          let data = {id: compartmentGlyph.getCompartmentId(), label: compartmentMap.get(compartmentGlyph.getCompartmentId()),
            width: bbox.width, height: bbox.height};
          let position = {x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2};
          compartmentNodeMap.set(compartmentGlyph.getCompartmentId(), {"data": data, "position": position, "group": "nodes", "classes": "compartment"});
          compoundMap.set(compartmentGlyph.getCompartmentId(), [bbox.x, bbox.y, bbox.width, bbox.height, bbox.width*bbox.height]);
        }
      }

      let speciesMap = new Map();
      let speciesNodeMap = new Map();

      // traverse species
      for(let i = 0; i < model.getNumSpecies(); i++){
        let species = model.getSpecies(i);
        speciesMap.set(species.getId(), [species.getName(), species.getCompartment(), species.getSBOTerm()]);
      }

      // traverse species glyphs
      for(let i = 0; i < layout.getNumSpeciesGlyphs(); i++){
        let speciesGlyph = layout.specglyphs[i];
        let bbox = speciesGlyph.getBoundingBox();
        let data = {id: speciesGlyph.getId(), label: speciesMap.get(speciesGlyph.getSpeciesId())[0], compref: speciesMap.get(speciesGlyph.getSpeciesId())[0],
          sboTerm: speciesMap.get(speciesGlyph.getSpeciesId())[2], width: bbox.width, height: bbox.height};
        let position = {x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2};
        speciesNodeMap.set(speciesGlyph.getId(), {"data": data, "position": position, "group": "nodes", "classes": "species"});
        if(speciesMap.get(speciesGlyph.getSpeciesId())[2] == 253 || speciesMap.get(speciesGlyph.getSpeciesId())[2] == 289) {
          compoundMap.set(speciesGlyph.getId(), [bbox.x, bbox.y, bbox.width, bbox.height, bbox.width*bbox.height]);
        }
      }

      let reactionMap = new Map();
      let reactionNodeMap = new Map();

      // traverse reactions
      for(let i = 0; i < model.getNumReactions(); i++){
        let reaction = model.getReaction(i);
        reactionMap.set(reaction.getId(), [reaction.getName(), reaction.getSBOTerm()]);
      }

      // traverse reaction glyphs
      for(let i = 0; i < layout.getNumReactionGlyphs(); i++){
        let reactionGlyph = layout.getReactionGlyph(i);
        let data = {id: reactionGlyph.getReactionId(), label: reactionMap.get(reactionGlyph.getReactionId())[0], sboTerm: reactionMap.get(reactionGlyph.getReactionId())[1],
          width: 15, height: 15};
        let position = {x: reactionGlyph.getCurve().getCurveSegment(0).getStart().x() + 10, y: reactionGlyph.getCurve().getCurveSegment(0).getStart().y() + 10};
        reactionNodeMap.set(reactionGlyph.getReactionId(), {"data": data, "position": position, "group": "nodes", "classes": "reaction"});

        // add edges
        for(let j = 0; j < reactionGlyph.getNumSpeciesReferenceGlyphs(); j++){
          let speciesReferenceGlyph = reactionGlyph.getSpeciesReferenceGlyph(j);
          let role = speciesReferenceGlyph.getRole();
          if(role === 1 || role === 3) {
            let edgeData = {id: reactionGlyph.getReactionId() + "_" + speciesReferenceGlyph.getSpeciesGlyphId(), source: speciesReferenceGlyph.getSpeciesGlyphId(), target: reactionGlyph.getReactionId()};
            edgeArray.push({"data": edgeData, "group": "edges", "classes": "reactantEdge"});
          }
          else if(role === 2 || role === 4) {
            let edgeData = {id: speciesReferenceGlyph.getSpeciesGlyphId() + "_" + reactionGlyph.getReactionId(), source: reactionGlyph.getReactionId(), target: speciesReferenceGlyph.getSpeciesGlyphId()};
            edgeArray.push({"data": edgeData, "group": "edges", "classes": "productEdge"});
          }
          else if(role === 5 || role === 6 || role === 7) {
            let edgeData = {id: speciesReferenceGlyph.getSpeciesGlyphId() + "_" + reactionGlyph.getReactionId(), source: speciesReferenceGlyph.getSpeciesGlyphId(), target: reactionGlyph.getReactionId()};
            edgeArray.push({"data": edgeData, "group": "edges", "classes": "modifierEdge"});
          }
          else {
            let edgeData = {id: reactionGlyph.getReactionId() + "_" + speciesReferenceGlyph.getSpeciesGlyphId(), source: reactionGlyph.getReactionId(), target: speciesReferenceGlyph.getSpeciesGlyphId()};
            edgeArray.push({"data": edgeData, "group": "edges", "classes": "reactantEdge"});          
          }        
        }
      }

      // infer nesting
      let areaMap = new Map();
      compoundMap.forEach(function(value, key){
        areaMap.set(key, value[4]);
      });
      let sortedAreaMap = new Map([...areaMap.entries()].sort((a, b) => a[1] - b[1]));

      function contains(a, b) {
        return !(
          b.x1 <= a.x1 ||
          b.y1 <= a.y1 ||
          b.x2 >= a.x2 ||
          b.y2 >= a.y2
        );
      };

      let mergedMap = new Map([...compartmentNodeMap, ...speciesNodeMap, ...reactionNodeMap]);
      let finalNodeArray = [];
      mergedMap.forEach(function(value, key) {
        let nodeId = key;
        let nodeRect = {x1: value["position"].x - value["data"].width / 2,
          y1: value["position"].y - value["data"].height / 2,
          x2: value["position"].x + value["data"].width / 2,
          y2: value["position"].y + value["data"].height / 2
        };
        let isFound = false;
        sortedAreaMap.forEach(function(value, key) {
          let compoundRect = {x1: compoundMap.get(key)[0],
            y1: compoundMap.get(key)[1],
            x2: compoundMap.get(key)[0] + compoundMap.get(key)[2],
            y2: compoundMap.get(key)[1] + compoundMap.get(key)[3]
          };
          if(contains(compoundRect, nodeRect) && !isFound) {
            mergedMap.get(nodeId)["data"]["parent"] = key;
            isFound = true;
          }
        });
        finalNodeArray.push(value);
      });

      result = finalNodeArray.concat(edgeArray);
    
      return result;
    }
    else {
      // add compartments, species and reactions
      addCompartments(libsbmlInstance, model);
      addSpecies(libsbmlInstance, model);
      addReactions(model);

      let result = resultJson;
      resultJson = [];
      speciesCompartmentMap = new Map;
      
      return result;
    }
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
    reactionData.width = 15;
    reactionData.height = 15;
    resultJson.push({"data": reactionData, "group": "nodes", "classes": "reaction"});    
  }  
};

module.exports = {
  convertSBMLtoCytoscape
};