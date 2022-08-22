// This script should ping each service and update the html elements with the status of the service and linksconst
// Tarso Galvao 08-2022
// TODO: add reverse proxy to the services
// TODO: change http to https after SSL is set up

//------------------------------------------- STATUS SETUP ------------------------------------------------
const ONLINE = { text: 'Online', status_color: 'label label-success', link_color: 'label label-primary' };
const OFFLINE = { text: 'Offline', status_color: 'label label-danger', link_color: 'label label-default' };

//------------------------------------------- SERVICES SETUP ----------------------------------------------
class Service {
    constructor(id, route, proxy) {
        this.id = id;
        this.route = route;
        this.proxy = proxy;
    }
    static getAllServices() {
        return [
            //new Service('ID', '/route', ':proxy');
            new Service('OMPD', '/ompd', 'none'),
            new Service('Ubooquity', '/ubooquity', ':2039/ubooquity'),
            new Service('ownCloud', '/owncloud', 'none'),
            new Service('Wordpress', '/wordpress', 'none'),
            new Service('Dashboard', ':5252/', ':5252/'),
            new Service('Pi-Hole', '/admin/index.php', 'none'),
            new Service('Wordpress-Admin', '/wordpress/wp-admin', 'none'),
            new Service('Ubooquity-Admin', '/ubooquity-admin', ':2038/ubooquity/admin'),
            // new Service('Bitwarden', '/bitwarden', ':8001/'),
            new Service('Lidarr', '/lidarr', ':8686/lidarr'),
            new Service('Readarr', '/readarr', ':8787/readarr'),
            new Service('Jackett', '/jackett', ':9117/jackett'),
            new Service('phpMyAdmin', '/phpmyadmin/index.php', 'none'),
        ];       
    }
}

//----------------------------------------------- MAIN ------------------------------------------------
//send ping to all services
function queryAllServices() {
    let services = Service.getAllServices();
    for (let i = 0; i < services.length; i++) { queryService(services[i]); }
}

//ping a service using ajax and send update to the the html element
function queryService(service) {
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
        //defines the response to be made
        statusCode: {
            //found
            200: function (response) { processStatus(response, service, true); },
            //not found
            404: function (response) { processStatus(response, service, false); },
            //denied
            403: function (response) { processStatus(response, service, false); },
            //timeout
            504: function (response) { processStatus(response, service, false); },
            //server error
            500: function (response) { processStatus(response, service, false); },
            //rejected
            0: function (response) { processStatus(response, service, false); },
            //other error
            default: function (response) { processStatus(response, service, false); },
        },
    };
    $.ajax(query_setup)
}

//process the response of the service
function processStatus(response, service, found) {
    if (found) { updateServiceStatus(service, ONLINE); }

    else if (!found) {
        updateServiceStatus(service, OFFLINE);
        console.log('status: ' + response.status + ' response: ' + JSON.stringify(response, null, 2) + ' from route: ' + service.route); }

    else { console.log('error while processing the status of the service: ' + service.id); }
}

//update the html element with the status of the service
function updateServiceStatus(service, status) {
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
    if (service.proxy === 'none') { proxy_element.className = 'hidden'; }
    
    else if (service.proxy !== 'none') {
        proxy_element.innerHTML = service.proxy;
        proxy_element.href = 'http://' + window.location.hostname + service.proxy;}
    
    else { console.log('error while setting the proxy of the service: ' + service.id); }

    //add status text and class style (col: Status)
    status_element.innerHTML = status.text;
    status_element.className = status.status_color;

    //add link to quicklinks (top quicklinks menu)
    if (quicklink_element != null) { quicklink_element.href = link_element.href; }
}

//----------------------------------------------- LOOP ------------------------------------------------
queryAllServices();                   //on load, ping all services
setInterval(queryAllServices, 10000); //ping all services every 10 seconds