var WordSplicer ={
    splice : function (el, blockHtmlLetter, separatorsWordEnabled, classNameLetter) {
        var lettersEl = [];
        var cptSeparator = 0;
        var word = el.innerText;
        el.innerHTML = "";
        for(var i = 0; i < word.length; i++){
            var letter = word.charAt(i);
            if(letter !== " ") {
                var letterEl = this.createLetter(blockHtmlLetter, classNameLetter, letter);
                el.appendChild(letterEl);
                lettersEl.push(letterEl);
                continue;
            }
            else if(separatorsWordEnabled.indexOf(cptSeparator) !== -1){
                el.appendChild(document.createElement("div"));
            }
            else{
                var letterEl = this.createLetter(blockHtmlLetter, classNameLetter, " ");
                el.appendChild(letterEl);
            }
            cptSeparator++;
        }
        return lettersEl;
    },
    createLetter : function (blockHtmlLetter, classNameLetter, letter) {
        var letterEl = document.createElement(blockHtmlLetter);
        if (typeof classNameLetter !== "undefined") {
            letterEl.classList.add(classNameLetter);
        }
        if(letter === " "){
            letter = "i";
            letterEl.style.opacity = "0";
        }
        letterEl.innerHTML = letter;
        return letterEl;
    }
};