var compressor = require('node-minify');

// Using UglifyJS
compressor.minify({
  compressor: 'clean-css',
  input: ['build/uberpage.bootstrap.3.0.0.css', 'build/uberpage-skeleton.3.0.0.css'],
  output: 'build/uberpage.min.3.0.0.css',
  callback: function (err, min) {}
});



/*
var connect = require('connect');

var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8080, function(){
    console.log('Server running on http://localhost:8080...');
});

*/
//const opn = require('opn')

//opn('http://sindresorhus.com') // Opens the url in the default browser

//opn('http://localhost:8080/test', {app: 'google chrome'}) // Specify the app to open in
