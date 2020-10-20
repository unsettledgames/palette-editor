let sliders = document.getElementsByClassName("cp-slider-entry");
let colourPreview = document.getElementById("cp-colour-preview");
let colourValue = document.getElementById("cp-hex");
let currentPickerMode = "rgb";
let styleElement = document.createElement("style");
let miniPickerCanvas = document.getElementById("cp-spectrum");
let miniPickerSlider = document.getElementById("cp-minipicker-slider");
let activePickerIcon = document.getElementById("cp-active-icon");
let startPickerIconPos = [[0,0],[0,0],[0,0],[0,0]];
let currPickerIconPos = [[0,0], [0,0],[0,0],[0,0]];
let styles = ["",""];
document.getElementsByTagName("head")[0].appendChild(styleElement);

startPickerIconPos[0] = [activePickerIcon.getBoundingClientRect().left, activePickerIcon.getBoundingClientRect().top];

// Startup updating
updateAllSliders();
// Fill minipicker
updateMiniPickerGradient();
// Fill minislider
updateMiniSlider(colourValue.value);

function updateStyles() {
    styleElement.innerHTML = styles[0] + styles[1];
}

function updateSliderValue (sliderIndex) {
    let toUpdate;
    let slider;
    let input;
    let hexColour;
    let sliderValues;

    toUpdate = sliders[sliderIndex - 1];
    
    slider = toUpdate.getElementsByTagName("input")[0];
    input = toUpdate.getElementsByTagName("input")[1];
    
    // Update label value
    input.value = slider.value;

    // Update preview colour
    // get slider values
    sliderValues = getSlidersValues();

    // Generate preview colour
    switch (currentPickerMode) {
        case 'rgb':
            hexColour = rgbToHex(sliderValues[0], sliderValues[1], sliderValues[2]);
            break;
        case 'hsv':
            let tmpRgb = hsvToRgb(sliderValues[0], sliderValues[1], sliderValues[2]);
            console.log(tmpRgb);
            hexColour = rgbToHex(parseInt(tmpRgb[0]), parseInt(tmpRgb[1]), parseInt(tmpRgb[2]));
            break;
        case 'hsl':
            hexColour = hslToHex(sliderValues[0], sliderValues[1], sliderValues[2]);
            break;
        default:
            console.log("wtf select a decent picker mode");
            return;
    }
    // Update preview colour div
    colourPreview.style.backgroundColor = '#' + hexColour;
    colourValue.value = '#' + hexColour;

    // Update sliders background
    // there's no other way than creating a custom css file, appending it to the head and
    // specify the sliders' backgrounds here

    styles[0] = '';
    for (let i=0; i<sliders.length; i++) {
        styles[0] += getSliderCSS(i + 1, sliderValues);
    }

    updateStyles();
    updatePickerByHex(colourValue.value);
}

