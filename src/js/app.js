$(document).ready(function() {

    //State initialization
    $('#editor').append(html_line());
});

//this function is called each time a key is pressed inside a line_textarea
function checkKeys(event, ths) {
    var code = event.keyCode;
    $this = $(ths);

    if(code == 13) {
        enter($this);
        event.preventDefault();

    } else if(code == 8) {
        if($this.val().length == 0) {
            deleteLine($this);
            event.preventDefault();
        }

    } else if(code == 38) { //up arrow
        move($this, true);
        event.preventDefault();

    } else if(code == 40) { //down arrow
        move($this, false);
        event.preventDefault();
    }
}

function enter($this) {
    //we need the id so we can find it to focus on after adding it
    var lineObj = html_line_id();
    $this.after(lineObj[0]);
    $('#' + lineObj[1]).find('.line_textarea').focus();
}

function deleteLine($this) {
    //if this isn't the only line, delete it
    if($('#editor').find('.line_div').length > 1) {
        move($this, true);
        $this.remove();
    }
}

//move the cursor!
function move($this, boolUp) {
    $lineDivs = $('#editor').find('.line_div'); //save an array of lines in editor

    //set up directional variables
    var limit = $lineDivs.length-1;
    var delta = 1;
    if(boolUp) {
        limit = 0;
        delta = -1;
    }

    //Find the line we are on and switch focus to the line either above or below
    $lineDivs.each(function(i, obj) {
        if($this.parent().attr('id') == $(obj).attr('id')) {
            if(i == limit) return; //can't go up past the last line
            $moveArea = $($lineDivs.get(i+delta)).find('.line_textarea').get(0);
            setCaretToPos($moveArea, $this.prop("selectionStart"));
            return false;
        }
    })
}


//-----templates------

function html_line() {
    return html_line_id()[0];
}

function html_line_id() {
    var id = getNewId();
    return ["<div id=\"" + id + "\" class=\"line_div\"> \
                    <textarea class=\"line_textarea\" rows=\"1\" onkeydown='checkKeys(event, this)'>placeholder text</textarea> \
                 </div>",
            id];
}

var ID_GEN = 0;
function getNewId() {
    return "auto_gen_" + ID_GEN++;
}