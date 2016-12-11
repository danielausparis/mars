
myApp.factory('html', function() {

  var genHtmlfromJson=function(obj) {

    var html = '';
    var scaleconstant = 3;
    var imageid = 'q' + obj.preamble.questionid;
    var divid = 'div' + obj.preamble.questionid;

    // generate style for image scale
    html += '<style>#' + imageid + ' { --scale: ' + obj.imagescale
      + '%; }</style>';

    // generate style for text color and background
    if (obj.textcolor) {
      html += '<style> #' + divid + ' { color:' + obj.textcolor + ';';
      html += ' background-color:' + obj.backgroundcolor
        + '; }</style>';
    }

    // enveloping div
    html += '<div id="' + divid
    + '" class="vertical-centered" style="height:100%">';

    // title
    html += '<h1>' + obj.phrase + '</h1>';

    // table
    var tdclasses = '';
    if (obj.preamble.layout == '2cols') {
      tdclasses += "twocols";
    } else {
      tdclasses += "onecol";
    }

    if (obj.preamble.smallfont == 'true') {
      tdclasses += " smallfont";
    }

    if (obj.preamble.layout == '2cols') {
      html += '<table class="twocols"><tr><td class="' + tdclasses + '"><ol>';
    } else {
      html += '<table class="onecol"><tr><td class="' + tdclasses + '"><ol>';
    }

    for (choice of obj.choices) {
      html += '<li>' + choice + '</li>';
    }

    html += '</ol></td>';

    if (obj.preamble.layout == '2cols') {

      html += '<td class="' + tdclasses + '">';
      if (obj.comments.length > 0) {
        html += '<p>' + obj.comments + '</p>';
      }
      if (obj.imagelink.length > 0) {
        html += '<img id="' + imageid + '" src="' + obj.imagelink + '">';
      }
      html += '</td>';
    }

    html += '</tr></table>';

    // close enveloping div
    html += '</div>';


    //console.log(html);

    return(html);

  }

  return {
    genHtmlfromJson : genHtmlfromJson
  };

});
