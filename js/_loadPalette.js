//this is called when a user picks a file after selecting "load palette" from the file dialogue
// TODO: adapt to palette editor

document.getElementById('load-palette-browse-holder').addEventListener('change', function () {
    if (this.files && this.files[0]) {

        //make sure file is allowed filetype
        var fileContentType = this.files[0].type;
        if (fileContentType == 'image/png' || fileContentType == 'image/gif') {

            //load file
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                var img = new Image();
                img.onload = function() {

                    //draw image onto the temporary canvas
                    var loadPaletteCanvas = document.getElementById('load-palette-canvas-holder');
                    var loadPaletteContext = loadPaletteCanvas.getContext('2d');

                    loadPaletteCanvas.width = img.width;
                    loadPaletteCanvas.height = img.height;

                    loadPaletteContext.drawImage(img, 0, 0);

                    //create array to hold found colors
                    var colorPalette = [];
                    var imagePixelData = loadPaletteContext.getImageData(0,0,this.width, this.height).data;

                    console.log(imagePixelData);

                    //loop through pixels looking for colors to add to palette
                    for (var i = 0; i < imagePixelData.length; i += 4) {
                        var color = '#'+rgbToHex(imagePixelData[i],imagePixelData[i + 1],imagePixelData[i + 2]);
                        if (colorPalette.indexOf(color) == -1) {
                            colorPalette.push(color);
                        }
                    }

                    //add to palettes so that it can be loaded when they click okay
                    palettes['Loaded palette'] = {};
                    palettes['Loaded palette'].colors = colorPalette;
                    setText('palette-button', 'Loaded palette');
                };
                img.src = e.target.result;
            };
            fileReader.readAsDataURL(this.files[0]);
        }
        else alert('Only PNG and GIF files are supported at this time.');
    }
});
