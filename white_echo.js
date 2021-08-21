// JavaScript Document
//global variables
var room, checkedAddItems, numberNights;
var totalCost = 0;

function updateRoom() {
	//function called when a vehicle card div is clicked on
	room = this.dataset.name; //selected room
	alert(room); //test alerts
	var dailyPrice = this.dataset.price; //price of selected room
	alert(dailyPrice); //test alerts
	window.scrollTo(0, document.getElementById("roomInformation").offsetTop - 49);
	document.getElementById("roomOutput").innerHTML = room; //output to the divs in your html
	document.getElementById("priceOutput").innerHTML = "$" + dailyPrice;
	updateBooking(dailyPrice,room);
}

function updateBooking(dailyPrice) {
	var breakfastCost = 25; //breakfast cost is defined here - removed the price from the html
	var breakfastTotal = 0;
	var addItems = document.getElementsByClassName("addCheck");
	//this collects all my additionalitems checkboxes and stores them in an object array
	checkedAddItems = []; //empty list to add the selected additional items to
	var addCost = 0;
	var checkInDate = document.getElementById("checkInDate").value;
	//Checks that a valid pickup date has been entered
	if (document.getElementById("checkInDate").validity.valueMissing || document.getElementById("checkInDate").validity.rangeUnderFlow) {
		document.getElementById("errorMessage-1").innerHTML = "Please enter in a valid check in date that is not a past date";
		return; //forces the user to fix their - the function will stop running
	}
	alert("Check in: " + checkInDate);
	numberNights = document.getElementById("numberNights").value;
	if (document.getElementById("numberNights") == "" || document.getElementById("numberNights").validity.rangeOverflow || document.getElementById("numberNights").validity.rangeUndeflow) {
		document.getElementById("errorMessage0").innerHTML = "Please enter in a valid number of nights between 1 and 10";
		return; //stops the function from runnin - put an inline validation message
	}
	alert("number of nights: " + numberNights);
	for (var i = 0; i < addItems.length; i++) {
		if (addItems[i].checked) {
			checkedAddItems.push(' ' + addItems[i].value); //finds the value
			alert(checkedAddItems);
			addCost += parseInt(addItems[i].dataset.price);
			alert("Added Cost: $" + addCost);
		}
		if (addItems[i].value == "Breakfast") {
			if (addItems[i].checked) {
				breakfastTotal += breakfastCost * numberNights;
			}
		}
	}
	totalCost += Number(numberNights /* * dailyPrice */) + breakfastTotal + addCost;
	alert("Total Cost: $" + totalCost);
	document.getElementById("dateOutput").innerHTML = checkInDate;
	document.getElementById("nightOutput").innerHTML = numberNights;
	document.getElementById("breakfastOutput").innerHTML = "$" + breakfastTotal;
	document.getElementById("extrasOutput").innerHTML = checkedAddItems;
	document.getElementById("totalPriceOutput").innerHTML = "$" + totalCost;
	checkInputs();
}

function checkInputs() {
	var firstName = document.getElementById("firstNameInput").value;
	var lastName = document.getElementById("lastNameInput").value;
	var emailAddress = document.getElementById("emailInput").value;
	var cellphoneNumber = document.getElementById("cellphoneInput").value;
	if (document.getElementById("firstNameInput").validity.patternMismatch || document.getElementById("firstNameInput").validity.valueMissing) {
		document.getElementById("errorMessage1").innerHTML = "Please enter in a valid first name";
		return;
	}
	if (document.getElementById("lastNameInput").validity.patternMismatch || document.getElementById("firstNameInput").validity.valueMissing) {
		document.getElementById("errorMessage2").innerHTML = "Please enter in a valid last name";
		return;
	}
	//Checks that a valid email has been entered
	if (document.getElementById("emailInput") == "" || !document.getElementById("emailInput").checkValidity()) { //checks validity of the email address
		document.getElementById("errorMessage3").innerHTML = "Please enter in a valid email address"; //if empty or invalid, htne prints an error message to help user with functionality 
		return; //forces the user to fix their - the function will stop running	
	}
	if (document.getElementById("cellphoneInput") == "" || document.getElementById("cellphoneInput").validity.valueMissing || document.getElementById("cellphoneInput").validity.patternMismatch) {
		document.getElementById("errorMessage4").innerHTML = "Please enter in a valid cellphone number";
		return;
	}
	alert("First Name: " + firstName + "\n" + "Last Name: " + lastName + "\n" + "Cellphone Number: " + cellphoneNumber + "\n" + "Email Address: " + emailAddress); //test alert
	//write if statements here to check inputs are not NULL and pattern mismatch for Excellence
	//Call the push data function - ACHIEVED VERSION
	pushData(firstName, lastName, cellphoneNumber, emailAddress);
}

function pushData(firstName, lastName, cellphoneNumber, emailAddress) {
	alert("push data function");
	//creating the link to Firebase and pushing to the booking node
	var database = firebase.database()
	var bookingsRef = database.ref('bookings');
	var data = { //creating a JSON file to be sent over the web
		//creating a key pair user_name will be the name of the field in your database
		first_name: firstName,
		last_name: lastName,
		phone: cellphoneNumber,
		email: emailAddress,
		extras: checkedAddItems,
		room_type: room,
		total_cost: "$" + totalCost,
		no_nights: numberNights
	};
	bookingsRef.push(data); //pushing the JSON file to your database
	document.getElementById('confirmOverlay').style.height = "100%"; // display the confirm overlay
	setTimeout(function() { //sets a timer of 3 seconds and will then refresh the page
		location.reload();
	}, 3000);
}
//creating new variables to check the date select is only a present date 
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();
if (dd < 10) {
	dd = '0' + dd
}
if (mm < 10) {
	mm = '0' + mm
}
today = yyyy + '-' + mm + '-' + dd;
document.getElementById("checkInDate").setAttribute("min", today);

//event listener that will call the update room fucntion if a card is clicked
var roomInputs = document.getElementsByClassName("roomCard");
for (var i = 0; i < roomInputs.length; i++) {
	roomInputs[i].addEventListener('click', updateRoom);
}
//event listener for when a user selects nights/dates/extras is clicked
var allInputs = document.getElementsByClassName("addCheck");
for (i = 0; i < allInputs.length; i++) {
	allInputs[i].addEventListener('click', updateBooking);
}