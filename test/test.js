var module = require("node-services");

var distrib = module.get_distrib();
if(distrib === undefined) {
    console.log("Unknown distrib");
    return;
}

console.log("Distributive :" + distrib);


module.get_services_list(function(err, services) {
    if(err != undefined)
        console.error("Got error" + err.message);
   
    module.get_services_list(function(err, services) {
        if(err != undefined) {
            console.error("Got error" + error.message);
        }
        else if(services.length === undefined) {
            console.error("Got 0 active services. It's not possible");
        }
        else {
            var serv = services[0].name;
            console.log("Stopping service " + serv); 
            module.stop_service(serv, function(err, result) {
                if(err != undefined) {
                    console.error(err.message);
                }
                else if(!result) {
                    console.error("Service " + serv + "has not been stopped");
                }
                else {
                    console.log("Starting " + serv + "...");
                    module.start_service(serv, function(err, result) {
                        if(err != undefined) {
                            console.error(err.message);
                        }
                        else if(!result) {
                            console.error("Service " + serv + "has not been started");
                        }
                        else {
                            console.log("OK");                            
                        }
                    });
                }
            })
        }
    }, true); 
});
