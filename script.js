const wrapper = document.querySelector(".wrapper"),
searchInput = wrapper.querySelector("input"),
synonyms = wrapper.querySelector(".synonyms .list"),
example = wrapper.querySelector(".example")
info = wrapper.querySelector(".info"),
volumeIcon = wrapper.querySelector(".word i"),
reset = wrapper.querySelector(".search span"),
mic = wrapper.querySelector(".search .mic");

let audio;

function data(result, word) {
    if(result.title){
        wrapper.classList.remove("active");
        info.innerHTML = `Can't find the Meaning of <span>"${word}"</span>". Check the word again and retry.`
    }else{
        wrapper.classList.add("active");

        let definitions = result[0].meanings[0].definitions[0],

        phonetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`;
        document.querySelector(".word p").innerHTML = result[0].word;
        document.querySelector(".word span").innerHTML = phonetics;
        document.querySelector(".meaning span").innerHTML = definitions.definition;
        document.querySelector(".example span").innerHTML = definitions.example;
        audio = new Audio("https:" + result[0].phonetics[0].audio);

        if(definitions.synonyms[0] == undefined) {
            synonyms.parentElement.style.display = "none";         
        }else{
            synonyms.parentElement.style.display = "block";
            synonyms.innerHTML = "";
            for (let i = 0; i < 5; i++) {
                let tag = `<span onclick=search('${definitions.synonyms[i]}')> ${definitions.synonyms[i]} </span>`
                synonyms.insertAdjacentHTML("beforeend", tag);
            }
        }

        if(definitions.example == undefined) {
            example.style.display = "none";        
        }else{
            example.style.display = "block";
        }

    }
}
function highlight(word) {
    let play = wrapper.querySelector(word);
    let original = play.style.color;
    play.style.color='#4d59fb';
    window.setTimeout(function() { play.style.color = original; }, 1000);
}


function search(word){
    searchInput.value = word;
    fetchApi(word);
}

function fetchApi(word){
    info.style.color = "black";
    info.innerHTML = `Searching for <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url).then(res => res.json()).then(result => data(result, word));
}

searchInput.addEventListener("keyup", e =>{
    if(e.key === "Enter" && e.target.value){
        fetchApi(e.target.value);
    }
});


volumeIcon.addEventListener("click", e =>{
    audio.play()
});

reset.addEventListener("click", e =>{
    searchInput.value = ""
    searchInput.focus();
    wrapper.classList.remove("active");
    info.innerHTML = `Type the word and hit Enter to get the Meaning, Synonyms, Definition and Example.`;
    info.style.color = "#999";
})

function runSpeechRecognition() {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    recognition.onstart = function() {
        info.innerHTML = "Listening...";
    };
    
    recognition.onspeechend = function() {
        info.innerHTML = "Stopped listening.";
        recognition.stop();
        wrapper.classList.remove("active");
        searchInput.value = ""
        info.innerHTML = `Type the word and hit Enter to get the Meaning, Synonyms, Definition and Example.`;
        info.style.color = "#999";
    }
  
    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        fetchApi(transcript);
    };
  
     recognition.start();
}

function highlight0(mic) {
    let play = wrapper.querySelector(mic);
    let original = play.style.color;
    play.style.color='#4d59fb';
    window.setTimeout(function() { play.style.color = original; }, 4000);
}