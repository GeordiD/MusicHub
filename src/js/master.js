function setCaretToPos(input, pos) {
    input.get(0).focus();
    pos = Math.min(pos, input.text().length);
    input.caret('pos', pos);
}
/* http://bit.ly/2wEEgC2 */
function getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    }
    else if ((sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}
if (!Array.prototype.removeObj) {
    Array.prototype.removeObj = function (obj) {
        this.splice(this.indexOf(obj), 1);
    };
}
/*if (!String.prototype.splice) {
    String.prototype.splice = function (idx, rem, str) {
        return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
    };
}

if(!String.prototype.charMap) {
    String.prototype.charMap = function(funct) {
        for(let i = 0, len = this.length; i < len; i++) {
            funct(this.charAt(i));
        }
    }
}

function getTextFile(file, /!*boolean*!/removeLineBreaks)
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

    if(typeof removeLineBreaks !== "undefined" && removeLineBreaks === true) {
        let copyText = "";
        allText.charMap((x)=>{
            let charCode = x.charCodeAt(0);
            if(charCode !== 10 && charCode !== 13) {
                copyText += x;
            }
        })

        return copyText;
    }

    return allText;
}

function centerChordOnDiv($div, $chord) {
    return $div.width()/2 + $div.get(0).offsetLeft - $chord.width()/2;
}*/
//# sourceMappingURL=master.js.map