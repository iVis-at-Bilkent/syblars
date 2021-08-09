# SyBLaRS

**Systems Biology Layout & Rendering Service (SyBLaRS)** is a web service to lay out graphs in SBGNML, SBML, GraphML and JSON formats and produce corresponding images of the layouts in the backend.

SyBLaRS is distributed under the [MIT License](https://github.com/iVis-at-Bilkent/syblars/blob/main/LICENSE).
A sample server deployment along with a simple client-side demo can be found [here](https://cytoscape-ivis-layout-service.herokuapp.com/).

### Setup the server

In order to deploy and run a local instance of the server, please follow the steps below:

- Installation
```
git clone https://github.com/iVis-at-Bilkent/syblars.git
cd syblars
npm install 
```

- Starting server (default port is 3000, you can change it by setting 'port' environment variable)
```
npm run dev
```

### Supported formats
SyBLaRS supports the following input formats for graphs:
[SBGNML](https://github.com/sbgn/sbgn/wiki/SBGN_ML),
[SBML](http://sbml.org/Main_Page),
[GraphML](http://graphml.graphdrawing.org/),
[JSON](https://www.json.org/)

### Supported layouts
The supported graph layout algorithms are:
[fCoSE](https://github.com/iVis-at-Bilkent/cytoscape.js-fcose/tree/unstable),
[CoLa](https://github.com/cytoscape/cytoscape.js-cola),
[CiSE](https://github.com/iVis-at-Bilkent/cytoscape.js-cise/tree/develop),
[Dagre](https://github.com/cytoscape/cytoscape.js-dagre),
[Klay](https://github.com/cytoscape/cytoscape.js-klay),
[Avsdf](https://github.com/iVis-at-Bilkent/cytoscape.js-avsdf)
and Cytoscape.js layouts listed [here](https://js.cytoscape.org/#layouts)

## Usage

Request to layout the graph:
```
POST /layout/:file_format   // file_format: sbgnml, sbml, graphml, json
```
needs to be sent to server address, and the type of the request must be 'text' or 'text/plain'.
By default, nodes with their positions (x,y) and their dimensions (width, height) will be returned. If you want edges to be returned as well, you should set 'edges' option to the request, which is false by default:
```
POST /layout/:file_format?edges=true
```
Request body needs to be formed in the following way:

If file content is in JSON format:
```
body: JSON.stringfy([JSON.parse(file_content), options])
```
If file content is in other formats:
```
body: file_content + JSON.stringfy(options)
```
where `options` is an object consists of `layoutOptions` and `imageOptions`:
```
options = {
  layoutOptions: {
    name: 'fcose',
    nodeDimensionsIncludeLabels: true,
    ...
  },
  imageOptions: {
    format: 'png',          // output format
    background: '#ffffff',  // background color
    width: 1080,            // desired width
    height: 720,            // desired height
    color: #9ecae1          // node color
  }
}
```
For supported layout options, you can check documentations of the supported layout algorithms. Image options support three output formats: `png`, `jpg` and `svg`. `color` attribute should be a hex color code for SBML, GraphML and JSON formats, and one of the following predefined color schemes for SBGNML format: `bluescale`, `greyscale`, `red_blue`, `green_brown`, `purple_brown`, `purple_green`, `grey_red`, `black_white`.

After the request is sent, the server will layout the given graph and return layout information in JSON format that contains node ids and their corresponding positions and dimensions and image information in `base64uri` encoding for `png` and`jpg` formats and in `xml` for `svg` format.
If an error occurs, the response of the server will consist of the error's body.

## Credits

SyBLaRS is mainly developed based on [Cytoscape.js](https://js.cytoscape.org) and its extensions (see package.json file).

Icons in client demo made by [Freepik](http://www.freepik.com) and licensed with 
[Creative Commons BY 3.0](http://creativecommons.org/licenses/by/3.0/)

Third-party libraries used in web service:
[sbgnml-to-cytoscape](https://www.npmjs.com/package/sbgnml-to-cytoscape),
[cytoscape-sbgn-stylesheet](https://github.com/iVis-at-Bilkent/cytoscape-sbgn-stylesheet),
[cytosnap](https://github.com/iVis-at-Bilkent/cytosnap),
[libsbmljs](https://libsbmljs.github.io),
[express](https://www.npmjs.com/package/express),
[cors](https://www.npmjs.com/package/cors),
[jQuery](https://www.npmjs.com/package/jquery),
[jsdom](https://www.npmjs.com/package/jsdom),
[nodemon](https://www.npmjs.com/package/nodemon),
[jest](https://www.npmjs.com/package/jest),
[super-test](https://www.npmjs.com/package/supertest)

Third-party libraries used in client demo:
[Semantic UI](https://semantic-ui.com),
[underscore.js](https://underscorejs.org),
[backbone.js](https://backbonejs.org),
[FileSaver.js](https://github.com/eligrey/FileSaver.js/)

## Team

  * [Hasan Balci](https://github.com/hasanbalci), [Perman Atayev](https://github.com/PermanAtayev) and [Ugur Dogrusoz](https://github.com/ugurdogrusoz) of [i-Vis at Bilkent University](http://www.cs.bilkent.edu.tr/~ivis).
