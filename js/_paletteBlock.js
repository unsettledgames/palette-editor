let coloursList = document.getElementById("palette-list");

/** TODO:
 *      - Change palette square size when ctrl scrolling on the list
 *      - Add class to selected colour
 *      - Add current picker colours (button on the right)
 *      - Remove selected colour(s) (button on the right)
 *      - Select multiple colours
 *          - OnDragStart: save first colour, OnDragEnd: save last colour, draw an outline around the selected colours
 *          - Right click opens a menu
 *              - Reverse colours
 *              - Quantize
 *              - Create ramp
 *                  - Select colour and name for the label
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


new Sortable(document.getElementById("palette-list"), {
    animation: 100
});
