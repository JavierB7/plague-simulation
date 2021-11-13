// Entities
class Country {
  constructor (
  		code,
  		name,
  		population, 
  		infected, 
  		dead, 
  		cureRate, 
  		state, 
  		isRural, 
  		hasMaritimeDeparture, 
  		hasLandBorder,
  		hasAirExit,
  		climate,
  		alertLevel
  ) {
  	this.code = code;
    this.name = name;
    this.population = population;
    this.infected = infected;
    this.dead = dead;
    this.cureRate = cureRate;
    this.state = state;
    this.isRural = isRural;
    this.hasMaritimeDeparture = hasMaritimeDeparture;
    this.hasLandBorder = hasLandBorder;
    this.hasAirExit = hasAirExit;
    this.climate = climate;
    this.alertLevel = alertLevel;
  }

  get type(){
  	return this.isRural == 1? "Rural":"Urbano";
  }

  /* increases the number of dead people based on the current infected
  NOTE: this doesn't consider population, so the disease can
  erradicate itself by killing all infected before they can spread it*/
  increaseDead(){
    var buffer = this.dead + increaseByRate(this.infected-this.dead, disease.deadRate);
    if(buffer >= this.infected){ // there are no living infected, 
      this.dead = this.infected;
    }else{
      this.dead = buffer;
    }
  };


  // increase the number of infected in the country
  // infectionRate: disease's infection rate
  increaseInfected(){
    this.infected += increaseByRate(this.infected-this.dead, disease.contagionRate);
    if( this.infected >= this.population){
      this.infected = this.population;
    }
    this.increaseDead();
  }

  
  getBooleanString(field){
  	return field == 1? "Si":"No";
  }

  getTableString(){
  	var k = '<tbody>'
    k+= '<tr>';
    k+= '<td> Población </td>';
    k+= '<td>' + this.population + '</td>';
    k+= '</tr>';
    k+= '<tr>';
    k+= '<td> Infectados </td>';
    k+= '<td>' + this.infected + '</td>';
    k+= '</tr>';
    k+= '<tr>';
    k+= '<td> Muertos </td>';
    k+= '<td>' + this.dead + '</td>';
    k+= '</tr>';
    k+= '<tr>';
    k+= '<td> Tasa de cura </td>';
    k+= '<td>' + this.cureRate + '</td>';
    k+= '</tr>';
    k+= '<tr>';
    k+= '<td> Estado </td>';
    k+= '<td>' + this.state + '</td>';
    k+= '</tr>';
    k+= '<tr>';
    k+= '<td> Tipo </td>';
    k+= '<td>' + this.type + '</td>';
    k+= '</tr>';
    k+= '<tr>';
    k+= '<td> Clima </td>';
    k+= '<td>' + this.climate + '</td>';
    k+= '</tr>';
    k+= '<tr>';
    k+= '<td> Salida maritima </td>';
    k+= '<td>' + this.getBooleanString(this.hasMaritimeDeparture) + '</td>';
    k+= '</tr>';
    k+= '<tr>';
    k+= '<td> Frontera terrestre </td>';
    k+= '<td>' + this.getBooleanString(this.hasLandBorder) + '</td>';
    k+= '</tr>';
    k+= '<tr>';
    k+= '<td> Salida aerea </td>';
    k+= '<td>' + this.getBooleanString(this.hasAirExit) + '</td>';
    k+= '</tr>';
    k+= '<tr>';
    k+= '<td> Nivel de alerta </td>';
    k+= '<td>' + this.alertLevel + '</td>';
    k+= '</tr>';
    k+='</tbody>';
    return k;
  }
}

class Disease {
  constructor (
  		name,
  		contagionRate = 0, 
  		deadRate = 0, 
  		mutations, 
  		mutationRate
  ) {
    this.name = name;
    this.contagionRate = contagionRate;
    this.deadRate = deadRate;
    this.mutations = mutations;
    this.mutationRate = mutationRate;
  }

  get info(){
  	return `Enfermedad: ${this.name} - Tasa de contagio: ${this.contagionRate} - Tasa de mortalidad: ${this.deadRate}`;
  }

  mutate(bonusrate){
    this.contagionRate += bonusrate
  }
}

class Cure {
  constructor (
  		progressRate = 0,
  		state = 'No ha comenzado', 
  ) {
    this.progressRate = progressRate;
    this.state = state;
  }
}


