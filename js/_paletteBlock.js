let coloursList = document.getElementById("palette-list");
let currentSquareSize = coloursList.children[0].clientWidth;

new Sortable(document.getElementById("palette-list"), {
    animation: 100
});

/** Listens for the mouse wheel, used to change the size of the squares in the palette list
 * 
 */
coloursList.parentElement.addEventListener("wheel", function (mouseEvent) {
    // Only resize when pressing alt, used to distinguish between scrolling through the palette and
    // resizing it
    if (mouseEvent.altKey) {
        resizeSquares(mouseEvent);
    }
});

/** Tells whether a colour is in the palette or not
 * 
 * @param {*} colour The colour to add
 */ 
function hasColour(colour) {
    for (let i=0; i<coloursList.childElementCount; i++) {
        
        let currentCol = coloursList.children[i].style.backgroundColor;
        let currentHex = cssToHex(currentCol);

        console.log(colour + ", " + currentHex);

        if (currentHex == colour) {
            return true;
        }
    }
    return false;
}


/** Adds a single colour to the palette
 * 
 * @param {*} colour The colour to add
 */
function addSingleColour(colour) {
    if (!hasColour(colour)) {
        let li = document.createElement("li");

        li.style.width = currentSquareSize + "px";
        li.style.height = currentSquareSize + "px";
        li.style.backgroundColor = colour;

        coloursList.appendChild(li);
    }
}

/** Adds all the colours currently selected in the colour picker
 * 
 */
function addColours() {
    // TODO: check that colour is not already in the palette
    let colours = getSelectedColours();
    
    for (let i=0; i<colours.length; i++) {
        addSingleColour(colours[i]);
    }
}




/** TODO:
 *      - Select multiple colours
 *          - OnDragStart: save first colour, OnDragEnd: save last colour, draw an outline around the selected colours
 *          - Right click opens a menu
 *              - Reverse colours
 *              - Quantize
 *              - Create ramp
 *                  - Select colour and name for the label
 *      - Add class to selected colour
 *      - Remove selected colour(s) (button on the right)
 *      - Gradient between two colours
 *      - Sort colours by
 *          - Ramps (see C# palette sorter)
 *          - Value
 *          - Luminosity
 *      - Detect ramps, let users highlight ramps
 *      - Detect similar colours and warn the user (who can dismiss the warnings)
 *          - Add a warning button to click on in order to read the description and to dismiss it
 *      - Quantize colours (button on the right, menu to do it smartly or not)
 *      - Smartly reduce number of colours
 *          - Search for colours that can be safely deleted
 *          - If the user wants to delete more colours, quantize the rest
 * 
 * UTILITY FUNCTIONS:
 *      - Update picker with selected colour
 *      - Edit colour (edits the current square without having to delete it and add it back)
 *      - Update all outlines (fired on the palette resizing)
 *      - See if a colour is the first one or the last one in a row (used to draw the outline)
 *          - Keep size data 
 *          - Get square relative position
 */



function resizeSquares(mouseEvent) {
    let amount = mouseEvent.deltaY > 0 ? -5 : 5;
    currentSquareSize += amount;

    for (let i=0; i<coloursList.childElementCount; i++) {
        let currLi = coloursList.children[i];

        coloursList.children[i].style.width = coloursList.children[i].clientWidth + amount + "px";
        coloursList.children[i].style.height = coloursList.children[i].clientHeight + amount + "px";
    }
}


function cssToHex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}