import fs from 'fs';
import fetch from 'node-fetch';

// layout options - use fcose
const layoutOptions = {
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
  gravityCompound: 1,
  gravityRangeCompound: 1.5,
  initialEnergyOnIncremental: 0.3
}

// all options
const options = {
  layoutOptions: layoutOptions,
  imageOptions: {
    format: 'png',
    background: 'transparent',
    width: 1280,
    height: 720,
    color: '#9ecae1'
  }
};

let numberOfFiles = 0;

// read folder that include sbml files and start procesing from the first file
fs.readdir("./model-dataset", (err, files) => {
  if (err)
    console.log(err);
  else {
    console.log("Current directory filenames:");
    numberOfFiles = files.length;
    let index = 0; 
    if( numberOfFiles > 0 ) {
      generateImage(files, index);   
    }
  }
});

// first read the file with the given index, send it to the server and save the resulting image
function generateImage(files, index) {
  console.log(files[index] + " is in process..");
  fs.readFile("./model-dataset/" + files[index], 'utf8' , async (err, graphData) => {
    if (err) {
      console.error(err);
      // cannot read the file, continue with the next one
      index++
      if(index < files.length) {
        generateImage(files, index);
      }
    }
    // send file to the server to process and produce image
    const url = "http://localhost:3000/sbml?edges=true";
    let data = graphData + JSON.stringify(options);
    const settings = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'text/plain'
      },
      body: data
    };
    let res = await fetch(url, settings)
    .then(response => response.json())
    .then(result => {
      // result is valid
      if(!result.errorMessage && (result.layout !== undefined || result.image !== undefined)) {    
        if(result["image"] !== undefined) {
          let filename = files[index];
          filename = filename.substring(0, filename.lastIndexOf('.')) + "." + "png";
          let base64Data = result["image"].replace(/^data:image\/png;base64,/, "");
          // save the image
          fs.writeFile("model-images/" + filename, base64Data, 'base64', function(err) {
            if(err) {
              console.log(filename + " cannot be saved!");
            }
            console.log(filename + " is saved!");
            // image is saved, continue with the next one
            index++
            if(index < files.length) {
              generateImage(files, index);
            }
          });
        }
      }
      else {  // result is invalid, continue with the next one
        if(result.errorMessage) {
          console.log(res.errorMessage);
          console.log(files[index] + " cannot be processed by server!");
        }
        else {
          console.log(files[index] + " cannot be processed by server!");
        }
        index++
        if(index < files.length) {
          generateImage(files, index);
        }
      }
    })
    .catch(e => { // there is a problem, continue with the next one
      console.log("Sorry! Cannot process the file " + files[index]);
      index++
      if(index < files.length) {
        generateImage(files, index);
      }
    });    
  }) 
}