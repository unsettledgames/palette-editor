let firstColor, secondColor;
// I'm pretty sure that precision is necessary
let referenceWhite = {x: 95.05, y: 100, z: 108.89999999999999};
let log = document.getElementById("log");

document.getElementById("color1").addEventListener("change", updateColor);
document.getElementById("color2").addEventListener("change", updateColor);

function updateColor(e) {
    console.log(e);

    switch (e.target.id) {
        case "color1":
            firstColor = e.target.value;
            break;
        case "color2":
            secondColor = e.target.value;
            break;
        default:
            break;
    }

    updateWarnings();
}

function updateWarnings() {
    let toSet = "";

    toSet += similarColours(firstColor, secondColor) + '\n';

    log.innerHTML = toSet;
}

// Distance based on CIEDE2000 (https://en.wikipedia.org/wiki/Color_difference#CIEDE2000)
function similarColours() {
    let first = RGBtoCIELAB(hexToRgb(firstColor));
    let second = RGBtoCIELAB(hexToRgb(secondColor));

    let deltaL = second.L - first.L;
    let meanL = (first.L + second.L) / 2;
    let c1 = Math.sqrt(first.a * first.a + first.b * first.b);
    let c2 = Math.sqrt(second.a * second.a + second.b * second.b);
    let meanC = (c1 + c2) / 2;  
    let deltaC = c1 - c2;
    let aFirst1 = first.a + first.a / 2 * (1 - Math.sqrt(Math.pow(meanC, 7) / (Math.pow(meanC, 7) + Math.pow(25, 7))));
    let aFirst2 = second.a + second.a / 2 * (1 - Math.sqrt(Math.pow(meanC, 7) / (Math.pow(meanC, 7) + Math.pow(25, 7))));
    let cFirst1 = Math.sqrt(aFirst1 * aFirst1 + first.b * first.b);
    let cFirst2 = Math.sqrt(aFirst2 * aFirst2 + second.b * second.b);
    let meanCFirst = (cFirst1 + cFirst2) / 2;


    // Sei rimasto al calcolo di h'

    return "";
}

function RGBtoCIELAB(rgbColour) {
    // Convert to XYZ first via matrix transformation
    let x = 0.412453 * rgbColour.r + 0.357580 * rgbColour.g + 0.180423 * rgbColour.b;
    let y = 0.212671 * rgbColour.r + 0.715160 * rgbColour.g + 0.072169 * rgbColour.b;
    let z = 0.019334 * rgbColour.r + 0.119193 * rgbColour.g + 0.950227 * rgbColour.b;

    let xFunc = CIELABconvF(x / referenceWhite.x);
    let yFunc = CIELABconvF(y / referenceWhite.y);
    let zFunc = CIELABconvF(z / referenceWhite.z);

    let myL = 116 * yFunc - 16;
    let myA = 500 * (xFunc - yFunc);
    let myB = 200 * (yFunc - zFunc);

    return {L: myL, a: myA, b: myB};

}

function CIELABconvF(value) {
    if (value > Math.pow(6/29, 3)) {
        return Math.cbrt()
    }

    return 1/3 * Math.pow(6/29, 2) * value + 4/29;
}