function getSliderCSS(index, sliderValues) {
    let ret = 'input[type=range]#';
    let sliderId;
    let gradientMin;
    let gradientMax;
    let hueGradient;
    let rgbColour;

    switch (index) {
        case 1:
            sliderId = 'first-slider';
            switch (currentPickerMode) {
                case 'rgb':
                    gradientMin = 'rgba(0,' + sliderValues[1] + ',' + sliderValues[2] + ',1)';
                    gradientMax = 'rgba(255,' + sliderValues[1] + ',' + sliderValues[2] + ',1)';
                    break;
                case 'hsv':
                    hueGradient = getHueGradientHSV(sliderValues);
                    break;
                case 'hsl':
                    // Hue gradient
                    hueGradient = getHueGradientHSL(sliderValues);
                    break;
            }
            break;
        case 2:
            sliderId = 'second-slider';
            switch (currentPickerMode) {
                case 'rgb':
                    gradientMin = 'rgba(' + sliderValues[0] + ',0,' + sliderValues[2] + ',1)';
                    gradientMax = 'rgba(' + sliderValues[0] + ',255,' + sliderValues[2] + ',1)';
                    break;
                case 'hsv':
                    rgbColour = hsvToRgb(sliderValues[0], 0, sliderValues[2]);
                    gradientMin = 'rgba(' + rgbColour[0] + ',' + rgbColour[1] + ',' + rgbColour[2] + ',1)';

                    rgbColour = hsvToRgb(sliderValues[0], 100, sliderValues[2]);
                    gradientMax = 'rgba(' + rgbColour[0] + ',' + rgbColour[1] + ',' + rgbColour[2] + ',1)';
                    break;
                case 'hsl':
                    rgbColour = hslToRgb(sliderValues[0], 0, sliderValues[2]);
                    gradientMin = 'rgba(' + rgbColour[0] + ',' + rgbColour[1] + ',' + rgbColour[2] + ',1)';

                    rgbColour = hslToRgb(sliderValues[0], 100, sliderValues[2]);
                    gradientMax = 'rgba(' + rgbColour[0] + ',' + rgbColour[1] + ',' + rgbColour[2] + ',1)';
                    break;
            }
            break;
        case 3:
            sliderId = 'third-slider';
            switch (currentPickerMode) {
                case 'rgb':
                    gradientMin = 'rgba(' + sliderValues[0] + ',' + sliderValues[1] + ',0,1)';
                    gradientMax = 'rgba(' + sliderValues[0] + ',' + sliderValues[1] + ',255,1)';
                    break;
                case 'hsv':
                    rgbColour = hsvToRgb(sliderValues[0], sliderValues[1], 0);
                    gradientMin = 'rgba(' + rgbColour[0] + ',' + rgbColour[1] + ',' + rgbColour[2] + ',1)';

                    rgbColour = hsvToRgb(sliderValues[0], sliderValues[1], 100);
                    gradientMax = 'rgba(' + rgbColour[0] + ',' + rgbColour[1] + ',' + rgbColour[2] + ',1)';
                    break;
                case 'hsl':
                    gradientMin = 'rgba(0,0,0,1)';
                    gradientMax = 'rgba(255,255,255,1)';
                    break;
            }

            break;
        default:
            return '';
    }

    ret += sliderId;
    ret += '::-webkit-slider-runnable-track  {';

    switch (currentPickerMode) {
        case 'rgb':
            ret += 'background: linear-gradient(90deg, rgba(2,0,36,1) 0%, ' +
                gradientMin + ' 0%, ' + gradientMax + '100%)';
            break;
        case 'hsv':
        case 'hsl':
            ret += 'background: ';
            if (index == 1) {
                ret += hueGradient;
            }
            else { 
                ret += 'linear-gradient(90deg, rgba(2,0,36,1) 0%, ' + gradientMin + ' 0%, ';
                // For hsl I also have to add a middle point
                if (currentPickerMode == 'hsl' && index == 3) {
                    let rgb = hslToRgb(sliderValues[0], sliderValues[1], 50);
                    ret += 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',1) 50%,';
                }
                
                ret += gradientMax + '100%);';
            }
            break;
    }

    ret += '}'

    ret += ret.replace('::-webkit-slider-runnable-track', '::-moz-range-track');

    return ret;
}

function getHueGradientHSL(sliderValues) {
    return 'linear-gradient(90deg, rgba(2,0,36,1) 0%, \
    hsl(0,' + sliderValues[1] + '%,' + sliderValues[2]+ '%) 0%, \
    hsl(60,' + sliderValues[1] + '%,' + sliderValues[2]+ '%) 16.6666%, \
    hsl(120,' + sliderValues[1] + '%,' + sliderValues[2]+ '%) 33.3333333333%, \
    hsl(180,'+ sliderValues[1] + '%,' + sliderValues[2]+ '%) 50%, \
    hsl(240,' + sliderValues[1] + '%,' + sliderValues[2]+ '%) 66.66666%, \
    hsl(300,'+ sliderValues[1] + '%,' + sliderValues[2]+ '%) 83.333333%, \
    hsl(360,'+ sliderValues[1] + '%,' + sliderValues[2]+ '%) 100%);';
}
function getHueGradientHSV(sliderValues) {
    let col = hsvToRgb(0, sliderValues[1], sliderValues[2]);
    let ret = 'linear-gradient(90deg, rgba(2,0,36,1) 0%, ';

    ret += 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',1) 0%,'

    col = hsvToRgb(60, sliderValues[1], sliderValues[2]);
    ret += 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',1) 16.6666%,';

    col = hsvToRgb(120, sliderValues[1], sliderValues[2]);
    ret += 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',1) 33.3333333333%,';

    col = hsvToRgb(180, sliderValues[1], sliderValues[2]);
    ret += 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',1) 50%,';

    col = hsvToRgb(240, sliderValues[1], sliderValues[2]);
    ret += 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',1) 66.66666%,';

    col = hsvToRgb(300, sliderValues[1], sliderValues[2]);
    ret += 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',1) 83.333333%,';

    col = hsvToRgb(360, sliderValues[1], sliderValues[2]);
    ret += 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',1) 100%);';

    return ret;
}

