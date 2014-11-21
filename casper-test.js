// var casper = require('casperjs');
var casper = requier('casper').create();
casper.start('http://www.weather.com/', function() {
    this.captureSelector('c:/temp/weather.png', '.twc-story-block');
});
casper.run();