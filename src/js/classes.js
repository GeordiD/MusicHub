
//-------classes-------

class Line {
    constructor() {
        this.mId = getNewId();
        this.mTextarea = [];
        this.mDefLineHeight = 0;
        this.mCheckInit = false; //see if the line has been initialized
        this.mRowCount = 1;
    }

    _init() {
        this.mDefLineHeight = this._get$Textarea(0).get(0).scrollHeight;
        this.m$ChordSizer = $(this._$this().find('.line_chords_sizer')[0]);
        this.mCheckInit = true

        var self = this;
        this._$this().bind("contextmenu", function() {
            //console.log("here2");
            self._handleRightClick(event)
        });
    }

    _$this() {
        return $('#' + this.mId);
    }

    _htmlLine(string) {
        return "<div id=\"" + this.mId + "\" class=\"line_div\">" +
            "<div class='line_chords'></div>" +
            "<div class='line_chords_sizer invisible'>TEST</div>" +
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
        this.mRowCount++;
    }

    _popRow() {
        var $this = this._$this();
        var textareas = $this.find('.line_textarea');
        textareas[textareas.length - 2].focus();
        textareas[textareas.length - 1].remove();
        this.mRowCount--;
    }

    _handleRightClick(event) {
        console.log(window.getSelection().toString());
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

        if($textarea.get(0).scrollHeight > this.mDefLineHeight) {
            this._pushRow();
        } else if(this.mRowCount > 1 && $textarea.val() == "") {
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