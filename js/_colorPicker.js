let sliders = document.getElementsByClassName("cp-slider-entry");
let colourPreview = document.getElementById("cp-colour-preview");
let colourValue = document.getElementById("cp-hex");
let currentPickerMode = "rgb";
let styleElement = document.createElement("style");
document.getElementsByTagName("head")[0].appendChild(styleElement);

/**
 * - Update label values
 * - Update sliders background
 * - Update minipicker
 * - Update hex
 * 
 * - Function to get colour
 * -
 */

function updateSliderValue (sliderIndex) {
    let toUpdate;
    let slider;
    let input;
    let hexColour;
    let sliderValues;

    if (sliderIndex < 4) {
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

        styleElement.innerHTML = '';
        for (let i=0; i<sliders.length; i++) {
            styleElement.innerHTML += getSliderCSS(i + 1, sliderValues);
        }
    }
    else {
        toUpdate = document.getElementById("cp-hue-picker");
    }
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
                    rgbColour = hslToRgb(sliderValues[0], sliderValues[1], 0);
                    gradientMin = 'rgba(' + rgbColour[0] + ',' + rgbColour[1] + ',' + rgbColour[2] + ',1)';

                    rgbColour = hslToRgb(sliderValues[0], sliderValues[1], 100);
                    gradientMax = 'rgba(' + rgbColour[0] + ',' + rgbColour[1] + ',' + rgbColour[2] + ',1)';
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
                ret += 'linear-gradient(90deg, rgba(2,0,36,1) 0%, ' +
                gradientMin + ' 0%, ' + gradientMax + '100%);';
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

    currentPickerMode = newMode;
    // TODO: when changing mode leave the current colour

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
}

function getSlidersValues() {
    return [parseInt(sliders[0].getElementsByTagName("input")[0].value), 
    parseInt(sliders[1].getElementsByTagName("input")[0].value), 
    parseInt(sliders[2].getElementsByTagName("input")[0].value)];
}