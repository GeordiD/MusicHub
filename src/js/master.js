

if (!String.prototype.splice) {
    String.prototype.splice = function (idx, rem, str) {
        return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
    };
}

function getTextFile(file)
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

    return allText;
}

function centerChordOnDiv($div, $chord) {
    return $div.width()/2 + $div.get(0).offsetLeft - $chord.width()/2;
}
