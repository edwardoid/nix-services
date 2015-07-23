var module = require("./../lib/index");

var distrib = module.get_distrib();
if(distrib === undefined) {
    console.log("Unknown distrib");
    return;
}

console.log("Distributive :" + distrib);


module.get_services_list(function(err, services) {
    if(err != undefined)
        console.log("Got error" + err.message);
   
    module.get_services_list(function(err, services) {
        if(err != undefined) {
            console.log("Got error" + err.message);
        }
        else if(services.length === undefined) {
            console.log("Got 0 active services. It's not possible");
        }
        else {
            var serv = services[0].name;
            console.log("Stopping service " + serv); 
            module.stop_service(serv, function(err, result) {
                if(err != undefined) {
                    console.log(err.message);
                }
                else if(!result) {
                    console.log("Service " + serv + "has not been stopped");
                }
                else {
                    console.log("Starting " + serv + "...");
                    module.start_service(serv, function(err, result) {
                        if(err != undefined) {
                            console.log(err.message);
                        }
                        else if(!result) {
                            console.log("Service " + serv + "has not been started");
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
