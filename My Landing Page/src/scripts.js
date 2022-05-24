function changeMode(){
    changeClasses();
    changeText();
}

function changeClasses(){
    for (i = 0; i < classArray.length; i++) {
        classArray[i].classList.toggle('dark-mode');
    }
}

function changeText() {
    if(body.classList.contains('dark-mode')) {
        button.innerHTML = "Light Years";
        return;
    }
    button.innerHTML = "Black Hole";
}

const button = document.getElementById('mode-selector');
const body = document.getElementsByTagName('body')[0];
const footer = document.getElementsByTagName('footer')[0];
const headerbg = document.getElementsByClassName('header')[0];
const menu = document.getElementsByClassName('menu')[0];
const menuIcon = document.getElementsByTagName('label')[0];
const menuText = document.getElementsByTagName('nav')[0];
const h3 = document.getElementsByTagName('h3')[0];
const h1 = document.getElementsByTagName('h1')[0];

const classArray = [button, body, footer, headerbg, menu, menuIcon, menuText, h3, h1];

button.addEventListener('click', changeMode);

//to start in dark-mode:
//changeClasses();
//changeText();