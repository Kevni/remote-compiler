var net = require('net');
var fs = require('fs');
var exec = require('child_process').exec;

var TEMP_DIR = ".tempCompiler";



//Erstelle den temporären Ordner für die Remote-Files
//und fertigen Compiles
if (!fs.existsSync(TEMP_DIR)) {
	fs.mkdirSync(TEMP_DIR);
	
	if (!fs.existsSync(TEMP_DIR)) {
		throw new Error(
			TEMP_DIR + "-Ordner konnte nicht erstellt wirden!");
	}
	else {
		console.log("info: Temp-Ordner wurde erstellt");
	}
}

//Erstelle die Aufgaben des TCP-Server
var server = net.createServer(function(conn) {
	
	conn.write(JSON.stringify({ready: true, server: {cpp: true, java: false}}));

	//Daten vom Client empfangen
	conn.on('data', function(data) {
		var data = JSON.parse(data.toString('utf8'));
		
		if (data.file === undefined || data.content === undefined ) {
			throw new Error("Ungültige Daten vom Client erhalten!");
		}
		
		//Schreibe Quelltext
		fs.writeFile(TEMP_DIR + '/' + data.file, data.content, 
			function(err) {
				if (err) {
					throw new Error(
						"Fehler beim Schreiben der Quelltext-Datei:" 
						+ data.file
					);
				}
				
				console.log("GET " + data.file);
				exec('javac ' + TEMP_DIR + '/' + data.file + ' -o out', 
					function(error, stdout, stderr){
						
						
						console.log('g++ ' + TEMP_DIR + '/' + data.file + ' -o out');
					}
				);
				
				//Kompiliere
				
				
			}
		);
		
		//Kompiliere Datei
		//TODO
		
		
		//Sende Compile zurück
		//TODO
	});
});

//Starte den Webserver
server.listen(9999);
console.log("Starte TCP Server");
