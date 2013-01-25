/**
 * Controller für die Verarbeitung der Serverdaten
 * 
 * @param data
 **/
var routes = function(data) {
	if (data === undefined || typeof(data) != 'object') {
		throw new Error("Serverdaten haben ungültiges Format");
	}
	
	//TODO: Benutze Routes und Routes erstellen
	//		Bearbeiten von Serverdaten z.B. exe Files
}

module.exports = routes;
