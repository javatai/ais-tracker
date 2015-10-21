
var Handlebars = require('handlebars');

var fs = require('fs');
var path = require('path');

var filePath = path.join(__dirname, 'triangle.hbs');

fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data){
  if (!err){
    var template = Handlebars.compile(data);

    for (var i=0; i<360; i+=1) {

      filePath = path.join(__dirname, '/input/triangle-' + i + '-stroked.svg');
      fs.writeFile(filePath, template({ angle: i, fill: 'none' }), function (err) {
        if (err) return console.log(err);
        console.log('wrote triangle-' + this.angle + '-stroked.svg');
      }.bind({ angle: i }));


      filePath = path.join(__dirname, '/input/triangle-' + i + '.svg');
      fs.writeFile(filePath, template({ angle: i, fill: '#FFFFFF' }), function (err) {
        if (err) return console.log(err);
        console.log('wrote triangle-' + this.angle + '.svg');
      }.bind({ angle: i }));

    }
  } else {
    console.log(err);
  }
});
