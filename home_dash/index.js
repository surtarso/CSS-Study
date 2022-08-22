// This script queries each service and update the html elements with the status and links
// Tarso Galvao 08-2022
// OBS: Proxy must be configured in the webserver for this to work!
// TODO: add missing proxy to services
// TODO: change http to https after SSL is set up

//------------------------------------------- SERVICES SETUP ----------------------------------------------
class Service {
    constructor( id, route, proxy ) {
        this.id = id;       // the HTML element id
        this.route = route; // the route to the service
        this.proxy = proxy; // the proxy port to use
    }
    //add new service here
    static getAllServices() {
        return [
            //new Service('ID', '/route', ':proxy');
            new Service( 'OMPD', '/ompd', 'none' ),
            new Service( 'Ubooquity', '/ubooquity', ':2039/ubooquity' ),
            new Service( 'ownCloud', '/owncloud', 'none' ),
            new Service( 'Wordpress', '/wordpress', 'none' ),
            new Service( 'Dashboard', ':5252/', ':5252/' ),
            new Service( 'Pi-Hole', '/admin/index.php', 'none' ),
            new Service( 'Wordpress-Admin', '/wordpress/wp-admin', 'none' ),
            new Service( 'Ubooquity-Admin', '/ubooquity-admin', ':2038/ubooquity/admin' ),
            // new Service( 'Bitwarden', '/bitwarden', ':8001/' ),
            new Service( 'Lidarr', '/lidarr', ':8686/lidarr' ),
            new Service( 'Readarr', '/readarr', ':8787/readarr' ),
            new Service( 'Jackett', '/jackett', ':9117/jackett' ),
            new Service( 'phpMyAdmin', '/phpmyadmin/index.php', 'none' ),
        ];       
    }
}
//------------------------------------------- STATUS SETUP ------------------------------------------------
const ONLINE = { text: 'Online', status_color: 'label label-success', link_color: 'label label-primary' };
const OFFLINE = { text: 'Offline', status_color: 'label label-danger', link_color: 'label label-default' };
//----------------------------------------------- MAIN ----------------------------------------------------
// SEND QUERY TO ALL SERVICES:
function queryAllServices() {
    let services = Service.getAllServices();
    for ( let i = 0; i < services.length; i++ ) { queryService(services[i]); }
}

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

// PROCESS STATUS ERROR OF THE SERVICE:
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
    let link_element = window.document.getElementById(service.id + '_link');            //column "Service"
    let path_element = window.document.getElementById(service.id + '_path');            //column "Path"
    let proxy_element = window.document.getElementById(service.id + '_proxy');          //column "Proxy"
    let status_element = window.document.getElementById(service.id + '_status');        //column "Status"
    let quicklink_element = window.document.getElementById(service.id + '_quicklink');  //menu "Quicklinks"

    //add button link text, class style and link (col: Service)
    link_element.innerHTML = service.id;
    link_element.className = status.link_color;
    link_element.href = 'http://' + window.location.hostname + service.route;

    //add page route text (col: Path)
    path_element.innerHTML = service.route;

    //add page proxy with link (col: Proxy)
    if ( service.proxy === 'none' ) { proxy_element.className = 'hidden'; }
    else if ( service.proxy !== 'none' ) {
        proxy_element.innerHTML = service.proxy;
        proxy_element.href = 'http://' + window.location.hostname + service.proxy;}
    else { console.log('Error while setting the proxy of the service: ' + service.id); }

    //add status text and class style (col: Status)
    status_element.innerHTML = status.text;
    status_element.className = status.status_color;

    //add link to quicklinks (top quicklinks menu)
    if ( quicklink_element != null ) { quicklink_element.href = link_element.href; }
}
//---------------------------------------- MAIN LOOP ------------------------------------------------
queryAllServices();                   //on load, ping all services
setInterval(queryAllServices, 10000); //ping all services every 10 seconds