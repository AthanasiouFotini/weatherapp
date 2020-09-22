$(document).ready(function() {
  GetResources('r', 'GET');
  GetResources('v', 'GET');

  responsiveCollapseView();
  $(window).resize(function () {
    responsiveCollapseView();
  });
});

/* Global Vars */
var urlResolutions = 'resolutions';
var urlVariables = 'variables';
var urlHourly = 'hourly';
var endPoint = 'http://api.draxis.gr/weather/meteo/';
var apiKey = '?apikey=4181a631-652a-40a2-a57f-e8338074cc5a';
var url;

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;

/* Runs on document.ready to bring resolutions & variables */
function GetResources(resource, method) {
  switch(resource) {
    case 'r':
      url = endPoint + urlResolutions + apiKey;
      break;
    case 'v':
      url = endPoint + urlVariables + apiKey;
      break;
  } 
  var options = {method: method, url: url};
  doCORSRequest(options, resource);
}

/* RobWu (github) API call to bypass CORS limitations */
function doCORSRequest(options, resource) {
  var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
  var x = new XMLHttpRequest();

  x.open(options.method, cors_api_url + options.url);
  x.onload = x.onerror = function() {
    
    var results = JSON.parse(x.responseText);
    console.log(results);

    if (resource != null) 
    {
      printResource((results || ''), resource);
    }
    else
    {
      printResult((results || ''));
    }
  };
  x.send(options.data);
}

/* Runs through doCORSRequest; Prints 'resource' (resolution & variables) API Results */
function printResource(results, resource) {
  switch(resource) {
    case 'r':
      $.each(results, function(key, value) {   
        $('#resolutions').append($("<option></option>").attr("value", key).text(value)); 
      });
      break;
    case 'v':
      $.each(results, function(key, value) {   
        $('#variables').append($("<option></option>").attr("value", key).text(value)); 
      });
      break;
  }
}

/* Runs through doCORSRequest; Prints hourly API Results */
function printResult(results) {
  var counter = 0;
  var page = 1;
  var display = '';
  var dataKeys = [];
  var dataValues = [];

  $('#table').removeClass('d-none');
  $('#thead').children().remove();
  $('#tbody').children().remove();
  $('#pager').children().remove();
  $('#chartModal .modal-body').children().remove();
  if ($('#buttons').hasClass('d-none')) {
    $('#buttons').removeClass('d-none');
    $('#buttons').addClass('d-flex flex-column align-items-center justify-content-center my-2');
  }


  $('#thead').append("<tr><th onclick='sortTable(0)'>Time</th><th onclick='sortTable(1)'>" + results[Object.keys(results)[0]].description + "</th></tr>");

  $.each(results[Object.keys(results)[0]].data, function(key, value) { 
    
    // create table rows
    $('#tbody').append("<tr data-page='" + page + "' " + display + "><td>" + key + "</td><td>" + value + "</td></tr>");
    counter++;
    if (counter % 4 === 0) {
      page++;
    }
    if (page > 1) {
      display = 'style="display: none;"'
    }

    // create array with data object Keys
    dataKeys.push(key);
    // create array with data object Values
    dataValues.push(value);
  });
  $('#pager').append('<nav><ul class="pagination justify-content-center m-0"></ul></nav>');

  for (var i=1; i<page; i++) {
    var li = '<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="ChangePage(' + i + ')">' + i + '</a></li>'
    $('.pagination').append(li);
  }

  // Create canvas & line chart with Chart.js
  $('#chartModalLabel').text(Object.keys(results)[0] + String.fromCharCode(160) + 'chart');
  $('#chartModal .modal-body').append('<canvas id="chart" height="500" width="500"></canvas>');
  let chart = $('#chart');
  let lineChart = new Chart(chart, {
    type: 'line',
    data: {
      labels: dataKeys,
      datasets: [{
        label: results[Object.keys(results)[0]].description,
        data: dataValues
      }]
    },
    options: {}
  });
}

/* Selects all #tbody tr; If attribute data-page exists AND is equal to param 'n' then show */
function ChangePage(n) {
  $('#tbody tr').each(function () {
    var attr = $(this).attr('data-page');
    if (typeof attr !== typeof undefined && attr !== false) {
      if ($(this).data('page') == n) {
        $(this).show();
      } else {
        $(this).hide();
      }
    }
  });
}

/* Runs upon pressing the submit button to get the hourly data for the selected resolution/variables */
function GetHourlyWeather() {
  //query strings
  var data = {
    lat: $('#lat-input').val(),
    lon: $('#lng-input').val(),
    at_date: today,
    resolution: $('#resolutions option:selected').text(),
    variables: $('#variables option:selected').text(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone // Europe/Athens
  };

  url = endPoint + urlHourly + apiKey + '&lat=' + data.lat +'&lon=' + data.lon + '&at_date=' + data.at_date + '&resolution=' + data.resolution + '&variables=' + data.variables + '&timezone=' + data.timezone;

  var options = {
    method: 'GET',
    url: url
  }

  doCORSRequest(options);
}

/* Table Sorting */
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("table");
  switching = true;
  dir = "asc";
  
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function responsiveCollapseView() {
  let desktopView = $(document).width();
  if(desktopView <= "700") {
    $('.collapse').collapse('hide');
  } else {
    $('.collapse').collapse('show');
  }
}