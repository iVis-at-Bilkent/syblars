heroku = !(location.hostname === "localhost");

///////////////////// LOAD & SAVE //////////////////////////////

let graphData; // data read from the file
let blobData; // blob data for image
let imageFormat;

let setFileContent = function (fileName) {
    let span = document.getElementById('file-name');
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

    let jsonText = JSON.stringify(save, null, 4);

    let blob = new Blob([jsonText], {
        type: "application/json;charset=utf-8;",
    });
    let filename = "" + new Date().getTime() + ".json";
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
    case 'cola':
      layoutOptions = colaLayoutProp.getProperties();
      break;
    case 'cise':
      layoutOptions = ciseLayoutProp.getProperties();
      break;
    case 'dagre':
      layoutOptions = dagreLayoutProp.getProperties();
      break;
    case 'klay':
      layoutOptions = klayLayoutProp.getProperties();
      break;
    case 'avsdf':
      layoutOptions = avsdfLayoutProp.getProperties();
      break;
  }

  let options = {
    layoutOptions: layoutOptions,
    imageOptions: {
      format: imageFormat,
      background: $('#imageBackground').val(),
      width: parseInt($('#imageWidth').val()),
      height: parseInt($('#imageHeight').val()),
      color: $('#colorScheme').attr("disabled") ? $('#color').val() : $('#colorScheme').val()
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

  $("#applyLayout").removeClass("loading");
  $("#applyLayout").css("background-color", "#d67664");
  // get layout info
  $("#resultText").val(JSON.stringify(res.layout, null, 2));
  
  // get image info
  blobData = saveImage(res["image"], imageFormat, document.getElementById("file-name").innerHTML);
  let urlCreator = window.URL || window.webkitURL;
  let imageUrl = urlCreator.createObjectURL(blobData);
  $("#imageArea").css("height", parseInt($('#imageHeight').val()) / (parseInt($('#imageWidth').val()) / parseInt($('#imageArea').css('width'))));
  $("#resultImage").attr("src", imageUrl);
};

$('#applyLayout').click(function(){

  if(graphData !== undefined) {
    processLayout();
    $("#applyLayout").addClass("loading");
    $("#applyLayout").css("background-color", "#f2711c");
  }
  else {
    $("#file-type").html("Please first load a valid file!");
  }

});

$('#downloadJSON').click(function(){

  let jsonText = $("#resultText").val();

  if(jsonText != "") {
    let blob = new Blob([jsonText], {
        type: "application/json;charset=utf-8;"
    });

    let filename = document.getElementById("file-name").innerHTML;
    filename = filename.substring(0, filename.lastIndexOf('.')) + ".json";
    saveAs(blob, filename);
  }
  
});

$('#downloadImage').click(function(){
  
  if(blobData !== undefined) {
    let filename = document.getElementById("file-name").innerHTML;
    filename = filename.substring(0, filename.lastIndexOf('.')) + "." + imageFormat;
    saveAs(blobData, filename);
  }

});

$("body").on("change", "#file-input", function (e, fileObject) {
    let fileInput = document.getElementById('file-input');
    let file = fileInput.files[0] || fileObject;
    let reader = new FileReader();
    setFileContent(file.name);
    reader.onload = async function (e) {
        $("#file-type").html('');
        if(!fileObject)
          $("#sampleType").val('');
        graphData = this.result;
        let isJSON = (file.type == 'application/json') ? 1 : 0;
        let isGraphML = (graphData.search("graphml") == -1) ? 0 : 1;
        let isSBGNML = (graphData.search("sbgn") == -1) ? 0 : 1;
        let isSBML = (graphData.search("sbml") == -1) ? 0 : 1;        
        if(isGraphML) {
          $("#file-type").html("GraphML file is detected! <br> Now you can apply layout.");
          $("#colorScheme").attr("disabled", true);
          $("#color").attr("disabled", false);
          $("#svgRadio").attr("disabled", false);
        }
        else if(isSBGNML) {
          $("#file-type").html("SBGNML file is detected! <br> Now you can apply layout.");
          $("#colorScheme").attr("disabled", false);
          $("#color").attr("disabled", true);
          $("#svgRadio").attr("disabled", true);
          $("#pngRadio").prop("checked", true);
        }
        else if(isSBML) {
          $("#file-type").html("SBML file is detected! <br> Now you can apply layout.");
          $("#colorScheme").attr("disabled", true);
          $("#color").attr("disabled", false);
          $("#svgRadio").attr("disabled", false);
        }
        else if(isJSON) {
          $("#file-type").html("JSON file is detected! <br> Now you can apply layout.");
          $("#colorScheme").attr("disabled", true);
          $("#color").attr("disabled", false);
          $("#svgRadio").attr("disabled", false);
        }
        else {
          $("#file-type").html("File format is not valid! <br> Load SBGNML, SBML, GraphML or JSON.");
          $("#colorScheme").attr("disabled", true);
          $("#color").attr("disabled", false);
          $("#svgRadio").attr("disabled", false);
          $("#resultText").val("");
          $("#resultImage").attr("src", null);
          graphData = undefined;
        }
        $("#resultText").val("");
        $("#resultImage").attr("src", null);
        blobData = undefined;        
    };
    reader.readAsText(file);

    $("#file-input").val(null);
});

$("#load-file").on("click", function (e) {
    $("#file-input").trigger('click');
});

$("#informationModal").on("click", function (e) {
   $('#information-modal').modal({inverted: true}).modal('show');
});

// image content is base64 data and imageType is png/jpg
let saveImage = function(imageContent, imageType, fileName){  
    // see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        let byteCharacters = atob(b64Data);
        let byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);

            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            let byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        let blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }
    
    let blob;
    if(imageType == "svg") {
      blob = new Blob([imageContent], {type:"image/svg+xml;charset=utf-8"}); 
    }
    else {
      // this is to remove the beginning of the pngContent: data:img/png;base64,
      let b64data = imageContent.substr(imageContent.indexOf(",") + 1);
      blob = b64toBlob(b64data, "image/"+imageType);      
    }
    
    return blob;
};

