# SyBLaRS - Test
This branch is to show how SyBLaRS can be used to generate images from a graph dataset serially.
* ***model-dataset*** folder consists of 100 randomly selected SBML model files from [BioModels](https://www.ebi.ac.uk/biomodels/) dataset.  
* ***generate-image.js*** script reads each file in the *model-dataset* folder one by one, sends them to the SyBLaRS and saves the resulting images to the *model-images* folder. 
Follow these steps to run the script: 
    * Start a local instance of the service on port 3000 (```localhost:3000```).
    * Download folders/files in this (*test*) branch and ```cd``` into it.
    * Run ```npm install``` comment to install dependencies.
    * Run ```node generate-images.js``` to start generating images.
    * Resulting images will be saved in the *model-images* folder.
