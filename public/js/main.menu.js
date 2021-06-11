heroku = !(location.hostname === "localhost");

///////////////////// LOAD & SAVE //////////////////////////////

let graphData; // data read from the file
let blobData; // blob data for image
let imageFormat;

var setFileContent = function (fileName) {
    var span = document.getElementById('file-name');
    while (span.firstChild) {
        span.removeChild(span.firstChild);
    }
    span.appendChild(document.createTextNode(fileName));
};

$("#save-file-json").on("click", function (e) {
    let save = [];

    cy.filter((element, i) => {
        return true;
    }).forEach((ele) => {
        if (ele.isNode()) {
            let saveObj = {};
            saveObj["group"] = "nodes";
            saveObj["data"] = { width: ele.data().width, height: ele.data().height, clusterID: ele.data().clusterID, parent: ele.data().parent };
            saveObj["data"].id = ele.data().id;
            saveObj["position"] = { x: ele.position().x, y: ele.position().y };
            save.push(saveObj);
        }
        else {
            let saveObj = { group: "edges", data: { source: ele.data().source, target: ele.data().target, id: ele.id() } };
            saveObj.id = ele.id();
            save.push(saveObj);
        }
    })

    var jsonText = JSON.stringify(save, null, 4);

    var blob = new Blob([jsonText], {
        type: "application/json;charset=utf-8;",
    });
    var filename = "" + new Date().getTime() + ".json";
    saveAs(blob, filename);
});

//$('#resultImage').click(function(){
//
//  window.open($(this)[0].src, '_blank');
//
//});

let processLayout = async function () {
  
  let isGraphML = (graphData.search("graphml") === -1) ? 0 : 1;
  let isSBGNML = (graphData.search("sbgn") === -1) ? 0 : 1;
  let isSBML = (graphData.search("sbml") === -1) ? 0 : 1;

  if (!heroku) {
    if (isGraphML)
      url = "http://localhost:" + port + "/layout/graphml?edges=true";
    else if (isSBGNML)
      url = "http://localhost:" + port + "/layout/sbgnml?edges=true"
    else if (isSBML)
      url = "http://localhost:" + port + "/layout/sbml?edges=true"
    else
      url = "http://localhost:" + port + "/layout/json?edges=true"
  } else {
    if (isGraphML)
      url = "http://139.179.50.45:3000/layout/graphml?edges=true";
    else if (isSBGNML)
      url = "http://139.179.50.45:3000/layout/sbgnml?edges=true"
    else if (isSBML)
      url = "http://139.179.50.45:3000/layout/sbml?edges=true"
    else
      url = "http://139.179.50.45:3000/layout/json?edges=true"
  }

  imageFormat = $('#formatRadios').find('[name="format"]:checked').val();
  let currentLayout = $('#layoutType').val();
  
  let layoutOptions = {};
  switch (currentLayout) {
    case 'fcose':
      layoutOptions = fcoseLayoutProp.getProperties();
      break;    
    case 'cose-bilkent':
      coseBilkentLayoutProp.getProperties();
      break;
    case 'cose':
      coseLayoutProp.getProperties();
      break;
    case 'cola':
      colaLayoutProp.getProperties();
      break;
    case 'cise':
      ciseLayoutProp.getProperties();
      break;
    case 'dagre':
      dagreLayoutProp.getProperties();
      break;
    case 'klay':
      klayLayoutProp.getProperties();
      break;
    case 'avsdf':
      avsdfLayoutProp.getProperties();
      break;
    case 'euler':
      eulerLayoutProp.getProperties();
      break;
  }
    
  let options = {
    layoutOptions: layoutOptions,
    imageOptions: {
      format: imageFormat,
      background: $('#imageBackground').val(),
      width: parseInt($('#imageWidth').val()),
      height: parseInt($('#imageHeight').val()),
      colorScheme: $('#colorScheme').val()
    }
  };

  let data;
  if (!isGraphML && !isSBGNML && !isSBML) {
    data = [JSON.parse(graphData), options];
    data = JSON.stringify(data);
  } else
    data = graphData + JSON.stringify(options);

  const settings = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'content-Type': 'text/plain',
    },
    body: data
  };

  let res = await fetch(url, settings)
          .then(response => response.json())
          .then(res => {
            return res;
          })
          .catch(e => {
            return e;
          });

  // get layout info
  $("#resultText").val(JSON.stringify(res.layout, null, 2));
  
  // get image info
  blobData = saveImage(res["image"], imageFormat, document.getElementById("file-name").innerHTML);
  let urlCreator = window.URL || window.webkitURL;
  let imageUrl = urlCreator.createObjectURL(blobData);
  $("#resultImage").attr("src", imageUrl);
};

$('#applyLayout').click(function(){

  if(graphData !== undefined)
    processLayout();
  else
    $("#file-type").html("Please first load a valid file!");

});

$('#downloadJSON').click(function(){

  let jsonText = $("#resultText").val();

  let blob = new Blob([jsonText], {
      type: "application/json;charset=utf-8;"
  });
  
  let filename = document.getElementById("file-name").innerHTML;
  filename = filename.substring(0, filename.lastIndexOf('.')) + ".json";
  saveAs(blob, filename);

});

$('#downloadImage').click(function(){
  
  if(blobData !== undefined) {
    let filename = document.getElementById("file-name").innerHTML;
    filename = filename.substring(0, filename.lastIndexOf('.')) + "." + imageFormat;
    saveAs(blobData, filename);
  }

});

