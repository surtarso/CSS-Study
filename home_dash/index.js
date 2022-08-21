// This script should ping each service and update the html elements with the status of the service and links
// Tarso Galvao 08-2022
// TODO: add reverse proxy to the services
// TODO: change http to https after SSL is set up

//----------------------------------------------- VARS ------------------------------------------------
const DOCUMENT = window.document;
const IDs = [];
const SERVICES = [];
const PROXY_URLS = [];
const running_text = 'Online';
const running_class = 'label label-success';
const running_link_class = 'label label-primary';
const stopped_text = 'Offline';
const stopped_class = 'label label-danger';
const stopped_link_class = 'label label-default';


//------------------------------------------ INITIAL SETUP ------------------------------------------
// SERVICE_ID = 'service title (id of the html element)';
// SERVICE_ROUTE = 'local route to service (/location)';

function setupServices() {
    //------------------------------USER SERVICES
    let OMPD_ID = 'OMPD';
    let OMPD_ROUTE = '/ompd';
    let OMPD_PROXYOF = 'none';
    IDs.push(OMPD_ID);
    SERVICES.push(OMPD_ROUTE);
    PROXY_URLS.push(OMPD_PROXYOF);

    let UBOOQUITY_ID = 'Ubooquity';
    let UBOOQUITY_ROUTE = '/ubooquity';
    let UBOOQUITY_PROXYOF = ':2039/ubooquity';
    IDs.push(UBOOQUITY_ID);
    SERVICES.push(UBOOQUITY_ROUTE);
    PROXY_URLS.push(UBOOQUITY_PROXYOF);

    let OWNCLOUD_ID = 'ownCloud';
    let OWNCLOUD_ROUTE = '/owncloud';
    let OWNCLOUD_PROXYOF = 'none';
    IDs.push(OWNCLOUD_ID);
    SERVICES.push(OWNCLOUD_ROUTE);
    PROXY_URLS.push(OWNCLOUD_PROXYOF);

    let WORDPRESS_ID = 'Wordpress';
    let WORDPRESS_ROUTE = '/wordpress';
    let WORDPRESS_PROXYOF = 'none';
    IDs.push(WORDPRESS_ID);
    SERVICES.push(WORDPRESS_ROUTE);
    PROXY_URLS.push(WORDPRESS_PROXYOF);

    //------------------------------ADMIN SERVICES
    let DASHBOARD_ID = 'Dashboard';
    let DASHBOARD_ROUTE = ':5252/';                         //TODO: reverse proxy to the service
    let DASHBOARD_PROXYOF = ':5252/';
    IDs.push(DASHBOARD_ID);
    SERVICES.push(DASHBOARD_ROUTE);
    PROXY_URLS.push(DASHBOARD_PROXYOF);

    let PIHOLE_ID = 'Pi-Hole';
    let PIHOLE_ROUTE = '/admin/index.php';
    let PIHOLE_PROXYOF = 'none';
    IDs.push(PIHOLE_ID);
    SERVICES.push(PIHOLE_ROUTE);
    PROXY_URLS.push(PIHOLE_PROXYOF);

    let WORDPRESS_ADMIN_ID = 'Wordpress-Admin';
    let WORDPRESS_ADMIN_ROUTE = '/wordpress/wp-admin';
    let WORDPRESS_ADMIN_PROXYOF = 'none';
    IDs.push(WORDPRESS_ADMIN_ID);
    SERVICES.push(WORDPRESS_ADMIN_ROUTE);
    PROXY_URLS.push(WORDPRESS_ADMIN_PROXYOF);

    let UBOOQUITY_ADMIN_ID = 'Ubooquity-Admin';
    let UBOOQUITY_ADMIN_ROUTE = '/ubooquity-admin';
    let UBOOQUITY_ADMIN_PROXYOF = ':2038/ubooquity/admin';
    IDs.push(UBOOQUITY_ADMIN_ID);
    SERVICES.push(UBOOQUITY_ADMIN_ROUTE);
    PROXY_URLS.push(UBOOQUITY_ADMIN_PROXYOF);

    // let BITWARDEN_ID = 'Bitwarden';
    // let BITWARDEN_ROUTE = '/bitwarden'; //TODO: fix proxy to the service (https)
    // let BITWARDEN_PROXYOF = ':8001/';
    // IDs.push(BITWARDEN_ID);
    // SERVICES.push(BITWARDEN_ROUTE);
    // PROXY_URLS.push(BITWARDEN_PROXYOF);

    let LIDARR_ID = 'Lidarr';
    let LIDARR_ROUTE = '/lidarr';
    let LIDARR_PROXYOF = ':8686/lidarr';
    IDs.push(LIDARR_ID);
    SERVICES.push(LIDARR_ROUTE);
    PROXY_URLS.push(LIDARR_PROXYOF);

    let READARR_ID = 'Readarr';
    let READARR_ROUTE = '/readarr';
    let READARR_PROXYOF = ':8787/readarr';
    IDs.push(READARR_ID);
    SERVICES.push(READARR_ROUTE);
    PROXY_URLS.push(READARR_PROXYOF);

    let JACKETT_ID = 'Jackett';
    let JACKETT_ROUTE = '/jackett';
    let JACKETT_PROXYOF = ':9117/jackett';
    IDs.push(JACKETT_ID);
    SERVICES.push(JACKETT_ROUTE);
    PROXY_URLS.push(JACKETT_PROXYOF);

    let PHPMYADMIN_ID = 'phpMyAdmin';
    let PHPMYADMIN_ROUTE = '/phpmyadmin/index.php';
    let PHPMYADMIN_PROXYOF = 'none';
    IDs.push(PHPMYADMIN_ID);
    SERVICES.push(PHPMYADMIN_ROUTE);
    PROXY_URLS.push(PHPMYADMIN_PROXYOF);
} 

//----------------------------------------------- MAIN ------------------------------------------------
//send ping to all services
function queryAllServices() {
    for (let i = 0; i < SERVICES.length; i++) {
        queryService(SERVICES[i]);
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
        url: 'http://' + window.location.hostname + service,
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
        console.log(status + response + ' from path: ' + service);
        updateServiceStatus(IDs[SERVICES.indexOf(service)], running_class, running_text, service, running_link_class, PROXY_URLS[SERVICES.indexOf(service)]);
    } else {
        console.log(status + response + ' from path: ' + service);
        updateServiceStatus(IDs[SERVICES.indexOf(service)], stopped_class, stopped_text, service, stopped_link_class, PROXY_URLS[SERVICES.indexOf(service)]);
    }
}

//update the html element with the status of the service
function updateServiceStatus(id, class_name, text, url, link_class, proxy) {
    //status
    let status_element = DOCUMENT.getElementById(id);
    status_element.className = class_name;
    status_element.innerHTML = text;
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
    proxy_element.innerHTML = proxy;
    //quick link
    let quicklink = DOCUMENT.getElementById(id + '_quicklink');
    //if quicklink is not null, add the quicklink to the link
    if (quicklink != null) {
        quicklink.href = link.href;
    }
}

//----------------------------------------------- EVENTS ------------------------------------------------
setupServices();                     //onload, setup the services
queryAllServices();                   //on load, ping all services
setInterval(queryAllServices, 10000); //ping all services every 10 seconds
