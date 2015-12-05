//parse initialize
Parse.initialize("pasekey", "parsekey");

var menuObj = {};
var menuObj2 ={};
if(!localStorage["ncc-cafeteria-first"]){
 localStorage["ncc-cafeteria-first"] = true;
 }

function closestMenu(flag){
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
				var dil = document.getElementById("nav6").innerHTML;
				if(!flag) menuObj2 = JSON.parse(JSON.stringify(menuObj));
				if(dil[0] == "T"){
					printMenu(menuObj,"TR",flag);
				}
				else
					printMenu(menuObj,"ENG",flag);
				
			  
			}
		}
	}
	else if(!flag && localStorage["ncc-cafeteria-first"] == "true"){
		window.open("welcome.html");
		localStorage["ncc-cafeteria-first"] = false; 
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
	if (closestMealDate(new Date(),flag).slice(-1) == "L"){
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
	if (t.innerHTML == "DİLİ DEĞİŞTİR"){
		
		printMenu(menuObj2,"ENG");
		printMenu(menuObj,"ENG",1);
		for(var i = 0; i<strEn.length; i+=2){
			document.getElementById(strEn[i]).innerHTML = strEn[i+1];
		}
		return;
	}
	else{
		
		printMenu(menuObj2,"TR");
		printMenu(menuObj,"TR",1);
		for(var i = 0; i<strTR.length; i+=2){
			document.getElementById(strTR[i]).innerHTML = strTR[i+1];
		}
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
			if(x){
			window.open("index.html");
			}
		else
			alert("Update error occurred!");		
	},
	error: function(error){
		alert("Please connect internet first"); 
		if(x){
			window.open("index.html");
			}
	}});
}






function makeCall(p){
	window.open(p);
}