$("#save-as-png").on("click", function (evt) {
    let pngContent = cy.png({ scale: 3, full: true });

    saveImage(pngContent, "png", document.getElementById("file-name").innerHTML);
});

let fcoseLayoutProp = new FCOSELayout({
    el: '#fcose-layout-table'
});

let colaLayoutProp = new COLALayout({
    el: '#cola-layout-table'
});

let ciseLayoutProp = new CISELayout({
    el: '#cise-layout-table'
});

let dagreLayoutProp = new DAGRELayout({
    el: '#dagre-layout-table'
});

let klayLayoutProp = new KLAYLayout({
    el: '#klay-layout-table'
});

let avsdfLayoutProp = new AVSDFLayout({
    el: '#avsdf-layout-table'
});

$("#layout-options").on("click", function (e) {
  let currentLayout = $('#layoutType').val();
  switch (currentLayout) {
    case 'fcose':
      fcoseLayoutProp.render();
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
  }
});

function loadXMLDoc(fileName) {
	let xhttp;
  if (window.XMLHttpRequest) {
    xhttp = new XMLHttpRequest();
  }
  else // for IE 5/6
  {
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhttp.open("GET", fileName, false);
  xhttp.send();
  return xhttp.response;
}

function loadSample(fileName){
	let xmlResponse = loadXMLDoc(fileName);
  let fileObj;
  
  if(fileName.split('.').pop() == 'json') {
    fileObj = new File([xmlResponse], fileName, {
      type: "application/json"
    });
  }
  else {
    fileObj = new File([xmlResponse], fileName, {
      type: ""
    });
  }

	return fileObj;
}

$("#sampleType").change(function() {
  let currentSample = $('#sampleType').val();
  let graph = loadSample("samples/" + currentSample);
  console.log(graph);
  $("#file-input").trigger("change", [graph]);
  document.getElementById("file-name").innerHTML = currentSample;
});
