// Choose file button
$('#chooseFile').bind('change', function () {
  var filename = $("#chooseFile").val();
  if (/^\s*$/.test(filename)) {
    $(".file-upload").removeClass('active');
    $("#noFile").text("No file chosen..."); 
  }
  else {
    $(".file-upload").addClass('active');
    $("#noFile").text(filename.replace("C:\\fakepath\\", "")); 
  }
});

//Thre html pages 'in' one html page
document.getElementById('viewDocumentLink').addEventListener('click', treatView);
document.getElementById('viewDocumentLink1').addEventListener('click', treatView);
document.getElementById('showVisualization').addEventListener('click',treatVisualization);


function treatView(e){
	e.preventDefault();
	document.getElementById('addDocumentForm').style.display = 'none';
	document.getElementById('viewDocument').style.display = 'block';
  document.getElementById('vizualizimi').style.display = 'none';
	document.getElementById('titulli').innerHTML = 'View Document';
  printDataRows("tabelaDokumentet");
};

function treatVisualization(e){
  e.preventDefault();
  document.getElementById('addDocumentForm').style.display ='none';
  document.getElementById('viewDocument').style.display = 'none';
  document.getElementById('vizualizimi').style.display = 'block';
  document.getElementById('titulli').innerHTML = 'Visualization of data';

};


document.getElementById('shtoDokument').addEventListener('submit', postThisDocument);
document.getElementById('shtoDokument').removeEventListener('submit', postThisData);

function postThisDocument(e) {
  $.ajax({
    url: "http://localhost:3000/documents",
    type: 'POST',
    data: $("#shtoDokument").serialize() + "&scanned="+$('#chooseFile').val(),
    success: function (data) {
        $('#success').text("Document succesfully added!");
        document.getElementById('shtoDokument').reset();
    }
  });
  document.getElementById('shtoDokument').removeEventListener('submit', postThisData, true);
}


function postThisData(e) {
           e.preventDefault();
            $.ajax({
                url: "http://localhost:3000/documents/update/" + GetURLParameter("id"), 
                type: 'PUT',
                data: $("#shtoDokument").serialize() + "&scanned="+$('#chooseFile').val(),
                success: function (data) {
                    $('#success').text("Document succesfully updated!");
                    document.getElementById('shtoDokument').reset();
                }
            });

}

function printDataRows(tableId) {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/documents',
        success: function (data) {
            let output = '<thead class="headeri-i-tabeles"><tr><th style="vertical-align: middle; width:7%">Download</th><th style="vertical-align: middle;">Subject</th><th style="vertical-align: middle;">Classification</th><th style="vertical-align: middle;">Physical location</th><th style="vertical-align: middle;">Document number</th><th style="vertical-align: middle;">Description</th><th style="vertical-align: middle;">Author</th><th style="width: 9%;"></th></tr></thead>';
            for (let i = 0; i < data.length; i++) {
                let filename = data[i].scanned.replace("C:\\fakepath\\", "");
                console.log(filename);
                output += "<tr><td>";
                output += '<a href="download/'+ filename+'"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></a></td><td>';
                output += data[i].subject_document + "</td><td>";
                output += data[i].subject_classification + "</td><td>";
                output += data[i].physical_location + "</td><td>";
                output += data[i].document_number + "</td><td>";
                output += data[i].description + "</td><td>";
                output += data[i].author + "</td><td>";
                output += '<a href="?id='+ data[i]._id + '"><i class="fa fa-pencil" aria-hidden="true"></i></a>&nbsp;';
        
                output += '<a href=""><i class="fa fa-trash-o" id="'+ data[i]._id +'" aria-hidden="true"></i></a>';
                output += "</td> </tr>";
            }

            $('#' + tableId).html(output);
        }
    });
}
$('table').on('click', '.fa-trash-o', deleteDocument);
        

function getOneData(callback, id) {
    $.get('http://localhost:3000/documents/' + id, callback);
}

function deleteDocument(e) {
  e.preventDefault();
  var target = e.target;
   $.ajax({
    url: "http://localhost:3000/documents/delete/" + target.id,
    type: 'DELETE',
    success: function (data) {
       $('#success1').text("Document succesfully deleted!");
       console.log('zanita');
    }
  });

}

