//-------classes-------

class Line {
    constructor() {
        this.mId = getNewId();
        this.mTextarea = [];
        this.defLineHeight = 0;
        this.checkInit = false; //see if the line has been initialized
        this.rowCount = 1;
    }

    _init() {
        this.checkInit = true;
        this.defLineHeight = this._get$Textarea(0).get(0).scrollHeight;
    }

    _$this() {
        return $('#' + this.mId);
    }

    _htmlLine(string) {
        return "<div id=\"" + this.mId + "\" class=\"line_div\">" +
            this._htmlTextarea(string) +
            "</div>"
    }

    _htmlTextarea(string) {
        if(typeof string == "undefined") string = "";
        return "<textarea class=\"line_textarea\" rows=\"1\" onkeydown='onKeyDown(event, this)' onkeyup='onKeyUp(event, this)' placeholder='placeholder text'>" + string + "</textarea>"
    }

    _get$Textarea(index) {
        if(typeof index == "undefined") index = 0;
        if(this.mTextarea.length == 0) {
            this.mTextarea = this._$this().find('.line_textarea');
        }
        return $(this.mTextarea[index]);
    }

    _pushRow() {
        var $this = this._$this();
        $this.append(this._htmlTextarea());
        var textareas = $this.find('.line_textarea');
        var $ogTextarea = $(textareas[textareas.length - 2]);
        var $newTextarea = $(textareas[textareas.length-1]);
        $newTextarea.addClass('line_textarea_extra_row');

        var string = $ogTextarea.val();
        var lastSpace = string.lastIndexOf(" ");
        $ogTextarea.val(string.substring(0, lastSpace));
        $newTextarea.val(string.substring(lastSpace+1, string.length));
        $newTextarea.focus();
        this.rowCount++;
    }

    _popRow() {
        var $this = this._$this();
        var textareas = $this.find('.line_textarea');
        textareas[textareas.length - 2].focus();
        textareas[textareas.length - 1].remove();
        this.rowCount--;
    }

    appendLine($container, string) {
        this.constructor.all_lines.push(this);
        $container.append(this._htmlLine(string));
        this._init();
    }

    afterLine($container) {
        this.constructor.all_lines.push(this);
        $container.after(this._htmlLine(""));
        this._init();
    }

    removeLine() {
        this._$this().remove();
        Line.all_lines.removeObj(this);
    }

    onKeyUp(event, $textarea) {
        var string = $textarea.val();
        var key = event.key;

        //TODO ignore non-letter keypresses

        //if space is the only char, delete it
        if(string.length == 1 && string[0] == " ") {
            $textarea.val("");
        }

        //ignore double spaces
        if(key == " " && string[string.length-2] == " ") {
            $textarea.val(string.slice(0, string.length-1));
        }

        if($textarea.get(0).scrollHeight > this.defLineHeight) {
            this._pushRow();
        } else if(this.rowCount > 1 && $textarea.val() == "") {
            this._popRow();
        }
    }

}
Line.all_lines = [];
Line.get_line_from_$obj = function($obj) {
    findId = getParentLineDiv($obj).attr('id');
    solution = -1;
    Line.all_lines.forEach(function(obj, index) {
        if(findId == obj.mId) {
            solution = obj;
            return false;
        }
    });
    if(solution == -1)  {
        console.log($obj);
        throw new Error("get_line_from_$obj did " +
            "not find anything; obj was " + $obj);
    } else {
        return solution;
    }
};


var ID_GEN = 0;
function getNewId() {
    return "autogen" + ID_GEN++;
}

$(document).ready(function() {

    //State initialization
    var $editor = $('#editor');
    new Line().appendLine($editor, "The Splendor of the King The Splendor of the King The Splend");
    new Line().appendLine($editor, "Clothed in Majesty");
    new Line().appendLine($editor, "Let all the earth rejoice");
    new Line().appendLine($editor, "All the earth rejoice");
});

//this function is called each time a key is pressed inside a line_textarea
function onKeyDown(event, ths) {
    var key = event.key;
    $this = $(ths); //textarea

    if(key == "Enter") {
        enter($this);
        event.preventDefault();

    } else if(key == "Backspace") {
        if($this.val().length == 0) {
            deleteLine($this);
            event.preventDefault();
        }

    } else if(key == "ArrowUp") {
        move($this, true);
        event.preventDefault();

    } else if(key == "ArrowDown") {
        move($this, false);
        event.preventDefault();
    }
}

function onKeyUp(event, ths) {
    Line.get_line_from_$obj($this).onKeyUp(event, $(ths));
}

function enter($this) {
    //we need the id so we can find it to focus on after adding it
    var lineObj = new Line();
    $this = getParentLineDiv($this);
    lineObj.afterLine($this);
    $('#' + lineObj.mId).find('.line_textarea').focus();
    console.log(Line.all_lines);
}

function deleteLine($this) {
    //if this isn't the only line, delete it
    if($('#editor').find('.line_div').length > 1) {
        move($this, true);
        //console.log("@! " + $this);
        Line.get_line_from_$obj($this).removeLine();
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

