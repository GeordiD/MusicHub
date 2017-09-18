

$(document).ready(function() {

    //State initialization
    var $editor = $('#editor');
    new Line().appendLine($editor, "The <b>Splendor</b> of the King");
    new Line().appendLine($editor, "Clothed in Majesty");
    new Line().appendLine($editor, "Let all the earth rejoice");
    new Line().appendLine($editor, "All the earth rejoice");
    //console.log($editor.html());
});

//this function is called each time a key is pressed inside a line_textarea
function onKeyDown(event, ths) {
    var key = event.key;
    $this = $(ths); //textarea

    if(key == "Enter") {
        enter($this);
        event.preventDefault();

    } else if(key == "Backspace") {
        if($this.text().length == 0) {
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

    ChordMenu.destroyIfExists();
}

function onKeyUp(event, ths) {
    try {
        Line.get_line_from_$obj($this).onKeyUp(event, $(ths));
    } catch (e) {
        //ignore
    }
}

//-----------
//---Context menu--------
//-----------

(function() {

    function init() {
        clickListener();
    }

    function clickListener() {
        document.addEventListener("click", function(event) {
            var button = event.which || event.button;
            if(button === 1) {
                ChordMenu.destroyIfExists();
            }
        });
    }

    init();
})();


//--------------
//----Key commands in text box----
//--------------

function enter($this) {
    //we need the id so we can find it to focus on after adding it
    var lineObj = new Line();
    $this = getParentLineDiv($this);
    lineObj.afterLine($this);
    $('#' + lineObj.mId).find('.line_textarea').focus();
}

function deleteLine($this) {
    //if this isn't the only line, delete it
    if ($('#editor').find('.line_div').length > 1) {
        move($this, true);
        //console.log("@! " + $this);
        Line.get_line_from_$obj($this).removeLine();
    }
}

//move the cursor!
    function move($this, boolUp) {
        $lineDivs = $('#editor').find('.line_div'); //save an array of lines in editor
        var thisID = Line.get_line_from_$obj($this).mId;

        //set up directional variables
        var limit = $lineDivs.length-1;
        var delta = 1;
        if(boolUp) {
            limit = 0;
            delta = -1;
        }

        //Find the line we are on and switch focus to the line either above or below
        $lineDivs.each(function(i, obj) {
            if(thisID == $(obj).attr('id')) {
                if(i == limit) return; //can't go up past the last line
                $moveToBox = Line.get_line_from_$obj($($lineDivs.get(i+delta))).get$Textbox();
                var cursorPos = getCaretCharacterOffsetWithin($this.get(0));
                setCaretToPos($moveToBox, cursorPos);
                return false;
            }
        })
    }


//--------------------
//---helper functions----
//--------------------

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

