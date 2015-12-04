//parse initialize
//not commited 

var menuObj = {};
var menuObj2 ={};


function closestMenu(flag){
	/*var yemekObj = Parse.Object.extend("Yemekler"); // Parse Object of database.
	
	var query = new Parse.Query(yemekObj); //query of database
	
	query.equalTo("Gun",closestMealDate(new Date(),flag)); //database search


	query.find({
	  success: function(results) {
		// Do something with the returned Parse.Object values
		var object = results[0];
		if (!object) return;
		for(var i = 1; i<6; i++){
			var temps = object.get("Yemek"+i);
			menuObj["TR"+i] = temps.split("/")[0];
			menuObj["ENG"+i] = temps.split("/")[1];
		}
		var dil = document.getElementById("dil").innerHTML;
		if(!flag) menuObj2 = JSON.parse(JSON.stringify(menuObj));
		if(dil[0] == "T"){
			printMenu(menuObj,"TR",flag);
		}
		else
			printMenu(menuObj,"ENG",flag);
		
	  },
	  error: function(error) {
		alert("Error : No internet Connection!");
	  }
	});*/
	if(localStorage["ncc-cafeteria"]){
		DB_mirror = JSON.parse(localStorage["ncc-cafeteria"]);
		today = new Date();
		limit = DB_mirror["EXPDATE"].split("/");
		limitDate = new Date("20"+limit[2],limit[1],limit[0]);
		if(today>limitDate & !flag)
		{
			pref = confirm("Your phone's cafeteria menu is out of date. Would you like to update it ?");
			if(pref) update();
			else return;
		}
		closestMeal = closestMealDate(new Date(),flag);
		for (var i in DB_mirror["FOOD"]){
			if(DB_mirror["FOOD"][i]["DATE"] == closestMeal)
			{
				for(var k = 1; k<6; k++){
				var temps = DB_mirror["FOOD"][i]["YEMEK"+k];
					menuObj["TR"+k] = temps.split("/")[0];
					menuObj["ENG"+k] = temps.split("/")[1];
				}
				var dil = document.getElementById("dil").innerHTML;
				if(!flag) menuObj2 = JSON.parse(JSON.stringify(menuObj));
				if(dil[0] == "T"){
					printMenu(menuObj,"TR",flag);
				}
				else
					printMenu(menuObj,"ENG",flag);
				
			  
			}
		}
	}
	else if(!flag){
		var win = window.open("welcome.html");   
		var timer = setInterval(function() {   
			if(win.closed) {  
				clearInterval(timer); 
				update();
				return;
			}  
		}, 1000); 
	}	
}

function closestMealDate(c,p){
	
	var  today;
	if (c.getDay() == 0){
		c.setDate(c.getDate()+1);
		if(p != undefined)
			return ""+c.getDate()+"/"+(c.getMonth()+1)+"/" + c.getYear().toString().slice(1)+"."+"D";
		else 
			return ""+c.getDate()+"/"+(c.getMonth()+1)+"/" +c.getYear().toString().slice(1)+"."+"L";
	}
	else if(c.getDay() == 6){
		c.setDate(c.getDate()+2);
		if(p != undefined)
			return ""+c.getDate()+"/"+(c.getMonth()+1)+"/" + c.getYear().toString().slice(1)+"."+"D";
		else
			return ""+c.getDate()+"/"+(c.getMonth()+1)+"/" + c.getYear().toString().slice(1)+"."+"L";
	}
	if (c.getHours()<14){
		if(p!=undefined)
			return "" + c.getDate() +"/"+ (c.getMonth() +1)+"/"+ c.getYear().toString().slice(1)+"."+"D";
		else
			return "" + c.getDate() +"/"+ (c.getMonth() +1)+"/"+ +c.getYear().toString().slice(1)+"."+"L";
	}
	else if(c.getHours()<20){
		if(p != undefined){
			c.setDate(c.getDate()+1);
			c.setHours(00);
			return closestMealDate(c,p);
		}
		else
			return "" + c.getDate() +"/"+ (c.getMonth() +1)+"/"+c.getYear().toString().slice(1)+"."+"D";
	}
	else{
		c.setDate(c.getDate()+1);
		if(p != undefined)
			return ""+c.getDate()+"/"+(c.getMonth()+1)+"/"+c.getYear().toString().slice(1)+"."+"D";
		else
			return ""+c.getDate()+"/"+(c.getMonth()+1)+"/"+c.getYear().toString().slice(1)+"."+"L";
	}
}

function printMenu(menuObj,dil, flag){
	var type;
	if (closestMealDate(new Date(),flag).slice(-1) == "o"){
		if(dil == "TR") type = "Öğle Yemeği"
		else type = "Lunch";
		if(!flag)
			document.getElementById("currentMenuTitle").innerHTML = type;
		else
			document.getElementById("nextMenuTitle").innerHTML = type;
	}
	else 
		if(dil == "TR") type = "Akşam Yemeği"
		else type = "Dinner";
		if(!flag)
			document.getElementById("currentMenuTitle").innerHTML = type;
		else
			document.getElementById("nextMenuTitle").innerHTML = type;
	
	var yemekler = "";
	for(var x =1; x<6; x++){
		yemekler = yemekler + "<li>" + menuObj[dil+x] + "</li>\n"; 
	}
	if(!flag)
		document.getElementById("currentMenuItems").innerHTML = yemekler;
	else
		document.getElementById("nextMenuItems").innerHTML = yemekler;
}

function changeLanguage(t){
	if (t.innerHTML == "Türkçe"){
		t.innerHTML = "English";
		printMenu(menuObj2,"ENG");
		printMenu(menuObj,"ENG",1);
		return;
	}
	else{
		t.innerHTML = "Türkçe";
		printMenu(menuObj2,"TR");
		printMenu(menuObj,"TR",1);
		return 0;
	}
}

function update(x){
	var DB = Parse.Object.extend("DB_NCCFOOD"); // Parse Object of database.
	var query = new Parse.Query(DB);
	query.find({success : function(results){
		var localObj = {};
		localObj["FOOD"] = results[0].get("FOOD");
		localObj["EXPDATE"] = results[0].get("EXPDATE");
		localObj["FOOD"] = JSON.parse(localObj["FOOD"]).foods;
		localStorage["ncc-cafeteria"] = JSON.stringify(localObj);
		if(localStorage["ncc-cafeteria"] ) {
			alert("Update is successful.");
			if(!x){
				closestMenu();
				closestMenu(1);}
		}
		else
			alert("Update error occurred!");		
	},
	error: function(error){
		alert("Please connect internet first"); 
	}});
}














