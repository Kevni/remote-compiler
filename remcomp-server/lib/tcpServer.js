var net = require('net');
var cmd = require('commander');
var fs = require('fs');
var formatData = require('../mods/formatData');
var routes = require('../routes');


/**
 * TCP-Server
 **/
var server;

/**
 * Workspace
 */
var workspace = ".rc_workspace";

/**
 * Logger
 **/
var log = {
	info: console.log,
	err: console.err
};

/**
 * Startet einen TCP-Server
 **/
var createServer = function(host, port, callback) {
	if (host === undefined || port === undefined) {
		throw new Error("Keine Verbindungsdaten gegeben");
	}
	
	//Erstelle Workspace
	createWorkspace(workspace);

	//Erstelle TCP Server
	server = net.createServer(function(client) {
		
		client.write(JSON.stringify({ready: true, server: {cpp: true, java: false}}));
	
		//Neuer Client wurde verbunden
		log.info("Neuer Client hat sich mit dem Server verbunden");
		
		//Wenn Daten vom Client kommen
		client.on('data', function(data) {
			var jsonData = formatData.json(data);
			
			console.log("Daten empfangen");
			
			routes(jsonData);
		});
	});
	
	return server;
};

/**
 * Erstellt den Workspace für die Projekte
 * @param dir
 */
var createWorkspace = function(dir) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
		
		if (!fs.existsSync(dir)) {
			throw new Error(
				"'" + dir + "'-Ordner konnte nicht erstellt wirden!");
		}
		else {
			log.info("Ordner '"+ dir +"' wurde erstellt");
		}
	}
	
	return true;
};

/**
 * Sendet Dateien an den Server
 * 
 * @param files Array
 **/
var sendFiles = function(files, client) {
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
module.exports.create = createServer;
module.exports.setLogger = setLogger;
module.exports.sendFiles = sendFiles;

