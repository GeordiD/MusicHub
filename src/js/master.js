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


function addSpansToChords() {
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
                nHtml = nHtml.splice(lastBreak, 0, "<br>");
            } else {
                //Add end of span
                nHtml+="</span>";
            }
        }

        if(char === "<") {
            if(textFileStr.substring(i, i+4) === "<br>") {
                lastBreak = i+4;
            }
        }

        /*
        What is happening is the lastBreak is being set based
        on textFileStr index, rather than the nHtml index
        It's the correct index in the string, just wrong in the html
        cause we've been changing the indices
         */

        nHtml+=char;
    }
    div.html(nHtml);

    var test = nHtml;
    console.log(typeof test);
    console.log(test);
}

$(document).ready(function() {

    // var atest = $('#chord_id').position().left - getPadding($('.chart-content'));
    // var test = atest + ($("#chord_id").width()) / 2;
    // console.log(test);

    addSpansToChords();

});

