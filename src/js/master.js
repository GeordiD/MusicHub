/**
 * Created by GeordiD on 2/15/17.
 */

var widthLine = 400; //px

if (!String.prototype.splice) {
    String.prototype.splice = function (idx, rem, str) {
        return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
    };
}

function getPadding(element) {
    return  (element.innerWidth() - element.width())/2;
}

function getTextFile(file)
{
    var allText;

    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
             {
                 allText = rawFile.responseText;
            }
        }
    };
    rawFile.send(null);

    return allText;
}

function removeWeirdChar(v) {
    return v!=='';
}

function manualLineBreak() {
    var textFileStr = getTextFile("src/testFiles/test.txt");
    var div = $('#readInDoc');

    var words = textFileStr.split(/\W/).filter(removeWeirdChar);

    $.each(words, function(i, value) {
        var currentContents = div.html();
        div.append(value + " ");
        if(div.width() > 360) {
            div.html(currentContents);
            div.append("<br>");
            div.append(value + " ");
        }
    });

    var test = div.width();
    console.log(typeof test);
    console.log(test);
}


function addChordsToTop() {
    var textFileStr = getTextFile("src/testFiles/test.txt");
    var div = $('#readInDoc');
    var nHtml = "";

    var lastBreak = 0;
    var insideTag = false;
    for(var i = 0, len = textFileStr.length; i < len; i++) {
        var char = textFileStr[i];

        if(char === '{') {
            //Read tag
            var offset = 0;
            while(char !== '}') {
                offset++;
                char = textFileStr[i+offset];
            }

            i+=offset+1;
            char = textFileStr[i];
            insideTag = !insideTag;
            if(insideTag) {
                //Add start of span
                nHtml+="<span class='chord'>";
                //Add a line break
                nHtml = nHtml.splice(lastBreak, 0, "<br><span class='add-chords'></span>");
            } else {
                //Add end of span
                nHtml+="</span>";
            }
        }

        if(char === "<") {
            if(textFileStr.substring(i, i+4) === "<br>") {
                lastBreak = nHtml.length;
            }
        }

        nHtml+=char;
    }
    div.append(nHtml);

    var test = "no test"
    console.log(typeof test);
    console.log(test);
}

function absolutePositionChords() {
    var id = 0
    var from = $('#readInDoc');

    var chords = $('.chord');
    chords.each(function(i, x) {
        $('#chord_holder').append("<div id='chord_" + id +"'>splendor</div>");

        var elemid = "chord_" + id;
        var elem = $('#'+elemid);
        elem.css("position", "absolute");
        elem.css("left", centerChordOnDiv(chords.eq(i), elem));
        elem.css("top", x.offsetTop);
        id++;
    });

    var elem = $('#chord_0');
    elem.css("top", 48);


    console.log("font-size = " + from.css("font-size"));
    console.log("getLineHeight = " + getLineHeight(from));
    console.log("top = " + chords.get(0).offsetTop);
}

//Both
function centerChordOnDiv($div, $chord) {
    return $div.width()/2 + $div.get(0).offsetLeft - $chord.width()/2;
}

function getLineHeight(el){
    return parseInt(el.css("line-height"));
    //var fontSize = $(el).css('font-size');
    //return Math.floor(parseInt(fontSize.replace('px','')) * 1.5);
}

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

