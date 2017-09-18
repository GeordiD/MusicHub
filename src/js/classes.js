
//-------classes-------

class Line {
    constructor() {
        this.mId = getNewId();
        this.mDefLineHeight = 0;
        this.mCheckInit = false; //see if the line has been initialized
    }

    //Called after append or after
    _init() {
        this.mDefLineHeight = this.get$Textbox().get(0).scrollHeight;
        this.m$ChordSizer = $(this._$this().find('.line_chords_sizer')[0]);
        this.mCheckInit = true;

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
                "<div class='line_text_container'>" +
                    this._htmlTextbox(string) +
                "</div>" +
            "</div>"
    }

    _htmlTextbox(string) {
        if(typeof string == "undefined") string = "";
        return "<div class=\"line_text_box line_text_style\" onkeydown='onKeyDown(event, this)' onkeyup='onKeyUp(event, this)' contenteditable='true'>" + string + "</div>"
    }

    get$Textbox() {
        if(this.mTextarea == null) {
            this.mTextarea = this._$this().find('.line_text_box');
        }
        return $(this.mTextarea);
    }

    _pushRow() {
        var $this = this._$this();
        $this.append(this._htmlTextbox());
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
        new ChordMenu(event, this);
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

        //  I'm disabling this cause it's current implementation is bad
        //if($textarea.get(0).scrollHeight > this.mDefLineHeight) {
        //    this._pushRow();
        //} else if(this.mRowCount > 1 && $textarea.val() == "") {
        //    this._popRow();
        //}
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

class ChordMenu {
    constructor(event, lineObj) {
        this.lineObj = lineObj;
        this.menu = document.querySelector('#chord-menu');

        if(this.constructor.oldChordMenu != null) {
            this.constructor.oldChordMenu.destroy();
        }
        this.constructor.oldChordMenu = this;

        event.preventDefault();
        this.menu.classList.add("menu_chords__on");

        var textbox = this.lineObj.get$Textbox();
        var selectionStart = textbox.prop("selectionStart");
        var selectionEnd = textbox.prop("selectionEnd");

        //var text = this.mLineClone.text();
        //this.lineObj.mLineClone.text(
        //    text.slice(0,selectionStart) + "<span>" +
        //    text.slice(selectionStart, selectionEnd) + "</span>" +
        //    text.slice(selectionEnd));

    }



    destroy() {
        this.menu.classList.remove("menu_chords__on");
        this.constructor.oldChordMenu = null;
    }
}
ChordMenu.oldChordMenu = null;
ChordMenu.destroyIfExists = function() {
    if(ChordMenu.oldChordMenu != null) {
        ChordMenu.oldChordMenu.destroy();
    }
}



var ID_GEN = 0;
function getNewId() {
    return "autogen" + ID_GEN++;
}