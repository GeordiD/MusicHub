$(document).ready(function() {

    processTag("{/c}");

});

// --- Tag Processing ---

function processTag(/*string*/sTag) {
    //Declare all variables:
    var sTagName, sTagContents,
        isEnd = false;

    //Remove braces
    sTag = removeEnclosingBraces(sTag)
    //Get tag name and contents
    sTagName = getTagName(sTag);
    sTagContents = sTag.substr(sTagName.length).trim();

    //Check if it is an ending tag
    if(sTagName.charAt(0) == '/') {
        isEnd = true;
        sTagName = sTagName.substr(1);
    }

    //Pass information to correct function
    switch(sTagName) {
        case "c":
            isEnd ? processEndChordTag() : processChordTag(sTagContents);
            break;
        case "br":
            processBreakTag(sTagContents);
            break;
        default:
            console.log("unknown tag: " + sTagName);
            return;
    }

    //Test
    var test = "nothing";
    console.log(test);
}

// Chord Tag ---

function ChordManger() {

    var id = 0;

    this.open = false; //bool: are we in the middle of placing a chord?

    this.incrementId = function() {
        id++;
        return getId;
    }
    this.getId = function() {return id};
}

function processChordTag(sTagContents) {
    console.log("processChord");

    //jobs:
    //- Add 'add-chord' element to line above in non exists
    //- Add chord to 'add-chord'
    //- Add 'chord_loc' to this position
}

function processEndChordTag() {
    console.log("processEndChord");

    //jobs:
    //- End 'chord_loc'
    //- Position corresponding chord
}

// Break Tag ---

function processBreakTag(sTagContents) {
    console.log("processBreak");
}

// --- Helper Funcions ---

function removeEnclosingBraces(/*string*/str) {
    str = str.trim();

    if(str.charAt(0) == '{') {
        str = str.substr(1);
    }

    if(str.charAt(str.length-1) == '}') {
        str = str.substring(0, str.length-1);
    }

    return str;
}

function getTagName(/*string*/str) {
    var name = "",
        i = 0;

    //Make sure trimmed
    str = str.trim();

    //Get chars before space or '='
    while(str.charAt(i) != ' ' && str.charAt(i) != '=' && i < str.length) {
        name += str.charAt(i);
        i++;
    }

    return name.trim();
}

// --- REFERENCE CODE ---

//Needs to be cleaned up a lot, but works
function chordsOverWordsGoodVersion() {
    var textFileStr = getTextFile("src/testFiles/test.txt");
    var parentDiv = $('#readInDoc');
    var nHtml = "";

    //State
    var lastBreak = 0;
    var hasChordHolder = false;
    var chordHolderPos  = -1;
    var insideTag = false;
    var insertText;
    var id = 0;
    var offset;
    var chords;
    var chord, chord_loc;

    for(var i = 0, len = textFileStr.length; i < len; i++) {
        var char = textFileStr[i];

        if(char === '{') {
            //Read tag
            offset = 0;
            while(char !== '}') {
                offset++;
                char = textFileStr[i+offset];
            }

            i+=offset+1;
            char = textFileStr[i];
            insideTag = !insideTag;
            if(insideTag) {
                //Add start of span
                nHtml+="<span class='chord_loc' id='chord_loc_" + id + "'>";

                //Add chordholder if there isn't one
                if(!hasChordHolder) {
                    insertText = "<span class='add-chords'>";
                    nHtml = nHtml.splice(lastBreak, 0, insertText);
                    chordHolderPos = lastBreak+insertText.length;
                    nHtml = nHtml.splice(chordHolderPos, 0, "</span><br>");
                    hasChordHolder = true;
                }

                //Add chord to chordholder
                insertText = "<span class='chord' id='chord_" + id + "'>G" + id + "</span>";
                nHtml = nHtml.splice(chordHolderPos, 0, insertText);

                id++;

            } else {
                //Add end of span
                nHtml+="</span>";
            }
        }

        if(char === "<") {
            if(textFileStr.substring(i, i+4) === "<br>") {
                lastBreak = nHtml.length + 4;
                hasChordHolder = false;
            }
        }

        nHtml+=char;
    }
    parentDiv.append(nHtml);

    chords = $('.chord');
    chords.each(function(i,x) {
        var $chord = chords.eq(i);
        var chordId = x.id.substring(6);
        var $chord_loc = $('#chord_loc_' + chordId);

        $chord.css("margin-left", centerChordOnDiv($chord_loc, $chord));


        console.log($chord_loc.html());
    })
}


