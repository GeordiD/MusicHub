/**
 * Created by GeordiD on 2/15/17.
 */

var widthLine = 400; //px

function getPadding(element) {
    return  (element.innerWidth() - element.width())/2;
}

function testSetLineBreaks() {

    

    var test = text;
    console.log(test);
}

$(document).ready(function() {

    var atest = $('#chord_id').position().left
        - getPadding($('.chart-content'));
    var test = atest + ($("#chord_id").width()) / 2;

    testSetLineBreaks();

    console.log(test);
});

$(window).resize(function() {
    testSetLineBreaks();
});
