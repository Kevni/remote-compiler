var client = require('./lib/tcpClient');
var commander = require('commander');
var fs = require('fs');
var package = require('./package.json');
var compiler = require('./compiler.json');

//Initialisiere CMD
commander
	.version(package.version)
	.usage('[options] <file ...>')
		.option('-c, --cpp', 'Compile with cpp-compiler')
		.option('-j, --java', 'Compile with java compiler')
	.parse(process.argv);

//Fehlerbehandlung bei der Benutzung der CMD
if (!commander.cpp && !commander.java) {
	console.log("Es wurde kein Compiler angegeben [--cpp | --java]");
	process.exit(0);
} 
else if(commander.args.length <= 0) {
	console.log("Es gibt keine Dateien die kompiliert werden sollen");
	process.exit(0);
}

//Ermittle Compiler
var useComp;
if (commander.cpp) useComp = 'cpp';
else if (commander.java) useComp = 'java';

//Verbinde zum Server und kompiliere
client.connectRemote('seaconquerer.com', 9999, 
	//Verbindung hergestellt
	function(server) {
		if (server[useComp] === undefined) {
			console.log("Server kann " + useComp + " nicht kompilieren");
			process.exit(0);
		}
		
		//Prüfe ob Files existierten
		for (var i in commander.args) {
			if (!fs.existsSync(commander.args[i])) {
				console.log("Datei existiert nicht '" 
							+ commander.args[i] + "'");
				process.exit(0);
			}
		}
		
		client.sendFiles(commander.args);
		
		//Übertragung beendet
		process.exit(0);
	}
);



