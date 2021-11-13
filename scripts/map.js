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
  		alertLevel,
      reachedInfest=false,
      reachedDead=false,
      reachedColapsed=false
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
    this.reachedInfest = reachedInfest;
    this.reachedDead = reachedDead;
    this.reachedColapsed = reachedColapsed;
  }

  get type(){
  	return this.isRural == 1? "Rural":"Urbano";
  }

  // this is the amount that one country helps towards the cure
  checkActivateCure(){
    if(this.cureRate == 0 && this.state == countryStates[0]){
      if(this.alertLevel == alertLevels[2] || this.alertLevel == alertLevels[1]){
        this.cureRate = 1/generateRandomIntegerInRange(58,300);
      }
    }
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
    if(this.dead > this.population*0.8 ){
      this.state = countryStates[2];
    }else if(this.dead > this.population*0.25){
      this.state = countryStates[1];
    }
    this.checkActivateCure();
  };


  // increase the number of infected in the country
  // infectionRate: disease's infection rate
  increaseInfected(){
    var buffer = this.infected + increaseByRate(this.infected-this.dead, disease.contagionRate);
    if( buffer >= this.population){
      this.infected = this.population;
    }else{
      this.infected = buffer;
    }
    if(this.infected > this.population*0.6 ){
      this.alertLevel = alertLevels[2];
    }else if(this.infected > this.population*0.15){
      this.alertLevel = alertLevels[1];
    }
    this.increaseDead();
  }

  // Country reached a number of infected
  reachedNumberOfInfectedText(number){
    if (this.infected >= number && !this.reachedInfest){
      this.reachedInfest = true;
      return `${this.name} superó los ${number} infectados `;
    }
    return ""; 
  }

  // Country reached a number of dead
  reachedHalfOfDeadText(number){
    if (this.dead >= this.population/2 && !this.reachedDead){
      this.reachedDead = true;
      return `Más de la mitad de la población de ${this.name} ha fallecido`;
    }
    return ""; 
  }

  reachedTheStateColapsed(){
    if (this.state == countryStates[1] && !this.reachedColapsed){
      this.reachedColapsed = true;
      return `${this.name} ha colapsado.`;
    }
    return ""; 
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


  updateProgress(accumulatedProgress){
    this.progressRate += accumulatedProgress;

    // if progress = 100 game over
    //........
  }
}

class DEvent {
  constructor (
      message = "",
      maxTime = 2,
      timelife = 0,
      whenHappens 
  ) {
    this.message = message;
    this.timelife = timelife;
    this.whenHappens = whenHappens;
  }
}

// Global variables
var countriesQuantity = 219;
var globalPopulation = 7000000;
var reachedNumberOfInfected = 10000;
var time = 0;
var countries = [];
var disease = null;
var cure = null;
var gameOver = 0; // 1=win, 2=lose
var events = []
var activeCountry = null;
var activeEvent = null;
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

function openModal(){
   $('#popup').fadeIn('slow');
  $('.popup-overlay').fadeIn('slow');
  $('.popup-overlay').height($(window).height());
}


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
  activeCountry = null;
  activeEvent = null;
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

function updateEventList(country){
  reachedInfected = country.reachedNumberOfInfectedText(reachedNumberOfInfected);
  // reachedDead = country.reachedHalfOfDeadText();
  reachedColapsed = country.reachedTheStateColapsed();
  text = "";
  if (reachedInfected) text = reachedInfected;
  // if (reachedDead) text = reachedDead;
  if (reachedColapsed) text = reachedColapsed;
  if(text){
    event = new DEvent(text, 2, 0, time);
    events.push(event);
    $('#news').text("<< " + event.message + " >>");
  }
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
    countries[findCountryIndexByCode("VE")].infected = 10;
}

// changes the global flag to stop the game
function checkGameOver(totalDead){
  if(totalDead >= globalPopulation && gameOver != 3){
    gameOver = 1; // winner
  }else if (cure.progressRate > 100 && gameOver != 3) {
    gameOver = 2; // loser
  }
}

function executeEverySecond(){
  if (gameOver == 0){
  	time += 1;
      $('#time').text(`Tiempo: ${time}s`);
      updateGame();
      updateMapColor();
      listCountriesInfected();
      globalTotaly();
  }else if(gameOver == 1){
    console.log("EPA")
    openModal()
    $("#gameMessage").text("Plague INC: Has ganado. El planeta colapsó gracias a tu enfermedad.");
    gameOver = 3;
  }else if (gameOver == 2) {
    console.log("EPA2")
    openModal()
   $("#gameMessage").text("Plague INC: Has perdido. Se ha desarrollado una cura para tu enfermedad.");
   gameOver = 3;
  }
}

$( document ).ready(function() {
	prepareGame()
});

