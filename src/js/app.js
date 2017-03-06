//Needs to be cleaned up a lot, but works
function goodVersion() {
    var textFileStr = getTextFile("src/testFiles/test.txt");
    var div = $('#readInDoc');
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
    div.append(nHtml);

    chords = $('.chord');
    chords.each(function(i,x) {
        var $chord = chords.eq(i);
        var chordId = x.id.substring(6);
        var $chord_loc = $('#chord_loc_' + chordId);

        $chord.css("margin-left", centerChordOnDiv($chord_loc, $chord));


        console.log($chord_loc.html());
    })
}

$(document).ready(function() {

    goodVersion();

});
