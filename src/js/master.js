/**
 * Created by GeordiD on 2/15/17.
 */

function getPadding(element) {
    return  (element.innerWidth() - element.width())/2;
}

$(document).ready(function() {

    var atest = $('#chord_id').position().left
        - getPadding($('.chart-content'));
    var test = atest + ($("#chord_id").width()) / 2;

    console.log(test);
});
