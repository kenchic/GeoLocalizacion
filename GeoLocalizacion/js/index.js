document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	//gps
    geolocationApp = new geolocationApp();
	geolocationApp.run();
    //camara
    cameraApp = new cameraApp();
    cameraApp.run();
    //sqlite
    navigator.splashscreen.hide();
	app.openDb();
	app.createTable();
	app.refresh();
}