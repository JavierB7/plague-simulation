
//script tab
$('.st0').click(function(){
  var id = $(this).attr('id');
  var content = $('.b7-data[data-id="'+id+'"]').text();
  $('#selectedCountry span').text("Pais seleccionado: " + content);
  //mapa
  $('.st0').removeClass('active');
  $(this).addClass('active');
  
  $('.item-tab').removeClass('active');
  $('.item-tab[data-id="'+id+'"]').addClass('active'); 
});

//tab activo por default
$('#PE').addClass('active'); //active mapa svg
$('.item-tab[data-id="PE"]').addClass('active'); 