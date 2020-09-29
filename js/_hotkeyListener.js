var spacePressed = false;

function KeyPress(e) {
    var keyboardEvent = window.event? event : e;

    //if the user is typing in an input field or renaming a layer, ignore these hotkeys, unless it's an enter key
	/*
    if (document.activeElement.tagName == 'INPUT' || isRenamingLayer) {
    	if (e.keyCode == 13) {
    		currentLayer.closeOptionsMenu();
    	}
    	return;
    }*/

    //if no document has been created yet,
    //orthere is a dialog box open
    //ignore hotkeys
    if (!documentCreated || dialogueOpen) return;

	//
	if (e.key === "Escape") {
		if (!selectionCanceled) {
			tool.pencil.switchTo();
		}
	}
	else {
	  	switch (keyboardEvent.keyCode) {
			//pencil tool - 1, b
			case 49: case 66:
				tool.pencil.switchTo();
				break;
			//Z
			case 90:
			  //CTRL+ALT+Z redo
			  if (keyboardEvent.altKey && keyboardEvent.ctrlKey)
			    redo();
			  if (keyboardEvent.ctrlKey) {
			    	undo();
			    }
				break;
			//redo - ctrl y
			case 89:
			  if (keyboardEvent.ctrlKey)
			    redo();
			  break;
			case 32:
			// Pan flag
			  spacePressed=true;
			  break;
		}
  	}
}

document.onkeydown = KeyPress;

window.addEventListener("keyup", function (e) {

	if (e.keyCode == 32) spacePressed = false;

});