function inputChanged(target, index) {
    let sliderIndex = index - 1;

    sliders[sliderIndex].getElementsByTagName("input")[0].value = target.value;
    updateSliderValue(index);
}

function changePickerMode(target, newMode) {
    let maxRange;
    let colArray;
    let rgbTmp;
    let hexColour = colourValue.value.replace('#', '');

    currentPickerMode = newMode;
    document.getElementsByClassName("cp-selected-mode")[0].classList.remove("cp-selected-mode");
    target.classList.add("cp-selected-mode");

    switch (newMode)
    {
        case 'rgb':
            maxRange = [255,255,255];
            sliders[0].getElementsByTagName("label")[0].innerHTML = 'R';
            sliders[1].getElementsByTagName("label")[0].innerHTML = 'G';
            sliders[2].getElementsByTagName("label")[0].innerHTML = 'B';
            break;
        case 'hsv':
            maxRange = [360, 100, 100];
            sliders[0].getElementsByTagName("label")[0].innerHTML = 'H';
            sliders[1].getElementsByTagName("label")[0].innerHTML = 'S';
            sliders[2].getElementsByTagName("label")[0].innerHTML = 'V';
            break;
        case 'hsl':
            maxRange = [360, 100, 100];
            sliders[0].getElementsByTagName("label")[0].innerHTML = 'H';
            sliders[1].getElementsByTagName("label")[0].innerHTML = 'S';
            sliders[2].getElementsByTagName("label")[0].innerHTML = 'L';
            break;
        default:
            console.log("wtf select a decent picker mode");
            break;
    }

    for (let i=0; i<sliders.length; i++) {
        let slider = sliders[i].getElementsByTagName("input")[0];

        slider.setAttribute("max", maxRange[i]);
    }

    // Putting the current colour in the new slider
    switch(currentPickerMode) {
        case 'rgb':
            colArray = hexToRgb(hexColour);
            colArray = [colArray.r, colArray.g, colArray.b];
            break;
        case 'hsv':
            rgbTmp = hexToRgb(hexColour);
            colArray = rgbToHsv(rgbTmp);

            colArray.h *= 360;
            colArray.s *= 100;
            colArray.v *= 100;

            colArray = [colArray.h, colArray.s, colArray.v];

            break;
        case 'hsl':
            rgbTmp = hexToRgb(hexColour);
            colArray = rgbToHsl(rgbTmp);

            colArray.h *= 360;
            colArray.s *= 100;
            colArray.l *= 100;

            colArray = [colArray.h, colArray.s, colArray.l];

            break;
        default:
            break;
    }

    for (let i=0; i<3; i++) {
        sliders[i].getElementsByTagName("input")[0].value = colArray[i];
    }

    updateAllSliders();
}

function getSlidersValues() {
    return [parseInt(sliders[0].getElementsByTagName("input")[0].value), 
    parseInt(sliders[1].getElementsByTagName("input")[0].value), 
    parseInt(sliders[2].getElementsByTagName("input")[0].value)];
}

function updateAllSliders() {
    for (let i=1; i<=3; i++) {
        updateSliderValue(i);
    }
}
/******************SECTION: MINIPICKER******************/

function movePickerIcon(event) {
    if (event.which == 1) {
        let cursorPos = getCursorPosMinipicker(event);
        let left = (cursorPos[0] - startPickerIconPos[0][0] - 8);
        let top = (cursorPos[1] - startPickerIconPos[0][1] - 8);
        let canvasRect = miniPickerCanvas.getBoundingClientRect();

        if (left > -8 && top > -8 && left < canvasRect.width-8 && top < canvasRect.height-8){
            activePickerIcon.style["left"] = "" + left + "px";
            activePickerIcon.style["top"]= "" + top + "px";

            currPickerIconPos[0] = [left, top];
        }

        updateMiniPickerColour();
    }
}

