var get_distr_files = [
	"/etc/os-release"
]

var get_servies_list_cmd = {
    'debian' : 'service --status-all',
    'ubuntu' : 'service --status-all',
}

var stop_service_cmd = {
    'debian' : "service {} stop",
    'ubuntu' : "service {} stop",
}


var start_service_cmd = {
    'debian' : "service {} start",
    'ubuntu' : "service {} start",
}


var get_service_status_cmd = {
    'debian' : "service {} status",
    'ubuntu' : "service {} status",
}

function get_distrib() {
    for(i in get_distr_files) {
        var d = read_distib_info_file(get_distr_files[i]);
        if(d != undefined && d != "") {
            return d;
	}
    }
    return undefined;
}

function read_distib_info_file (filename) {
    var release_file_name = "/etc/os-release";
    var fs = require("fs");
    try {

        if(!fs.existsSync(release_file_name)) {
         throw new Error(release_file_name + " does not exists");
        }

        res = fs.readFileSync(release_file_name ).toString().split('\n');
        for(var entry in  res) {
            if(res[entry].indexOf("ID=") === 0)
                return res[entry].substring(3); 
        }
        return undefined;
    }
    catch(ex) {
        return undefined
    }
    return undefined;
}

function get_services_list(callback, actives_only) {
    var distrib = get_distrib();
    if(distrib === undefined || distrib === "") {
        callback(new Error("Unknown distributive"), undefined);
        return;
    }
    var cmd = get_servies_list_cmd[distrib]
    
    if(cmd === undefined || cmd === "") {
        callback(new Error("Unknown distributive"), undefined);
        return;
    }

    var cp = require("child_process");
    cp.exec(cmd, function(error, stdout, stderr) {
        if(error != null) {
            callback(new Error(error), undefined);
            return;
        }

        var raw_res = stdout.split('\n').concat(stderr.split('\n'));
        var res = []
        var re_status = new RegExp(/\[\s+[-+\\?]\s+\]/);
        for(i in raw_res) {
            var raw = raw_res[i].replace(/^\s*|\s*$/g, '')
            if(raw === "")
                continue;
            var tokens = raw.match(re_status);
            if(tokens === undefined || tokens.length === 0)
                continue;
            var status = 'unknown'
            if(tokens[0] === "[ + ]") {
                status = "active";
            }
            else if(tokens[0] === "[ - ]") {
                status = "inactive";
            }
            if(actives_only != undefined && actives_only == true && status != "active")
                continue;
            res.push({ 'status: ' : status, 'name' : raw.substring(tokens[0].length).replace(/^\s*|\s*$/g, '') });
        }

        callback(undefined, res);
    });
}

function stop_service(name, callback) {
    var distrib = get_distrib();
    if(distrib === undefined || distrib === "") {
        callback(new Error("Unknown distributive"), undefined);
        return;
    }
    var cmd = stop_service_cmd[distrib].replace("{}", name);
    
    if(cmd === undefined || cmd === "") {
        callback(new Error("Unknown distributive"), undefined);
        return;
    }

    var cp = require("child_process");
    cp.exec(cmd, function(error, stdout, stderr) {
        if(error != null) {
            callback(new Error(error), false);
        
        }
        else
            callback(undefined, true);
    });
}


function start_service(name, callback) {
    var distrib = get_distrib();
    if(distrib === undefined || distrib === "") {
        callback(new Error("Unknown distributive"), undefined);
        return;
    }
    var cmd = start_service_cmd[distrib].replace("{}", name);
    
    if(cmd === undefined || cmd === "") {
        callback(new Error("Unknown distributive"), undefined);
        return;
    }

    var cp = require("child_process");
    cp.exec(cmd, function(error, stdout, stderr) {
        if(error != null) {
            callback(new Error(error), false);
        }
        else
            callback(undefined, true);
    });
}

function get_service_status(name, callback) {
    var distrib = get_distrib();
    if(distrib === undefined || distrib === "") {
        callback(new Error("Unknown distributive"), undefined);
        return;
    }
    var cmd = get_service_status[distrib].replace("{}", name);
    
    if(cmd === undefined || cmd === "") {
        callback(new Error("Unknown distributive"), undefined);
        return;
    }

    var cp = require("child_process");
    cp.exec(cmd, function(error, stdout, stderr) {
        if(error != null) {
            callback(new Error(error), false);
        }
        else
            callback(undefined, true);
    });
}

module.exports = {
    get_distrib : get_distrib,
    get_services_list : get_services_list,
    start_service : start_service,
    stop_service : stop_service,
    get_service_status : get_service_status
}
