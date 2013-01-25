var net = require('net');
var cmd = require('commander');
var fs = require('fs');
var formatData = require('../mods/formatData');
var routes = require('../routes');


/**
 * TCP-Client
 **/
var client = new net.Socket();

/**
 * Logger
 **/
var log = {
	info: console.log,
	err: console.err
};

/**
 * Stellt die Verbindung zum Compiler-Server her und
 * kommuniziert mit diesem
 * 
 * @param host
 * @param port
 **/
var connectRemote = function(host, port, callback) {
	if (host === undefined || port === undefined) {
		throw new Error("Keine Verbindungsdaten gegeben");
	}
	
	//Verbinde zum Server
	client.connect(port, host, function() {
		log.info("Verbindung zum Server hergestellt");
	});
	
	//Behandlung der Daten vom Server
	client.on('data', function(data) {
		var jsonData = formatData.json(data);
		
		if (jsonData.ready !== undefined) {
			callback(jsonData.server);
		}
		else {
			routes(jsonData);
		}
	});
};

/**
 * Sendet Dateien an den Server
 * 
 * @param files Array
 **/
var sendFiles = function(files) {
	for (var i in files) {
		//var file = fs.createReadStream(files[i]);
		//file.pipe(client);
		
		var content = fs.readFileSync(files[i]).toString('utf8');
		client.write(JSON.stringify({
			file: files[i],
			content: content
		}));
		
		log.info("PUT " + files[i]);
	}
	
	log.info("Datenübertragung beendet");
};

/**
 * Setzt den Logger für das Module
 * 
 * @param logger
 **/
var setLogger = function(logger) {
	log.info = logger.info || console.log;
	log.err  = logger.err || console.err;
}

//Exportiere Modulefunktionen
module.exports.connectRemote = connectRemote;
module.exports.setLogger = setLogger;
module.exports.sendFiles = sendFiles;

