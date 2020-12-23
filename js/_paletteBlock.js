let coloursList = document.getElementById("palette-list");
let currentSquareSize = coloursList.children[0].clientWidth;
let blockData = {blockWidth: 500, blockHeight: 200, squareSize: 50};
let isRampSelecting = false;
let ramps = [];
let currentSelection = {startIndex:0, endIndex:0, startCoords:[], endCoords: [], name: "", color: ""};

// Making the palette list sortable
new Sortable(document.getElementById("palette-list"), {
    animation: 100
});

// Listening for the palette block resize
new ResizeObserver(updateSizeData).observe(coloursList.parentElement);

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
        li.addEventListener("mousedown", startRampSelection);
        li.addEventListener("mouseup", endRampSelection);
        li.addEventListener("mousemove", updateRampSelection);

        coloursList.appendChild(li);
    }
}

/** Adds all the colours currently selected in the colour picker
 * 
 */
function addColours() {
    let colours = getSelectedColours();
    
    for (let i=0; i<colours.length; i++) {
        addSingleColour(colours[i]);
    }
}

/** Removes all the currently selected colours from the palette
 * 
 */
function removeColours() {
    let startIndex = currentSelection.startIndex;
    let endIndex = currentSelection.endIndex;

    if (startIndex > endIndex) {
        let tmp = startIndex;
        startIndex = endIndex;
        endIndex = tmp;
    }

    for (let i=startIndex; i<=endIndex; i++) {
        coloursList.removeChild(coloursList.children[startIndex]);
    }
    clearBorders();

    // TODO: make it so that ramps update correctly (change start and end indexes if necessary)
}

/** Starts selecting a ramp. Saves the data needed to draw the outline.
 * 
 * @param {*} mouseEvent 
 */
function startRampSelection(mouseEvent) {
    if (mouseEvent.which == 3) {
        let index = getElementIndex(mouseEvent.target);

        isRampSelecting = true;
        currentSelection.startIndex = index;
        currentSelection.endIndex = index;
    }
}

function updateRampSelection(mouseEvent) {
    if (mouseEvent != null && mouseEvent.which == 3) {
        currentSelection.endIndex = getElementIndex(mouseEvent.target);
    }
    
    if (mouseEvent == null || mouseEvent.which == 3) {
        let startCoords = getColourCoordinates(currentSelection.startIndex);
        let endCoords = getColourCoordinates(currentSelection.endIndex);

        let startIndex = currentSelection.startIndex;
        let endIndex = currentSelection.endIndex;

        if (currentSelection.startIndex > endIndex) {
            let tmp = startIndex;
            startIndex = endIndex;
            endIndex = tmp;

            tmp = startCoords;
            startCoords = endCoords;
            endCoords = tmp;
        }

        clearBorders();

        for (let i=startIndex; i<=endIndex; i++) {
            let currentSquare = coloursList.children[i];
            let currentCoords = getColourCoordinates(i);
            let borderStyle = "4px solid white";
            let bordersToSet = [];        

            // Deciding which borders to use to make the outline
            if (i == 0 || i == startIndex) {
                bordersToSet.push("border-left");
            }
            if (currentCoords[1] == startCoords[1] || ((currentCoords[1] == startCoords[1] + 1)) && currentCoords[0] < startCoords[0]) {
                bordersToSet.push("border-top");
            }
            if (currentCoords[1] == endCoords[1] || ((currentCoords[1] == endCoords[1] - 1)) && currentCoords[0] > endCoords[0]) {
                bordersToSet.push("border-bottom");
            }
            if ((i == coloursList.childElementCount - 1) || (currentCoords[0] == Math.floor(blockData.blockWidth / blockData.squareSize) - 1) 
                || i == endIndex) {
                bordersToSet.push("border-right");
            }
            if (bordersToSet != []) {
                console.log("qui");
                currentSquare.style["box-sizing"] = "border-box";

                for (let i=0; i<bordersToSet.length; i++) {
                    currentSquare.style[bordersToSet[i]] = borderStyle;
                }
            }
        }
    }
}
function clearBorders() {
    for (let i=0; i<coloursList.childElementCount; i++) {
        // Resetting borders
        coloursList.children[i].style["border-top"] = "none";
        coloursList.children[i].style["border-left"] = "none";
        coloursList.children[i].style["border-right"] = "none";
        coloursList.children[i].style["border-bottom"] = "none";
    }
}

function endRampSelection(mouseEvent) {
    if (mouseEvent.which == 3) {
        isRampSelecting = false;
    }
}

function getElementIndex(element) {
    for (let i=0; i<coloursList.childElementCount; i++) {
        if (element == coloursList.children[i]) {
            return i;
        }
    }

    alert("Couldn't find the selected colour");
}

/** TODO:
 *      - Select multiple colours
 *          - Right click opens a menu
 *              - Reverse colours
 *              - Quantize
 *              - Gradient between two colours
 *              - Create ramp
 *                  - Select colour and name for the label
 *      - Add class to selected colour
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
 */

 function updateSizeData() {
    blockData.blockHeight = coloursList.parentElement.clientHeight;
    blockData.blockWidth = coloursList.parentElement.clientWidth;
    blockData.squareSize = coloursList.children[0].clientWidth;

    updateRampSelection();
 }

 function getColourCoordinates(index) {
    let yIndex = Math.floor(index / Math.floor(blockData.blockWidth / blockData.squareSize));
    let xIndex = Math.floor(index % Math.floor(blockData.blockWidth / blockData.squareSize));

    return [xIndex, yIndex];
 }


function resizeSquares(mouseEvent) {
    let amount = mouseEvent.deltaY > 0 ? -5 : 5;
    currentSquareSize += amount;

    for (let i=0; i<coloursList.childElementCount; i++) {
        let currLi = coloursList.children[i];

        currLi.style["box-sizing"] = "content-box";
        currLi.style.width = currLi.clientWidth + amount + "px";
        currLi.style.height = currLi.clientHeight + amount + "px";
    }

    updateSizeData();
}


function cssToHex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}