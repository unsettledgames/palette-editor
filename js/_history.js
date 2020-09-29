var undoStates = [];
var redoStates = [];

const undoLogStyle = 'background: #87ff1c; color: black; padding: 5px;';

function HistoryStateSample (arg1, arg2) {
	this.arg1 = arg1;
	this.arg2 = arg2;
	
	this.undo = function() {
		// Do your undo operations here
		
		// Add state to the redo stack
		redoStates.push(this);
	};
	
	this.redo = function() {
		// Do your redo operations here
		
		// Add state to the undo stack
		undoStates.push(this);
	};
	
	// Save state to the stack
	saveHistoryState(this);
}

//rename to add undo state
function saveHistoryState (state) {
    //get current canvas data and save to undoStates array
    undoStates.push(state);

    //limit the number of states to settings.numberOfHistoryStates
    if (undoStates.length > settings.numberOfHistoryStates) {
        undoStates = undoStates.splice(-settings.numberOfHistoryStates, settings.numberOfHistoryStates);
    }

    //there is now definitely at least 1 undo state, so the button shouldnt be disabled
    document.getElementById('undo-button').classList.remove('disabled');

    //there should be no redoStates after an undoState is saved
    redoStates = [];
}

function undo () {
    //console.log('%cundo', undoLogStyle);

    //if there are any states saved to undo
    if (undoStates.length > 0) {
        document.getElementById('redo-button').classList.remove('disabled');

        //get state
        var undoState = undoStates[undoStates.length-1];
        //console.log(undoState);

        //remove from the undo list
        undoStates.splice(undoStates.length-1,1);

        //restore the state
        undoState.undo();

        //if theres none left to undo, disable the option
        if (undoStates.length == 0)
            document.getElementById('undo-button').classList.add('disabled');
    }
}

function redo () {
    //console.log('%credo', undoLogStyle);

    if (redoStates.length > 0) {

        //enable undo button
        document.getElementById('undo-button').classList.remove('disabled');

        //get state
        var redoState = redoStates[redoStates.length-1];

        //remove from redo array (do this before restoring the state, else the flatten state will break)
        redoStates.splice(redoStates.length-1,1);

        //restore the state
        redoState.redo();

        //if theres none left to redo, disable the option
        if (redoStates.length == 0)
            document.getElementById('redo-button').classList.add('disabled');
    }
    //console.log(undoStates);
    //console.log(redoStates);
}
