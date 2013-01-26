/**
 * Parsed die Daten zu einem String
 * 
 * @param data
 **/
var string = function(data) {
	return data.toString('utf8');
};

/**
 * Parsed die Daten zu einem JSON-Objekt
 * 
 * @param data
 **/
var json = function(data) {
	return JSON.parse(string(data));
};

//Exportiere Funktionen
module.exports.string = string;
module.exports.json   = json;