function updateSlidersByHex(hex) {
    let colour;
    let mySliders = [sliders[0].getElementsByTagName("input")[0], 
        sliders[1].getElementsByTagName("input")[0], 
        sliders[2].getElementsByTagName("input")[0]];

    switch (currentPickerMode) {
        case 'rgb':
            colour = hexToRgb(hex);

            mySliders[0].value = colour.r;
            mySliders[1].value = colour.g;
            mySliders[2].value = colour.b;

            break;
        case 'hsv':
            colour = rgbToHsv(hexToRgb(hex));

            mySliders[0].value = colour.h * 360;
            mySliders[1].value = colour.s * 100;
            mySliders[2].value = colour.v * 100;

            break;
        case 'hsl':
            colour = rgbToHsl(hexToRgb(hex));

            mySliders[0].value = colour.h * 360;
            mySliders[1].value = colour.s * 100;
            mySliders[2].value = colour.l * 100;

            break;
        default:
            break;
    }

    updateAllSliders();
}

function getCursorPosMinipicker(e) {
    var x;
    var y;
    
    if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;			
    }

    x -= miniPickerCanvas.offsetLeft;
    y -= miniPickerCanvas.offsetTop;

    return [Math.round(x), Math.round(y)];
}

function updatePickerByHex(hex) {

}

function miniSliderInput(event) {
    let newHex;
    let newHsv = rgbToHsv(hexToRgb(getMiniPickerColour()));
    let rgb;

    console.log(newHsv);    
    // Adding slider value to value
    newHsv.v = parseInt(event.target.value);
    // Updating hex
    rgb = hsvToRgb(newHsv.h * 360, newHsv.s * 100, newHsv.v);
    newHex = rgbToHex(Math.round(rgb[0]), Math.round(rgb[1]), Math.round(rgb[2]));

    colourValue.value = newHex;

    updateMiniPickerGradient();
    updateMiniPickerColour();
}

function updateMiniPickerColour() {
    let hex = getMiniPickerColour();

    activePickerIcon.style.backgroundColor = '#' + hex;

    // Update hex and sliders based on hex
    colourValue.value = '#' + hex;
    colourPreview.style.backgroundColor = '#' + hex;

    updateSlidersByHex(hex);
    updateMiniSlider(hex);
}

function getMiniPickerColour() {
    let hex;
    let pickedColour;

    pickedColour = miniPickerCanvas.getContext('2d').getImageData(currPickerIconPos[0][0] + 8, currPickerIconPos[0][1] + 8, 1, 1).data;
    hex = rgbToHex(pickedColour[0], pickedColour[1], pickedColour[2]);

    return hex;
}

function updateMiniSlider(hex) {
    let rgb = hexToRgb(hex);
    console.log("sus");

    styles[1] = "input[type=range]#cp-minipicker-slider::-webkit-slider-runnable-track { background: rgb(2,0,36);";
    styles[1] += "background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(0,0,0,1) 0%, " +
    "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",1) 100%);}";

    updateStyles();
}

function updateMiniPickerGradient() {
    let ctx = miniPickerCanvas.getContext('2d');
    let hsv = rgbToHsv(hexToRgb(colourValue.value));
    let tmp;

    ctx.clearRect(0, 0, miniPickerCanvas.width, miniPickerCanvas.height);

    // Drawing hues
    var hGrad = ctx.createLinearGradient(0, 0, miniPickerCanvas.width, 0);

    for (let i=0; i<7; i++) {
        tmp = hsvToRgb(60 * i, 100, hsv.v * 100);
        hGrad.addColorStop(i / 6, '#' + rgbToHex(Math.round(tmp[0]), Math.round(tmp[1]), Math.round(tmp[2])));

        console.log("" + i / 6);
    }
    ctx.fillStyle = hGrad;
    ctx.fillRect(0, 0, miniPickerCanvas.width, miniPickerCanvas.height);

    // Drawing sat / lum
    var vGrad = ctx.createLinearGradient(0, 0, 0, miniPickerCanvas.height);
    vGrad.addColorStop(0, 'rgba(255,255,255,0)');
    vGrad.addColorStop(0.1, 'rgba(255,255,255,0)');
    vGrad.addColorStop(0.9, 'rgba(255,255,255,1)');
    vGrad.addColorStop(1, 'rgba(255,255,255,1)');
    
    ctx.fillStyle = vGrad;
    ctx.fillRect(0, 0, miniPickerCanvas.width, miniPickerCanvas.height);
}

/** COSE DA FARE: 
 *  - minislider deve prendere input da minipicker
 *  - slider principali devono modificare posizione del minipicker e valori hsv del minipicker
 *  - muovere cursore minipicker quando si camba il colore
 *      - Convertire hex -> rgb -> hsv e spostare il minipicker di conseguenza
 */