$("body").on("change", "#file-input", function (e) {
    var fileInput = document.getElementById('file-input');
    var file = fileInput.files[0];
    var reader = new FileReader();
    setFileContent(file.name);
    reader.onload = async function (e) {
        $("#file-type").html("");
        graphData = this.result;
        let isJSON = (file.type == 'application/json') ? 1 : 0;
        let isGraphML = (graphData.search("graphml") == -1) ? 0 : 1;
        let isSBGNML = (graphData.search("sbgn") == -1) ? 0 : 1;
        let isSBML = (graphData.search("sbml") == -1) ? 0 : 1;        
        if(isGraphML)
          $("#file-type").html("GraphML file is detected! <br> Now you can apply layout!");
        else if(isSBGNML)
          $("#file-type").html("SBGNML file is detected! <br> Now you can apply layout!");
        else if(isSBML)
          $("#file-type").html("SBML file is detected! <br> Now you can apply layout!");
        else if(isJSON)
          $("#file-type").html("JSON file is detected! <br> Now you can apply layout!");
        else {
          $("#file-type").html("File format is not valid! <br> Load SBGNML, SBML, GraphML or JSON.");
          graphData = undefined;
        }

    };
    reader.readAsText(file);

    $("#file-input").val(null);
});

$("#load-file").on("click", function (e) {
    $("#file-input").trigger('click');
});

// image content is base64 data and imageType is png/jpg
var saveImage = function(imageContent, imageType, fileName){  
    // see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }
    // this is to remove the beginning of the pngContent: data:img/png;base64,
    var b64data = imageContent.substr(imageContent.indexOf(",") + 1);
    var blob = b64toBlob(b64data, "image/"+imageType);
    
    return blob;
};

$("#save-as-png").on("click", function (evt) {
    var pngContent = cy.png({ scale: 3, full: true });

    saveImage(pngContent, "png", document.getElementById("file-name").innerHTML);
});

var loadSample = function (fileName) {
    let convertIt;
    function readFile() {
        $.ajaxSetup({
            async: false
        });
        jQuery.get("samples/" + fileName + ".txt", (txt) => {
            convertIt = txt;
        });
        $.ajaxSetup({
            async: true
        })
    }
    readFile();

    let isGraphML = (convertIt.search("graphml") === -1) ? 0 : 1;
    let isSBGNML = (convertIt.search("sbgn") === -1) ? 0 : 1;
    let isSBML = (convertIt.search("sbml") === -1) ? 0 : 1;    

    if (!heroku) {
        if (isGraphML)
            url = "http://localhost:" + port + "/layout/graphml?edges=true";
        else if (isSBGNML)
            url = "http://localhost:" + port + "/layout/sbgnml?edges=true"
        else if (isSBML)
            url = "http://localhost:" + port + "/layout/sbml?edges=true"          
        else
            url = "http://localhost:" + port + "/layout/json?edges=true"
    }
    else {
        if (isGraphML)
            url = "https://cytoscape-layout-service.herokuapp.com/layout/graphml?edges=true";
        else if (isSBGNML)
            url = "https://cytoscape-layout-service.herokuapp.com/layout/sbgnml?edges=true"
        else if (isSBML)
            url = "https://cytoscape-layout-service.herokuapp.com/layout/sbml?edges=true"          
        else
            url = "https://cytoscape-layout-service.herokuapp.com/layout/json?edges=true"
    }

    let options = { 
      layoutOptions: { name: "fcose" },
//      imageOptions: {
//        format: 'png',
//        quality: 85,
//        background: 'transparent',
//        width: 640,
//        height: 480
//      }
    };
    
    let graphData = convertIt;

    let data;
    if (!isGraphML && !isSBGNML && !isSBML) {
        data = [JSON.parse(graphData), options];
        data = JSON.stringify(data);
    }
    else
        data = graphData + JSON.stringify(options);

    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'content-Type': 'text/plain',
        },
        body: data
    };

    fetch(url, settings)
        .then(response => response.json())
        .then(res => {
            let els = [];
            let addIt;
            els['nodes'] = [];
            els['edges'] = [];
            
//            saveImage(res["image"], "png", document.getElementById("file-name").innerHTML);            

            Object.keys(res).forEach((obj) => {
                if (res[obj].source && res[obj].target) {
                    addIt = {
                        data: {
                            id: obj,
                            source: res[obj].source,
                            target: res[obj].target
                        }
                    }
                    els['edges'].push(addIt);
                }
                else {
                    addIt = {
                        data: {
                            id: obj,
                            clusterID: res[obj].data.clusterID,
                            width: res[obj].data.width,
                            height: res[obj].data.height,
                            parent: res[obj].data.parent
                        },
                        position: { x: res[obj].position.x, y: res[obj].position.y }
                    }
                    els['nodes'].push(addIt);
                }
            });
            cytoscapeJsGraph = els;
            refreshCytoscape(els);
            setFileContent(fileName);
        })
        .catch(e => {
            return e;
        });
};

let fcoseLayoutProp = new FCOSELayout({
    el: '#fcose-layout-table'
})

$("#layout-options").on("click", function (e) {
  let currentLayout = $('#layoutType').val();
  switch (currentLayout) {
    case 'fcose':
      fcoseLayoutProp.render();
      break;    
    case 'cose-bilkent':
      coseBilkentLayoutProp.render();
      break;
    case 'cose':
      coseLayoutProp.render();
      break;
    case 'cola':
      colaLayoutProp.render();
      break;
    case 'cise':
      ciseLayoutProp.render();
      break;
    case 'dagre':
      dagreLayoutProp.render();
      break;
    case 'klay':
      klayLayoutProp.render();
      break;
    case 'avsdf':
      avsdfLayoutProp.render();
      break;
    case 'euler':
      eulerLayoutProp.render();
      break;

  }
});
