/**
 * Created by GeordiD on 2/15/17.
 */

/*
$(document).ready(function() {
    $("#edit").each(function(k,v) {
        //console.log(k + " " + v);
    });
});
*/

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
    }
    rawFile.send(null);

    return allText;
}

function getPreviewHtml() {
    var str = getTextFile("src/testFiles/test.txt");

    var output = "";

    for(var i = 0, len = str.length; i < len; i++) {
        output+=str.charAt(i);
        output+=".";
    }

    return output;
}

$(document).ready(function() {

    console.log("here");


    $('#edit').html(getTextFile("src/testFiles/test.txt"));

    $('#preview').html(getPreviewHtml());

});