// Global variables
var countriesQuantity = 208;
var globalPopulation = 7000000;
var time = 0;
var countries = [];
var disease = null;
var cure = null;
var alertLevels = [
	"No detectada",
	"Detectada",
	"Maximo"
]
var climates = [
	"Frio",
	"Templado"
]
var countryStates = [
	"Funcional",
	"Colapsada",
	"Extinta"
]
var cureStates = [
	"No ha comenzado",
	"En desarrollo",
	"Casi terminada",
	"Lista"
]

const breakIntoParts = (num, parts) => 
        [...Array(parts)].map((_,i) => 
          0|num/parts+(i < num%parts))


function generateRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function cleanGlobalVariables(){
	countries = [];
	disease = null;
	cure = null;
}

function getCountryInitialAttributes(countryCode, countryName, population){
	return [
		countryCode,
		countryName,
  		population, 
  		0, 
  		0, 
  		0, 
  		countryStates[0], 
  		generateRandomIntegerInRange(0, 1), 
  		generateRandomIntegerInRange(0, 1), 
  		generateRandomIntegerInRange(0, 1),
  		generateRandomIntegerInRange(0, 1),
  		climates[generateRandomIntegerInRange(0, 1)],
  		alertLevels[0]
	]
}


function createCountryEntities(){
	// 208 countries for the game
	var aItems = $("#countryList a");
	populationPerCountry = breakIntoParts(globalPopulation, countriesQuantity);
	index = 0;
	for (let a of aItems) {
	    let countryName = $(a).text();   
	    let countryCode = $(a).attr("data-id"); 
	   	countries.push(
	   		new Country(
	   			...getCountryInitialAttributes(
	   				countryCode, countryName, populationPerCountry[index]
	   			)
	   		)
	   	);
	   	index += 0;
	}
}

function findCountryByCode(code){
	return countries.find(country => {
  		return country.code === code
	})
}

// returns the index of a country in the countries vector given a code, aka "VE" for venezuela's index
function findCountryIndexByCode(code){
  return countries.findIndex(country => country.code === code)
}

function prepareGame(){
	$('#map').css('display', 'none');
    $('#time').css('display', 'none');
    $('#diseaseInfo').css('display', 'none');
    cleanGlobalVariables()
    createCountryEntities()
    countries[0].infected = 10;
}

function executeEverySecond(){
	time += 1;
    $('#time').text(`Tiempo: ${time}s`);
    updateGame();
}

$( document ).ready(function() {
	prepareGame()
});

function updateGame(){
  // Updating countries
  for (var i = 0; i < countries.length; i++) {
    // check if there are infected in the 
    if(countries[i].infected > 0){
      // chance to spread the virus over the population
      countries[i].increaseInfected();
      infectCountries(countries[i]);
    }
  }
}

function infectCountries(country){
  // if country.hasBorder/hasLandBorder/hasSeaBorder
  if(country.infected-country.dead > 0 && generateRandomIntegerInRange(0, 100) <= 25){
    if(countries[generateRandomIntegerInRange(0,207)].infected < countries[generateRandomIntegerInRange(0,207)].population){
      countries[generateRandomIntegerInRange(0,207)].infected += 1;
    }
  }
}

// returns the increment of a number by a given rate percentage
// has randomness
function increaseByRate(current, irate){
  var rate = irate/100;
  var increment = Math.ceil((current*generateRandomIntegerInRange(0.7,1.3))*rate);
  if(increment < 0)
    return 0;
  else
    return increment;
}

$('#start').click(function(){
    var diseaseName = $('#diseaseName').val()
  	$('#diseaseName').css('display', 'none');
    $('#start').css('display', 'none');

    disease = new Disease(diseaseName, 80, 0.5, null, 2);
  	$('#map').css('display', 'block');
  	$('#diseaseInfo').css('display', 'block');
  	 $('#time').css('display', 'block');
  	$('#diseaseInfo').text(disease.info);

  	setInterval(function(){ 
  		executeEverySecond()
	}, 1000);
});

$('.st0').click(function(){
    var id = $(this).attr('id');
    var content = $('.b7-data[data-id="'+id+'"]').text();
    $('#selectedCountry span').text("Pais seleccionado: " + content);
    country = findCountryByCode(id);
    if(country){
    	tableContent = country.getTableString();
    	document.getElementById('tableData').innerHTML = tableContent;
    }
    //mapa
    $('.st0').removeClass('active');
    $(this).addClass('active');
  
    $('.item-tab').removeClass('active');
    $('.item-tab[data-id="'+id+'"]').addClass('active'); 
});

//tab activo por default
// $('#VE').addClass('active'); //active mapa svg
// $('.item-tab[data-id="VE"]').addClass('active'); 