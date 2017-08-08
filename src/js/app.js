//-------classes-------

class Line {
    constructor() {
        this.id = getNewId();
        this.charLength = 0;
    }

    _html_line() {
        return "<div id=\"" + this.id + "\" class=\"line_div\"> \
                    <textarea class=\"line_textarea\" rows=\"1\" onkeydown='checkKeys(event, this)' placeholder='placeholder text'></textarea> \
                 </div>"
    }

    appendLine($container) {
        this.constructor.all_lines.push(this);
        $container.append(this._html_line());
    }

    afterLine($container) {
        this.constructor.all_lines.push(this);
        $container.after(this._html_line());
    }

    removeLine() {
        //TODO
    }

}

Line.all_lines = [];


var ID_GEN = 0;
function getNewId() {
    return "autogen" + ID_GEN++;
}

$(document).ready(function() {

    //State initialization
    new Line().appendLine($("#editor"));

    console.log(Line.all_lines);
});

//this function is called each time a key is pressed inside a line_textarea
function checkKeys(event, ths) {
    var code = event.keyCode;
    $this = $(ths); //textarea

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
    var lineObj = new Line();
    $this = getParentLineDiv($this);
    lineObj.afterLine($this);
    $('#' + lineObj.id).find('.line_textarea').focus();
    console.log(Line.all_lines);
}

function deleteLine($this) {
    //if this isn't the only line, delete it
    if($('#editor').find('.line_div').length > 1) {
        move($this, true);
        getParentLineDiv($this).remove();
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

//---helper functions----

function getParentLineDiv($this) {
    if($this.attr('class') == 'line_div') {
        return $this;
    } else {
        var $parents = $this.parents();
        //I don't love this solution, cause this will be a frequently used funciton that depends
        //   on low hierarchy depth
        if($parents.length > 15) {
            console.log("Warning: getParentLineDiv's $parents variable is " + $parents.length +
                " long.  May need to rethink method?");
        }
        $return = false;
        $parents.each(function(i, obj) {
            if($(obj).attr('class') == 'line_div') {
                $return = $(obj);
                return false;
            }
        });
        if($return == false) {
            throw new Error("getParentLineDiv on " + $this + " couldn't find a lineDiv");
        }
        return $return;
    }
}


//-----templates------

