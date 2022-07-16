var count = 0;
var rocket = document.getElementById('rocket');

// activate hidden game link
rocket.addEventListener('mouseup', function(evt){
    count++;
    if(count == 7){
        rocket.outerHTML = '<a id="rocket" href="https://tarsogalvao.ddns.net/games/bullethell"><img src="./img/rocket2.webp" id="Rocket"></a>';
        setTimeout(function(){
            //get new reference of element (to the changed above)
            var rocket = document.getElementById('rocket');
            rocket.outerHTML = '<a id="rocket"><img src="./img/rocket.webp" id="Rocket"></a>';
        }, 4000);  //4 seconds = 1 full spin
    }
})
