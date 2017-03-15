

if (!String.prototype.splice) {
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

function getTextFile(file, /*boolean*/removeLineBreaks)
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
}
