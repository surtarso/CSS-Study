// This script queries each service with ajax and update the html elements with the status and links
// Tarso Galvao 08-2022
// OBS: Proxy must be configured in the webserver for this to work!
// TODO: add missing proxy to services
// TODO: change http to https after SSL is set up


//------------------------------------------- SERVICES SETUP ----------------------------------------------
class Service {
    constructor( id, route, proxy, site ) {
        this.id = id;       //the HTML element id
        this.route = route; //the local route to the service
        this.proxy = proxy; //the proxy port to use
        this.site = site;   //the oficial website of the service
    }
    //add new service here
    static getAllServices() {
        return [
            //---------( 'ID', '/localRoute', ':proxy', 'http://domain.com/');
            new Service( 'OMPD', '/ompd', 'none', 'http://ompd.pl/'),
            new Service( 'Ubooquity', '/ubooquity', ':2039/ubooquity', 'https://vaemendis.net/ubooquity/'),
            new Service( 'ownCloud', '/owncloud', 'none', 'https://owncloud.com/'),
            new Service( 'Wordpress', '/wordpress', 'none', 'https://wordpress.org/'),
            new Service( 'Dashboard', ':5252/', ':5252/', 'https://dietpi.com/'),
            new Service( 'Pi-Hole', '/admin/index.php', 'none', 'http://pi-hole.net/'),
            new Service( 'Wordpress-Admin', '/wordpress/wp-admin', 'none', 'https://wordpress.org/'),
            new Service( 'Ubooquity-Admin', '/ubooquity-admin', ':2038/ubooquity/admin', 'https://vaemendis.net/ubooquity/admin/'),
            // new Service( 'Bitwarden', '/bitwarden', ':8001/', 'https://bitwarden.com/'),
            new Service( 'Lidarr', '/lidarr', ':8686/lidarr', 'https://lidarr.audio/'),
            new Service( 'Readarr', '/readarr', ':8787/readarr', 'https://readarr.com/'),
            new Service( 'Jackett', '/jackett', ':9117/jackett', 'https://jackett.io/'),
            new Service( 'phpMyAdmin', '/phpmyadmin/index.php', 'none', 'https://phpmyadmin.net/'),
            new Service( 'Transmission', '/transmission', ':9091/transmission', 'https://transmissionbt.com/'),
        ];       
    }
}

const SERVICES = Service.getAllServices();
const ICON = 'http://www.google.com/s2/favicons?domain=';  //url to fech favicons
const ONLINE = { text: 'Online', status_color: 'label label-success', link_color: 'label label-primary' };
const OFFLINE = { text: 'Offline', status_color: 'label label-danger', link_color: 'label label-default' };

//----------------------------------------------- MAIN ----------------------------------------------------
// SEND QUERY TO ALL SERVICES:
function queryAllServices() { SERVICES.forEach( service => queryService(service) ); }

// QUERY SERVICE:
function queryService( service ) {
    //defining request configuration
    var query_setup = {
        cache: false,
        dataType: 'jsonp',
        crossDomain: true,
        crossOrigin: true,
        url: 'http://' + window.location.hostname + service.route,
        method: 'GET',
        timeout: 5000,
        headers: {accept: 'application/json', 'Access-Control-Allow-Origin': '*'},
        //defining the response to be made
        statusCode: {
            200: function () { updateServiceStatus(service, ONLINE); },     //200: found
            404: function (response) { processError(response, service); },  //404: not found
            403: function (response) { processError(response, service); },  //403: denied
            504: function (response) { processError(response, service); },  //504: timeout
            500: function (response) { processError(response, service); },  //500: server error
            0: function (response) { processError(response, service); },    //0: rejected
        },
    };
    $.ajax( query_setup )
}

// PROCESS STATUS != 200 OF THE SERVICE:
function processError( response, service ) {
    updateServiceStatus(service, OFFLINE);
    console.log(
        ' Status: ' + response.status +
        ' Response: ' + JSON.stringify(response,null,2) +
        ' From route: ' + service.route
    );
}

// UPDATE THE HTML ELEMENT WITH THE STATUS OF THE SERVICE:
function updateServiceStatus( service, status ) {
    //get html elements
    let icon_element = document.getElementById(service.id + '_icon');                   //Service favicon
    let site_element = document.getElementById(service.id + '_site');                   //Service website
    let link_element = window.document.getElementById(service.id + '_link');            //column "Service"
    let path_element = window.document.getElementById(service.id + '_path');            //column "Path"
    let proxy_element = window.document.getElementById(service.id + '_proxy');          //column "Proxy"
    let status_element = window.document.getElementById(service.id + '_status');        //column "Status"
    let quicklink_element = window.document.getElementById(service.id + '_quicklink');  //menu "Quicklinks"

    //add the url to fetch the favicon with link to the official website
    icon_element.setAttribute('src', ICON + service.site);
    site_element.setAttribute('href', service.site);

    //add button link text, class style and link (col: Service)
    link_element.innerHTML = service.id;
    link_element.className = status.link_color;
    link_element.href = 'http://' + window.location.hostname + service.route;

    //add page route text (col: Path)
    path_element.innerHTML = service.route;

    //add page proxy with link (col: Proxy)
    if (service.proxy !== 'none') {
        proxy_element.innerHTML = service.proxy;
        proxy_element.href = 'http://' + window.location.hostname + service.proxy;
    } else { proxy_element.className = 'hidden'; }  

    //add status text and class style (col: Status)
    status_element.innerHTML = status.text;
    status_element.className = status.status_color;

    //add link to quicklinks (top quicklinks menu)
    if ( quicklink_element != null ) { quicklink_element.href = link_element.href; }
}

//add stats to the header
function getTabUsage() {
    //cpu usage
    work = new Worker("data:text/javascript,setInterval(` dl=Date.now();for(itr=1;itr<1000;itr++){};dl=Date.now()-dl;postMessage(dl);`,1000);");
    work.onmessage = (evt)=>{ window.document.getElementById('cpu_usage').innerHTML = 'CPU: ' + Math.round(evt.data) + '%'; };
    //ram usage (only in chrome. firefox and safari not supported)
    if (window.navigator.userAgent.indexOf('Chrome') > -1) {
        let ram = JSON.stringify(window.performance.memory['usedJSHeapSize']);
        window.document.getElementById('ram_usage').innerHTML = 'RAM: ' + Math.round(ram/1000000) + 'MB';
    } else {
        window.document.getElementById('ram_usage').className = 'hidden';
    }
}

//---------------------------------------- MAIN LOOP ------------------------------------------------
queryAllServices();                   //on load, ping all services
getTabUsage();                        //on load, get tab usage
setInterval(queryAllServices, 10000); //ping all services every 10 seconds
setInterval(getTabUsage, 2000);       //get page cpu/ram usage every 2 seconds