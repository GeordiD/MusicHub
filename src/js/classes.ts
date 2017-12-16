///<reference path="../../typings/jquery.d.ts"/>

//-------classes-------
var Line = /** @class */ (function () {
    function Line() {
        this.mId = getNewId();
        this.mDefLineHeight = 0;
        this.mCheckInit = false; //see if the line has been initialized
    }
    //Called after append or after
    Line.prototype._init = function () {
        this.mDefLineHeight = this.get$Textbox().get(0).scrollHeight;
        this.m$ChordSizer = $(this._$this().find('.line_chords_sizer')[0]);
        this.mCheckInit = true;
        var self = this;
        this._$this().bind("contextmenu", function () {
            //console.log("here2");
            self._handleRightClick(event);
        });
    };
    Line.prototype._$this = function () {
        return $('#' + this.mId);
    };
    Line.prototype._htmlLine = function (string) {
        return "<div id=\"" + this.mId + "\" class=\"line_div\">" +
            "<div class='line_chords'></div>" +
            "<div class='line_chords_sizer invisible'>TEST</div>" +
            "<div class='line_text_container'>" +
            this._htmlTextbox(string) +
            "</div>" +
            "</div>";
    };
    Line.prototype._htmlTextbox = function (string) {
        if (typeof string == "undefined")
            string = "";
        return "<div class=\"line_text_box line_text_style\" onkeydown='onKeyDown(event, this)' onkeyup='onKeyUp(event, this)' contenteditable='true'>" + string + "</div>";
    };
    Line.prototype.get$Textbox = function () {
        if (this.mTextarea == null) {
            this.mTextarea = this._$this().find('.line_text_box');
        }
        return $(this.mTextarea);
    };
    Line.prototype._pushRow = function () {
        var $this = this._$this();
        $this.append(this._htmlTextbox());
        var textareas = $this.find('.line_textarea');
        var $ogTextarea = $(textareas[textareas.length - 2]);
        var $newTextarea = $(textareas[textareas.length - 1]);
        $newTextarea.addClass('line_textarea_extra_row');
        var string = $ogTextarea.val();
        var lastSpace = string.lastIndexOf(" ");
        $ogTextarea.val(string.substring(0, lastSpace));
        $newTextarea.val(string.substring(lastSpace + 1, string.length));
        $newTextarea.focus();
        this.mRowCount++;
    };
    Line.prototype._popRow = function () {
        var $this = this._$this();
        var textareas = $this.find('.line_textarea');
        textareas[textareas.length - 2].focus();
        textareas[textareas.length - 1].remove();
        this.mRowCount--;
    };
    Line.prototype._handleRightClick = function (event) {
        new ChordMenu(event, this);
    };
    Line.prototype.appendLine = function ($container, string) {
        this.constructor.all_lines.push(this);
        $container.append(this._htmlLine(string));
        this._init();
    };
    Line.prototype.afterLine = function ($container) {
        this.constructor.all_lines.push(this);
        $container.after(this._htmlLine(""));
        this._init();
    };
    Line.prototype.removeLine = function () {
        this._$this().remove();
        Line.all_lines.removeObj(this);
    };
    Line.prototype.onKeyUp = function (event, $textarea) {
        var string = $textarea.val();
        var key = event.key;
        //TODO ignore non-letter keypresses
        //if space is the only char, delete it
        if (string.length == 1 && string[0] == " ") {
            $textarea.val("");
        }
        //ignore double spaces
        if (key == " " && string[string.length - 2] == " ") {
            $textarea.val(string.slice(0, string.length - 1));
        }
        //  I'm disabling this cause it's current implementation is bad
        //if($textarea.get(0).scrollHeight > this.mDefLineHeight) {
        //    this._pushRow();
        //} else if(this.mRowCount > 1 && $textarea.val() == "") {
        //    this._popRow();
        //}
    };
    return Line;
}());
Line.all_lines = [];
Line.get_line_from_$obj = function ($obj) {
    findId = getParentLineDiv($obj).attr('id');
    solution = -1;
    Line.all_lines.forEach(function (obj, index) {
        if (findId == obj.mId) {
            solution = obj;
            return false;
        }
    });
    if (solution == -1) {
        throw new Error("get_line_from_$obj did " +
            "not find anything; obj was " + $obj);
    }
    else {
        return solution;
    }
};
var ChordMenu = /** @class */ (function () {
    function ChordMenu(event, lineObj) {
        this.lineObj = lineObj;
        this.menu = document.querySelector('#chord-menu');
        if (this.constructor.oldChordMenu != null) {
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
    ChordMenu.prototype.destroy = function () {
        this.menu.classList.remove("menu_chords__on");
        this.constructor.oldChordMenu = null;
    };
    return ChordMenu;
}());
ChordMenu.oldChordMenu = null;
ChordMenu.destroyIfExists = function () {
    if (ChordMenu.oldChordMenu != null) {
        ChordMenu.oldChordMenu.destroy();
    }
};
var ID_GEN = 0;
function getNewId() {
    return "autogen" + ID_GEN++;
}
