// UTILITY

let firstColor = "#000000", secondColor = "#000000";
let log = document.getElementById("log");

// CONSTS

// Degrees to radiants
let degreesToRad = Math.PI / 180;
// I'm pretty sure that precision is necessary
let referenceWhite = {x: 95.05, y: 100, z: 108.89999999999999};

// COLOUR SIMILARITY

// Min distance under which 2 colours are considered similar
let distanceThreshold = 10;

// Threshold used to consider a colour "dark"
let darkColoursThreshold = 50;
// Threshold used to tell if 2 dark colours are similar
let darkColoursSimilarityThreshold = 40;

// Threshold used to consider a colour "light"
let lightColoursThreshold = 190;
// Threshold used to tell if 2 light colours are similar
let lightColoursSimilarityThreshold = 30;


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
    console.log("colors: " + firstColor + ", " + secondColor);
    toSet += similarColours(firstColor, secondColor) ? 'Colours are similar!' + '\n' : "";

    log.innerHTML = toSet;
}

function similarColours(c1, c2) {
    let c1RGB = hexToRgb(c1);
    let c2RGB = hexToRgb(c2);
    let ret = differenceCiede2000(c1RGB, c2RGB)

    console.log(ret);

    return (ret < distanceThreshold && lightColoursCheck(c1RGB, c2RGB)) || darkColoursCheck(c1RGB, c2RGB);
}

function lightColoursCheck(c1, c2) {
    let rDelta = Math.abs(c1.r - c2.r);
    let gDelta = Math.abs(c1.g - c2.g);
    let bDelta = Math.abs(c1.b - c2.b);

    // Checking only if the colours are dark enough
    if (c1.r > lightColoursThreshold && c1.g > lightColoursThreshold && c1.b > lightColoursThreshold &&
        c2.r > lightColoursThreshold && c2.g > lightColoursThreshold && c2.b > lightColoursThreshold) {
            return rDelta < lightColoursSimilarityThreshold && gDelta < lightColoursSimilarityThreshold &&
                   bDelta < lightColoursSimilarityThreshold;
        }

    return true;
}

function darkColoursCheck(c1, c2) {
    let rDelta = Math.abs(c1.r - c2.r);
    let gDelta = Math.abs(c1.g - c2.g);
    let bDelta = Math.abs(c1.b - c2.b);

    // Checking only if the colours are dark enough
    if (c1.r < darkColoursThreshold && c1.g < darkColoursThreshold && c1.b < darkColoursThreshold &&
        c2.r < darkColoursThreshold && c2.g < darkColoursThreshold && c2.b < darkColoursThreshold) {
            return rDelta < darkColoursSimilarityThreshold && gDelta < darkColoursSimilarityThreshold &&
                   bDelta < darkColoursSimilarityThreshold;
        }

    return false;
}

// Distance based on CIEDE2000 (https://en.wikipedia.org/wiki/Color_difference#CIEDE2000)
function differenceCiede2000(c1, c2) {
    var kL = 1, kC = 1, kH = 0.9;
    var LabStd = RGBtoCIELAB(c1);
    var LabSmp = RGBtoCIELAB(c2);

    var lStd = LabStd.l;
    var aStd = LabStd.a;
    var bStd = LabStd.b;
    var cStd = Math.sqrt(aStd * aStd + bStd * bStd);

    var lSmp = LabSmp.l;
    var aSmp = LabSmp.a;
    var bSmp = LabSmp.b;
    var cSmp = Math.sqrt(aSmp * aSmp + bSmp * bSmp);

    var cAvg = (cStd + cSmp) / 2;
    
    var G = 0.5 * (1 - Math.sqrt(Math.pow(cAvg, 7) / (Math.pow(cAvg, 7) + Math.pow(25, 7))));

    var apStd = aStd * (1 + G);
    var apSmp = aSmp * (1 + G);
    
    var cpStd = Math.sqrt(apStd * apStd + bStd * bStd);
    var cpSmp = Math.sqrt(apSmp * apSmp + bSmp * bSmp);
    
    var hpStd = Math.abs(apStd) + Math.abs(bStd) === 0 ? 0 : Math.atan2(bStd, apStd);
        hpStd += (hpStd < 0) * 2 * Math.PI;

    var hpSmp = Math.abs(apSmp) + Math.abs(bSmp) === 0 ? 0 : Math.atan2(bSmp, apSmp);
        hpSmp += (hpSmp < 0) * 2 * Math.PI;

    var dL = lSmp - lStd;
    var dC = cpSmp - cpStd;
    
    var dhp = cpStd * cpSmp === 0 ? 0 : hpSmp - hpStd;
        dhp -= (dhp > Math.PI) * 2 * Math.PI;
        dhp += (dhp < -Math.PI) * 2 * Math.PI;

    var dH = 2 * Math.sqrt(cpStd * cpSmp) * Math.sin(dhp / 2);

    var Lp = (lStd + lSmp) / 2;
    var Cp = (cpStd + cpSmp) / 2;

    var hp;
    if (cpStd * cpSmp === 0) {
        hp = hpStd + hpSmp;
    } else {
        hp = (hpStd + hpSmp) / 2;
        hp -= (Math.abs(hpStd - hpSmp) > Math.PI) * Math.PI;
        hp += (hp < 0) * 2 * Math.PI;
    }

    var Lpm50 = Math.pow(Lp - 50, 2);
    var T = 1 - 
            0.17 * Math.cos(hp - Math.PI / 6) + 
            0.24 * Math.cos(2 * hp) + 
            0.32 * Math.cos(3 * hp + Math.PI / 30) -
            0.20 * Math.cos(4 * hp - 63 * Math.PI / 180);
    
    var Sl = 1 + (0.015 * Lpm50) / Math.sqrt(20 + Lpm50);
    var Sc = 1 + 0.045 * Cp;
    var Sh = 1 + 0.015 * Cp * T;
    
    var deltaTheta = 30 * Math.PI / 180 * Math.exp(-1 * Math.pow((180 / Math.PI * hp - 275)/25, 2));
    var Rc = 2 * Math.sqrt(
        Math.pow(Cp, 7) / (Math.pow(Cp, 7) + Math.pow(25, 7))
    );

    var Rt = -1 * Math.sin(2 * deltaTheta) * Rc;

    return Math.sqrt(
        Math.pow(dL / (kL * Sl), 2) + 
        Math.pow(dC / (kC * Sc), 2) + 
        Math.pow(dH / (kH * Sh), 2) + 
        Rt * dC / (kC * Sc) * dH / (kH * Sh)
    );
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

    return {l: myL, a: myA, b: myB};

}

function CIELABconvF(value) {
    if (value > Math.pow(6/29, 3)) {
        return Math.cbrt(value);
    }

    return 1/3 * Math.pow(6/29, 2) * value + 4/29;
}
