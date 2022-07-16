//corner buttons
const mode_button = document.getElementById('mode-selector');
const lang_button = document.getElementById('lang-selector');

//mode classes to change
const body = document.getElementsByTagName('body')[0];
const footer = document.getElementsByTagName('footer')[0];
const headerbg = document.getElementsByClassName('header')[0];
const menu = document.getElementsByClassName('menu')[0];
const menuIcon = document.getElementsByTagName('label')[0];
const menuText = document.getElementsByTagName('nav')[0];
const h3 = document.getElementsByTagName('h3')[0];
const h1 = document.getElementsByTagName('h1')[0];
//mode class array
const classArray = [mode_button, lang_button, body, footer, headerbg, menu, menuIcon, menuText, h3, h1];

//text areas
let language = 'en-us'
const cv = document.getElementById('cv');
const ct = document.getElementById('ct');
const ht = document.getElementById('ht');
const card_0 = document.getElementById('card-0');
const card_1 = document.getElementById('card-1');
const card_2 = document.getElementById('card-2');
const card_3 = document.getElementById('card-3');
const card_4 = document.getElementById('card-4');

//set dark/light mode
function changeMode(){
    changeClasses();
    changeButtonText('toggleMode');
}

//set language
function changeLanguage(){
    if (language == 'en-us') { language = 'pt-br' }
    else { language = 'en-us' }

    changeText(language);
    changeButtonText('toggleLanguage');
}

//toggle dark-mode on classes
function changeClasses(){
    for (i = 0; i < classArray.length; i++) {
        classArray[i].classList.toggle('dark-mode');
    }
}

// change text on mode/language buttons
function changeButtonText(type) {
    switch(type){
        case 'toggleMode':
            if(body.classList.contains('dark-mode')) {
                mode_button.innerHTML = "Light Years";
                return;
            }
            mode_button.innerHTML = "Black Hole";
            break;

        case 'toggleLanguage':
            if(lang_button.innerHTML == 'en-US') {
                lang_button.innerHTML = "pt-BR";
                return;
            }
            lang_button.innerHTML = "en-US";
            break;
        }
}

//toggle text language
function changeText(language){
    switch(language){
        case 'en-us':
            //menu
            cv.innerHTML = 'Curriculum';
            cv.href = "pdf/Tarso Galvao CV 2022 EN-US.pdf"
            ct.innerHTML = 'Contact';
            //head
            ht.innerHTML = "Full-Stack Developer"
            //cards
            card_0.innerHTML = "These are the languages that I'm currently studying and focusing on. All my projects available are developed with them but I'm always searching for new ways to improve my skills.";
            card_1.innerHTML = "On Github you will find most of my projects and studies. I do my best to keep everything up-to-date on my own, contributors are welcome! From Web Design to Game Engines, algorithms and art, to Bash scripts, here is where I'll keep them, feel free to snoop around!";
            card_2.innerHTML = "On Linkedin you will find my certifications for courses and bootcamps I completed.";
            card_3.innerHTML = "URCade is an operating system that turns your Raspberry Pi into a retro gaming system. The system was initially created as an exercise on dealing with Raspberry Pi and its Raspbian OS. As it grew, tools were written to help with its development. A project was born and URCade became a framework for building ready-to-use Pi images.";
            card_4.innerHTML = "The Playground contains mini-games I developed for my toddler to play. They are simple games and clones I developed just to exercise and learn. I'll tell you: he loves them! =)"
            break;
        
        case 'pt-br':
            //menu
            cv.innerHTML = 'Curriculo';
            cv.href = "pdf/Tarso Galvao CV 2022 PT-BR.pdf"
            ct.innerHTML = 'Contato';
            //head
            ht.innerHTML = 'Desenvolvedor Full-Stack'
            //cards
            card_0.innerHTML = "Estas são as linguagens que aprendi durante meus estudos e nas quais desenvolvo meus projetos. Mas estou sempre a procura de novos conhecimentos."
            card_1.innerHTML = "No Github você pode encontrar meus estudos e projetos, que procuro manter sempre atualizados. Contribuidores são bem vindos! De web-design à engine de jogos, algorítmos e arte à scripts em bash, é lá que vai encontrar. Vai lá dar uma fuçada!";
            card_2.innerHTML = "No Linkedin estão listados meus certificados de cursos e bootcamps que conquistei.";
            card_3.innerHTML = "URCade é uma plataforma que transforma seu Raspberry Pi em um multi video-game retrô. O sistema foi inicialmente criado como um exercício para lidar com o Raspberry Pi e seu sistema operacional. Com o tempo o exercício cresceu e várias ferramentas foram desenvolvidas durante o processo, até que nasceu o Projeto URCade como um framework para sistemas embarcados.";
            card_4.innerHTML = "O Playground é onde hospedo os mini-games que desenvolvi para meu filhote jogar. São jogos simples e clones que desenvolvo apenas como exercício e estudo. Posso dizer que ele adora! =)";
            break;
    }
}

//event listeners
mode_button.addEventListener('click', changeMode);
lang_button.addEventListener('click', changeLanguage);

//start page in english
changeText('en-us');