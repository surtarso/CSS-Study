// This script should ping each service and update the html elements with the status of the service and links
// Tarso Galvao 08-2022
//------------------------------------------ INITIAL SETUP ------------------------------------------
// SERVICES
const UBOOQUITY_ID = 'ubooquity';
const UBOOQUITY_ROUTE = ':2039';

const OMPD_ID = 'ompd';
const OMPD_ROUTE = '/ompd';

const OWNCLOUD_ID = 'owncloud';
const OWNCLOUD_ROUTE = '/owncloud/login';

//services array
const SERVICES = [UBOOQUITY_ROUTE, OMPD_ROUTE, OWNCLOUD_ROUTE];
//IDs array
const IDs = [UBOOQUITY_ID, OMPD_ID, OWNCLOUD_ID];

//----------------------------------------------- VARS ------------------------------------------------
const DOCUMENT = window.document;
const running_class = 'label label-success';
const running_link_class = 'label label-primary';
const running_text = 'Online';
const stopped_class = 'label label-danger';
const stopped_link_class = 'label label-default';
const stopped_text = 'Offline';


//ping each service and update the html elements with the status of the service
function pingServices() {
    for (let i = 0; i < SERVICES.length; i++) {
        pingService(SERVICES[i]);                       // ping the service
    }
}

//ping a service using ajax and proxyUrl and update the html element with the status of the service
function pingService(service) {
    $.ajax({
        // url: proxyUrl + service,
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

pingServices();
//update the html elements with the status of the service every 5 seconds
setInterval(pingServices, 5000);
