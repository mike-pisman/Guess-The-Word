// Keeps input focused
document.getElementById('input').onblur = function (event) {
    var blurEl = this; setTimeout(function() {blurEl.focus()},10)
};

// First line
window.onload = function() {
    line = 1;
    currentChapter = chapter.one;
    addLine(currentChapter.text);
};

function addLine(text) {
    var p = '<p id="p' + (line + 1) + '">' + text + '</p>';
    $(p).insertAfter("#p" + line);
    line += 1;
    var objDiv = document.getElementById("lines");

    objDiv.scrollTop = objDiv.scrollHeight;
}

$("#input").keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13') {
        var input = document.getElementById("input").value;
        if(input.match(/^\s*$/))
            return;
        addLine(input);
        document.getElementById("input").value = "";
        for(var i = 0; i < currentChapter.options.length; i++) {
            if (input.toLowerCase().match(currentChapter.options[i][0])){
                eval(currentChapter.options[i][1]);
                return;
            }
        }
        addLine("I don't understand this answer"); // Secure myself
    }
});

function nextChapter(c) {
    currentChapter = c;
    addLine(currentChapter.text);
}



function pong() {
    var iframe = document.createElement('iframe');
    iframe.id = "game"
    iframe.src = "pong.html";
    document.body.appendChild(iframe);

    var t = setInterval(function () {
        if (document.getElementById('game').contentWindow.showScore){
            setTimeout(function(){
                if (document.getElementById('game').contentWindow.score1 == 2){
                    if(currentChapter == chapter.nine){
                        addLine('Wow, you won! I am surprised!');
                        addLine('By the way the word was Rubicon, you probably would not get it anyway...');
                        nextChapter(chapter.end);
                    }
                    if(currentChapter == chapter.guessedWord)
                        nextChapter(chapter.endwin);
                }

                if (document.getElementById('game').contentWindow.score2 == 2){
                    if(currentChapter == chapter.nine){
                        addLine("It's ok, you'll get it next time!");
                        addLine('By the way the word was Rubicon, you probably would not get it anyway...');
                        nextChapter(chapter.end);
                    }
                    if(currentChapter == chapter.guessedWord || currentChapter == chapter.endlost)
                        nextChapter(chapter.endlost);
                }
                clearInterval(t);
                document.body.removeChild(iframe);
            }, 3000);
        }
    }, 1000);
}

var chapter = {
    one: {
        text: "Hello! I guessed a word, what is it?",
        options: [["rubicon", "nextChapter(chapter.guessedWord)"],[/^(?!\s*$).+/, "nextChapter(chapter.two)"]]
    },
    two: {
        text: "It's not it, wanna try again?",
        options: [["rubicon", "nextChapter(chapter.guessedWord)"],[/^(?!\s*$).+/, "nextChapter(chapter.three)"]]
    },
    three: {
        text: "Incorrect, what's your name thou?",
        options: [["rubicon", "addLine('How ironic! Well... Hi, ' + input + '!');nextChapter(chapter.four)"], [/^(?!\s*$).+/, "addLine('Hi, ' + input + '!');nextChapter(chapter.four)"]]
    },
    four: {
        text: "Any ideas on the word?",
        options: [["rubicon", "nextChapter(chapter.guessedWord)"],[/^(?!\s*$).+/, "nextChapter(chapter.five)"]]
    },
    five: {
        text: "Not that one, unfortunately. Where are you from?",
        options: [[/^(?!\s*$).+/, "nextChapter(chapter.six)"]]
    },
    six: {
        text: "Do you like it there?",
        options: [["yes", "addLine('I am glad for you!');nextChapter(chapter.seven)"],["no", "addLine('I am sorry to hear that...');nextChapter(chapter.seven)"],[/^(?!\s*$).+/, "addLine('Please answer YES or NO');"]]
    },
    seven: {
        text: "So, did you get the word by any chance?",
        options: [["rubicon", "nextChapter(chapter.guessedWord)"],[/^(?!\s*$).+/, "nextChapter(chapter.eight)"]]
    },
    eight: {
        text: "Still wrong... Don't get sad thou! How old are you by the way?",
        options: [[/^\s*([0-9])*\s*$/, "if(input < 30) addLine('Well, you are pretty young, may be you just have not learnt that word yet'); if(input >= 30) addLine('Wow, I did not think humans live so long!'); nextChapter(chapter.nine)"],[/^(?!\s*$).+/, "addLine('Please enter a number');"]]
    },
    nine: {
        text: "Well... May be you wanna play a different game? It is a bit easier.",
        options: [["yes", "pong()"],["no", "addLine('In this case, I have nothing else to offer...');addLine('By the way the word was Rubicon, you probably would not get it anyway...');nextChapter(chapter.end)"],
        [/^(?!\s*$).+/, "addLine('Please answer YES or NO');"]]
    },
    guessedWord: { //If the player guesses the word
        text: "Wow, how did you guess it?! You must have been cheating! Oh, well... Do you want to play another game then?",
        options: [["yes", "pong()"],["no", "addLine('In this case, I have nothing else to offer...');nextChapter(chapter.end)"],
        [/^(?!\s*$).+/, "addLine('Please answer YES or NO');"]]
    },
    end: { //Empty chooice
        text: "Happy Xmas thou! Hope to see you again!",
    },
    endwin: { // Won after chapter 7
        text: "Congratulation! Happy Xmas! Hope to see you again!",
    },
    endlost: { // lost after chapter 7
        text: "You lost, it's ok. Wanna try one more time?",
        options: [["yes", "pong()"],["no", "addLine('In this case, I have nothing else to offer...');nextChapter(chapter.end)"],
        [/^(?!\s*$).+/, "addLine('Please answer YES or NO');"]]
    }

};
