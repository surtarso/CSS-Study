var count = 0;

document.addEventListener('mouseup', function(evt){
    count++;
    if(count == 7){
        var rocket = document.getElementById('rocket');
        rocket.outerHTML = '<a id="rocket" href="https://tarsogalvao.ddns.net/games/bullethell"><img src="./img/rocket2.webp" id="Rocket"></a>';
        console.log('1');
        setTimeout(function(){
            var rocket = document.getElementById('rocket');
            rocket.outerHTML = '<a id="rocket"><img src="./img/rocket.webp" id="Rocket"></a>';
        }, 4000);
    }
})
