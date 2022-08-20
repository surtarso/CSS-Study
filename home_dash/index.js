// This script should ping each service and update the html elements with the status of the service and links
// Tarso Galvao 08-2022

//----------------------------------------------- VARS ------------------------------------------------
const DOCUMENT = window.document;
const IDs = [];
const SERVICES = [];
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
    let UBOOQUITY_ID = 'Ubooquity';
    let UBOOQUITY_ROUTE = ':2039';    //TODO: reverse proxy to the service
    IDs.push(UBOOQUITY_ID);
    SERVICES.push(UBOOQUITY_ROUTE);

    let OMPD_ID = 'OMPD';
    let OMPD_ROUTE = '/ompd';
    IDs.push(OMPD_ID);
    SERVICES.push(OMPD_ROUTE);

    let OWNCLOUD_ID = 'ownCloud';
    let OWNCLOUD_ROUTE = '/owncloud/login';
    IDs.push(OWNCLOUD_ID);
    SERVICES.push(OWNCLOUD_ROUTE);
} 

//----------------------------------------------- MAIN ------------------------------------------------
//send ping to all services
function pingServices() {
    for (let i = 0; i < SERVICES.length; i++) {
        pingService(SERVICES[i]);
    }
}

//ping a service using ajax and send update to the the html element
function pingService(service) {
    $.ajax({
        url: service,
        type: 'HEAD',
        success: function () {
            updateServiceStatus(IDs[SERVICES.indexOf(service)], running_class, running_text, service, running_link_class);
        }
    }).fail(function () {
        console.log('Service ' + service + ' is offline');
        updateServiceStatus(IDs[SERVICES.indexOf(service)], stopped_class, stopped_text, service, stopped_link_class);
    });
}

//update the html element with the status of the service
function updateServiceStatus(id, class_name, text, url, link_class) {
    let element = DOCUMENT.getElementById(id);
    element.className = class_name;
    element.innerHTML = text;
    let link = DOCUMENT.getElementById(id + '_link');
    link.innerHTML = id;
    link.className = link_class;
    link.href = url;
}

//----------------------------------------------- EVENTS ------------------------------------------------
setupServices();                 //onload, setup the services
pingServices();                  //on load, ping all services
setInterval(pingServices, 5000); //ping all services every 5 seconds
