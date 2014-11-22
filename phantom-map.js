var page = require('webpage').create(),
    system = require('system'),
    origin, dest, steps;
    page.viewportSize = {width: 2200, height: 1700}; 

var url, //'http://54.241.159.188/dwr-lep/index.html'
 outfile; //'c:/temp/screenshot.jpg'

if(system.args.length <3){
      console.log('no url specified')
      phantom.exit(1);  
}else{
    console.log(system.args.length)
    url = system.args[1];
    page.open(encodeURI(url), 
        function (status) {
        if (status !== 'success') {
            console.log('Unable to access network');
            phantom.exit(1)
        } else {
            page.evaluate(function(){})
        }
        setTimeout(function(){
            outfile = system.args[2];
            page.render(outfile);
            console.log('rendered:', outfile)
            phantom.exit();
        }, 5000)
    });
}

/*
run from cmd with 
phantomjs --web-security=true phantom-map.js http://54.241.159.188/dwr-lep/index.html c:\temp\shot.jpg
phantomjs --web-security=true phantom-map.js http://localhost:3000/terminal?name=Ports America "c:\temp\ports america.jpg"
phantomjs --web-security=true phantom-map.js http://localhost:3000/terminal?name=nutter c:\temp\nutter.jpg
*/