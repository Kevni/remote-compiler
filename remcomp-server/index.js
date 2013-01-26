var server = require('./lib/tcpServer');
var commander = require('commander');
var fs = require('fs');
var package = require('./package.json');
var compiler = require('./compiler.json');
var exec = require('child_process').exec;

//Initialisiere CMD
commander
	.version(package.version)
	.usage('[options]')
		.option('-w, --workspace', 'Set workspace for projects (std: .rm_workspace)')
		.option('-j, --java', 'Activate java compiler')
		.option('-c, --cpp', 'Activate c++ compiler')
		.option('-p, --php', 'Activate php interpreter')
	.parse(process.argv);
		
//Ermittle kompilierbare Sprachen
//TODO frei wählbare option für sprachen
function commandExists(cmd) {
	exec('which ' + cmd, 
		function(error, stdout, stderr){
			console.log(error);
			console.log(stdout);
			console.log(stderr);
		}
	);
}

commandExists("g++");
commandExists("blöb");
/*
var info = {languages:{}};
if (commander.java) {
	info.languages.java = true;
}
if (commander.cpp)  info.languages.cpp  = true;
if (languages.php)  info.languages.php  = true;




//Verbinde zum Server und kompiliere
server.create('seaconquerer.com', 9999, info);

*/

