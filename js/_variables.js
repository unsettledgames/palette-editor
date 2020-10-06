//init variables
var zoom = 4;
var dragging = false;
var lastMouseClickPos = [0,0];
var dialogueOpen = false;
var documentCreated = false;

//common elements
var brushPreview = document.getElementById("brush-preview");
var canvasView = document.getElementById("canvas-view");
var popUpContainer = document.getElementById("pop-up-container");