//Based on http://www.html5rocks.com/en/tutorials/webdatabase/todo/

document.addEventListener("deviceready", init, false);

var app = {};
app.db = null;
      
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
		tx.executeSql("CREATE TABLE IF NOT EXISTS puntos(ID INTEGER PRIMARY KEY ASC, todo TEXT, longitud NUMERIC, added_on DATETIME)", []);
	});
}
      
app.addTodo = function(todoText) {
	var db = app.db;
	db.transaction(function(tx) {
		var addedOn = new Date();
        navigator.geolocation.watchPosition(obtenerPosicion);
		tx.executeSql("INSERT INTO puntos(todo, longitud, added_on) VALUES (?,?,?)",
					  [todoText, Longitud, addedOn],
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
		return "<li>" + "<div class='todo-check'></div>" + row.todo + " lon:" + row.longitud +  "<a class='button delete' href='javascript:void(0);'  onclick='app.deleteTodo(" + row.ID + ");'><p class='todo-delete'></p></a>" + "<div class='clear'></div>" + "</li>";
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
}
      
function addTodo() {
	var todo = document.getElementById("todo");
	app.addTodo(todo.value);
	todo.value = "";
}