function updateCountryTable(country){
  if(country){
    tableContent = country.getTableString();
    document.getElementById('tableData').innerHTML = tableContent;    
  }
}

function updateGame(){
  // Updating countries
  if(gameOver == 0){
    var cureCount = 0;
    for (var i = 0; i < countries.length; i++) {
      // check if there are infected in the 
      if(countries[i].infected > 0){
        // chance to spread the virus over the population
        countries[i].increaseInfected();
        infectCountries(countries[i]);
        updateEventList(countries[i]);
      }
      cureCount += countries[i].cureRate;
    }
    updateCountryTable(activeCountry);
    cure.updateProgress(cureCount);
  }
}

function updateMapColor(){
  // Updating countries color infected
  for (var i = 0; i < countries.length; i++) {
    if (countries[i].dead > 0) {
      var porcen = (countries[i].dead*100)/countries[i].population;
      var opacity = 0.6 + (0.4 * (porcen/100));
      var color = "rgba(87,44,44, "+ opacity +")";
      if ( opacity == 1 ) {
        color = "#f30909";
      }
      $('#'+countries[i].code).css('fill', color);
    }
    
  }
}
//globalPopulation
function globalTotaly(){
  var tDead = 0, tInfected = 0;
  
  //totalInfected
  for (var i = 0; i < countries.length; i++) {
    tDead += countries[i].dead;
    tInfected += countries[i].infected;
  }
  if(tInfected > globalPopulation){
    tInfected = globalPopulation;
  }
  $('#globalPopulation').text(globalPopulation);
  $('#totalInfected').text(tInfected);
  $('#totaldead').text(tDead);
  $('#progressCure').text(`Progreso total de la cura: ${Math.round((cure.progressRate + Number.EPSILON) * 100) / 100}%`);

  checkGameOver(tDead);
}

function listCountriesInfected(){
  var auxCountries = countries.sort(((a, b) => b.dead - a.dead));
  var list = '<table>';
  list += '<tr>';
  list += '<th>Pais</th>';
  list += '<th>Infectados</th>';
  list += '<th>Muertos</th>';
  list += '</tr>';
  
  for (var i = 0; i < auxCountries.length; i++) {
      list += '<tr>';
      list += '<td>'+auxCountries[i].name+'</td>';
      list += '<td>'+auxCountries[i].infected+'</td>';
      list += '<td>'+auxCountries[i].dead+'</td>';
      list += '</tr>';
  }
  list += '</table>'; 
  $('#infectedCountries').html(list);
}

function infectCountries(country){
  // if country.hasBorder/hasLandBorder/hasSeaBorder
  if(!country) return;
  var livingInfected = country.infected-country.dead;
  if( livingInfected > 0 && generateRandomIntegerInRange(0, 100) <= ((livingInfected/country.population)*100)+generateRandomIntegerInRange(0,30)){
    var nextIndex = generateRandomIntegerInRange(0,countries.length-1);
    if(countries[nextIndex].infected < countries[nextIndex].population){
      countries[nextIndex].infected += 1;
    }
  }
}

// returns the increment of a number by a given rate percentage
// has randomness
function increaseByRate(current, irate){
  var rate = irate/100;
  var increment = Math.ceil((current*generateRandomIntegerInRange(70,130)/100)*rate);
  if(increment < 0)
    return 0;
  else
    return increment;
}

$('#start').click(function(){
    var diseaseName = $('#diseaseName').val()
    $('.input-start').css('display', 'none');
  	$('#diseaseName').css('display', 'none');
    $('#start').css('display', 'none');

    disease = new Disease(diseaseName, 90, 16, null, 2);
    cure = new Cure(0,cureStates[0]);
  	$('#map').css('display', 'block');
  	$('#diseaseInfo').css('display', 'block');
  	 $('#time').css('display', 'block');
     $('#infectedCountries').css('display', 'block');
  	$('#diseaseInfo').text(disease.info);

  	setInterval(function(){ 
  		executeEverySecond()
	}, 1000);
});

$('#open').on('click', function(){
  openModal()
  return false;
});
 
$('#close').on('click', function(){
  $('#popup').fadeOut('slow');
  $('.popup-overlay').fadeOut('slow');
  return false;
});

$('.st0').click(function(){
    var id = $(this).attr('id');
    var content = $('.b7-data[data-id="'+id+'"]').text();
    $('#selectedCountry span').text("Pais seleccionado: " + content);
    activeCountry = findCountryByCode(id);
    updateCountryTable(activeCountry)
    //mapa
    $('.st0').removeClass('active');
    $(this).addClass('active');
  
    $('.item-tab').removeClass('active');
    $('.item-tab[data-id="'+id+'"]').addClass('active'); 
});

//tab activo por default
// $('#VE').addClass('active'); //active mapa svg
// $('.item-tab[data-id="VE"]').addClass('active'); 