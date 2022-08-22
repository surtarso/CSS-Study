// This script should ping each service and update the html elements with the status of the service and links
// Tarso Galvao 08-2022
// TODO: add reverse proxy to the services
// TODO: change http to https after SSL is set up

//----------------------------------------------- VARS ------------------------------------------------
const DOCUMENT = window.document;
const running_text = 'Online';
const running_class = 'label label-success';
const running_link_class = 'label label-primary';
const stopped_text = 'Offline';
const stopped_class = 'label label-danger';
const stopped_link_class = 'label label-default';

//------------------------------------------------ CLASS -------------------------------------------------
// //create a services class
class Service {
    constructor(id, route, proxyof) {
        this.id = id;
        this.route = route;
        this.proxyof = proxyof;
    }
    static getAllServices() {
        return [
            //new Service('ID', '/path', ':proxy');
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
    for (let i = 0; i < services.length; i++) {
        queryService(services[i]);
    }
}

//ping a service using ajax and send update to the the html element
function queryService(service) {
    //defining request configuration
    var settings = {
        cache: false,
        dataType: 'jsonp',
        crossDomain: true,
        crossOrigin: true,
        // url: (service = '/bitwarden') ? 'https://' + window.location.hostname + service : 'http://' + window.location.hostname + service,
        url: 'http://' + window.location.hostname + service.route,
        method: 'GET',
        timeout: 5000,
        headers: {accept: 'application/json', 'Access-Control-Allow-Origin': '*'},
        //defines the response to be made
        statusCode: {
            //found
            200: function (response) {
                processStatus('200 Success! response= ', response, service, true);
            },
            //not found
            404: function (response) {
                processStatus('404 Not Found! response = ', response, service, false);
            },
            //denied
            403: function (response) {
                processStatus('403 Forbidden! response = ', response, service, false);
            },
            //timeout
            504: function (response) {
                processStatus('504 Gateway Timeout! response = ', response, service, false);
            },
            //server error
            500: function (response) {
                processStatus('500 Internal Server Error! response = ', response, service, false);
            },
            //rejected
            0: function (response) {
                processStatus('0 Rejected! response = ', response, service, false);
            },
            //other error
            default: function (response) {
                processStatus('Unknown Error! response = ', response, service, false);
            },
        },
    };
    //send the request
    $.ajax(settings)
}

//process the response of the service
function processStatus(status, response, service, success) {
    if (success) {
        console.log(status + response + ' from path: ' + service.route);
        updateServiceStatus(service.id, running_class, running_text, service.route, running_link_class, service.proxyof);
    } else {
        console.log(status + response + ' from path: ' + service.route);
        updateServiceStatus(service.id, stopped_class, stopped_text, service.route, stopped_link_class, service.proxyof);
    }
}

//update the html element with the status of the service
function updateServiceStatus(id, status_class, status_text, url, link_class, proxyof) {
    //status
    let status_element = DOCUMENT.getElementById(id);
    status_element.className = status_class;
    status_element.innerHTML = status_text;
    //page link
    let link_element = DOCUMENT.getElementById(id + '_link');
    link_element.innerHTML = id;
    link_element.className = link_class;
    //if link is Bitwarden, use https:// instead of http://
    // link.href = (url == '/bitwarden') ? 'https://' + window.location.hostname + url : 'http://' + window.location.hostname + url;
    link_element.href = 'http://' + window.location.hostname + url;
    //page path
    let path_element = DOCUMENT.getElementById(id + '_path');
    path_element.innerHTML = url;
    //page proxy
    let proxy_element = DOCUMENT.getElementById(id + '_proxy');
    proxy_element.innerHTML = proxyof;
    //quick link
    let quicklink = DOCUMENT.getElementById(id + '_quicklink');
    //if quicklink is not null, add the quicklink to the link
    if (quicklink != null) {
        quicklink.href = link_element.href;
    }
}

//----------------------------------------------- EVENTS ------------------------------------------------
// setupServices();                     //onload, setup the services
queryAllServices();                   //on load, ping all services
setInterval(queryAllServices, 10000); //ping all services every 10 seconds