function getData(callback) {
  $.get('http://localhost:3000/documents/', callback);
}





// EDIT
function GetURLParameter(sParam) {
  let sPageURL = window.location.search.substring(1);
           let sURLVariables = sPageURL.split('&');
             for (let i = 0; i < sURLVariables.length; i++) {
                 let sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
          return sParameterName[1];
        }
  }
}



if (GetURLParameter('id')) {
  // Callback function
  getOneData(data => {
    document.getElementById('subjectOfDoc').value = data.subject_document;
    document.getElementById('subjectClass').value = data.subject_classification;
    // console.log(data.subject_classification)
    document.getElementById('physicalLoc').value = data.physical_location;
    document.getElementById('documentNo').value = data.document_number;
    document.getElementById('description').value = data.description;
    document.getElementById('author').value = data.author;
    document.getElementById('chooseFile').value = data.scanned;
  }, GetURLParameter("id"));

    document.getElementById('shtoDokument').removeEventListener('submit', postThisDocument);
  document.getElementById('shtoDokument').addEventListener('submit', postThisData);

}

//Data for HighCharts
let dataForHC = [
  ['Supervised', 0],
  ['Unsupervised', 0],
  ['Semi-supervised', 0]
]

getData((data) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].subject_classification == 'Supervised') {
      dataForHC[0][1]++;
    }
    else if (data[i].subject_classification == 'Unsupervised') {
      dataForHC[1][1]++;
    }
    else if (data[i].subject_classification == 'SemiSupervised') {
      dataForHC[2][1]++;
    }
  }
  Highcharts.chart('container', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
    },
    title: {
        text: 'Subject<br>classification',
        align: 'center',
        verticalAlign: 'middle',
        y: 40
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: true,
                distance: -50,
                style: {
                    fontWeight: 'light',
                    color: 'white'
                }
            },
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '75%']
        }
    },
    series: [{
        type: 'pie',
        name: 'Subject classification',
        innerSize: '50%',
        data: dataForHC
    }]
});

});


// Changing the view of the highchart

// Load the fonts
Highcharts.createElement('link', {
   href: 'https://fonts.googleapis.com/css?family=Signika:400,700',
   rel: 'stylesheet',
   type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

// Add the background image to the container
Highcharts.wrap(Highcharts.Chart.prototype, 'getContainer', function (proceed) {
   proceed.call(this);
   this.container.style.background =
      'url(http://www.highcharts.com/samples/graphics/sand.png)';
});


Highcharts.theme = {
   colors: ['#f45b5b', '#8085e9', '#8d4654', '#7798BF', '#aaeeee',
      '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
   chart: {
      backgroundColor: null,
      style: {
         fontFamily: 'Signika, serif'
      }
   },
   title: {
      style: {
         color: 'black',
         fontSize: '16px',
         fontWeight: 'bold'
      }
   },
   subtitle: {
      style: {
         color: 'black'
      }
   },
   tooltip: {
      borderWidth: 0
   },
   legend: {
      itemStyle: {
         fontWeight: 'bold',
         fontSize: '13px'
      }
   },
   xAxis: {
      labels: {
         style: {
            color: '#6e6e70'
         }
      }
   },
   yAxis: {
      labels: {
         style: {
            color: '#6e6e70'
         }
      }
   },
   plotOptions: {
      series: {
         shadow: true
      },
      candlestick: {
         lineColor: '#404048'
      },
      map: {
         shadow: false
      }
   },

   // Highstock specific
   navigator: {
      xAxis: {
         gridLineColor: '#D0D0D8'
      }
   },
   rangeSelector: {
      buttonTheme: {
         fill: 'white',
         stroke: '#C0C0C8',
         'stroke-width': 1,
         states: {
            select: {
               fill: '#D0D0D8'
            }
         }
      }
   },
   scrollbar: {
      trackBorderColor: '#C0C0C8'
   },

   // General
   background2: '#E0E0E8'

};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);



