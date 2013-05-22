//Based on http://www.html5rocks.com/en/tutorials/webdatabase/todo/

document.addEventListener("deviceready", init, false);

var app = {};
app.db = null;
app.Longitud=0;
app.Latitud=0;
app.Altitud=0;
app.Foto="";
      
app.openDb = function() {
    if(window.sqlitePlugin !== undefined) {
        app.db = window.sqlitePlugin.openDatabase("Todo");
    } else {
        // For debugin in simulator fallback to native SQL Lite
        console.log("Use built in SQL Lite");
        app.db = window.openDatabase("Todo", "1.0", "Cordova Demo", 200000);
    }
}
      
app.createTable = function() {
	var db = app.db;
	db.transaction(function(tx) {
        //tx.executeSql("DROP TABLE IF EXISTS puntos", []);        
		tx.executeSql("CREATE TABLE IF NOT EXISTS puntos(ID INTEGER PRIMARY KEY ASC, punto TEXT, longitud NUMERIC, latitud NUMERIC, altitud NUMERIC, foto TEXT, added_on DATETIME)", []);
	});
}
      
app.addTodo = function(todoText) {
	var db = app.db;    
    
    var smallImage = document.getElementById('smallImage');
    smallImage.style.display = 'none';
	db.transaction(function(tx) {
		var addedOn = new Date();        
        var options = {
				frequency: 1000,
				enableHighAccuracy: true
			};
        navigator.geolocation.getCurrentPosition(app.obtenerPosicion,app.errorHandler,options);
		tx.executeSql("INSERT INTO puntos(punto, longitud, latitud, altitud, foto, added_on) VALUES (?,?,?,?,?,?)",
					  [todoText, app.Longitud,app.Latitud, app.Altitud, app.Foto, addedOn],
					  app.onSuccess,
					  app.onError);
	});
} 
    
app.onError = function(tx, e) {
	console.log("Error: " + e.message);
} 
      
app.onSuccess = function(tx, r) {
	app.refresh();
}
      
app.deleteTodo = function(id) {
	var db = app.db;
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM puntos WHERE ID=?", [id],
					  app.onSuccess,
					  app.onError);
	});
}

app.refresh = function() {
	var renderTodo = function (row) {
		return "<li>" + "<div class='todo-check'></div>" + row.punto + "<img style='width:60px; height:60px;' src='" + row.foto + "' /><a class='button delete' href='javascript:void(0);'  onclick='app.deleteTodo(" + row.ID + ");'><p class='todo-delete'></p></a>" + "<div class='clear'></div>" + "</li>";
	}
    
	var render = function (tx, rs) {
		var rowOutput = "";
		var todoItems = document.getElementById("todoItems");
		for (var i = 0; i < rs.rows.length; i++) {
			rowOutput += renderTodo(rs.rows.item(i));
		}
      
		todoItems.innerHTML = rowOutput;
	}
    
	var db = app.db;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM puntos", [], 
					  render, 
					  app.onError);
	});
}
      
function init() {
    navigator.splashscreen.hide();
	app.openDb();
	app.createTable();
	app.refresh();
    
    var options = {enableHighAccuracy: true};
    navigator.geolocation.getCurrentPosition(app.obtenerPosicion,app.errorHandler,options);
    
    cameraApp = new cameraApp();
    cameraApp.run();
}
      
function addTodo() {
	var todo = document.getElementById("todo");
	app.addTodo(todo.value);
	todo.value = "";
}