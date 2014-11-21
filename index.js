// var phantom = require('phantom');
var phantom = require('phantom');

phantom.create(function (ph) {
  ph.createPage(function (page) {
    /* the page actions */
  });
}, {
  dnodeOpts: {
    weak: false
  }
});

// var phantom = require('node-phantom');
// phantom.create(function(err,ph) {
//   return ph.createPage(function(err,page) {
//   	console.log(arguments)
//     return page.open("http://tilomitra.com/repository/screenscrape/ajax.html", function(err,status) {
//       console.log("opened site? ", status);
//       page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function(err) {
//         //jQuery Loaded.
//         //Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds.
//         setTimeout(function() {
//           return page.evaluate(function() {
//             //Get what you want from the page using jQuery. A good way is to populate an object with all the jQuery commands that you need and then return the object.
//             var h2Arr = [],
//             pArr = [];
//             $('h2').each(function() {
//               h2Arr.push($(this).html());
//             });
//             $('p').each(function() {
//               pArr.push($(this).html());
//             });

//             return {
//               h2: h2Arr,
//               p: pArr
//             };
//           }, function(err,result) {
//             console.log(result);
//             ph.exit();
//           });
//         }, 5000);
//       });
//     });
//   });
// });

// phantom.create(function(ph){
//     ph.createPage(function(page) {
//         page.set("paperSize", { format: "A4", orientation: 'portrait', margin: '1cm' });
//         page.open("http://54.241.159.188/dwr-lep/index.html", function(status) {
//             page.render("c:/temp/dwr-lep.pdf", function(){
//                 console.log("page rendered");
//                 ph.exit();
//             })
//         })
//     })

// });


// var html = ejs.render(htmlFileContent,
//             {seller: "Sakshi Tyagi", buyer: "Test Buyer"});
// var html = 'http://www.google.com';
//  phantom.create(function (error, ph) {
//     ph.createPage(function (error, page) {
//       page.settings = {
//         loadImages: true,
//         localToRemoteUrlAccessEnabled: true,
//         javascriptEnabled: true,
//         loadPlugins: false
//        };
//       page.set('viewportSize', { width: 800, height: 600 });
//       page.set('paperSize', { format: 'A4', orientation: 'portrait', border: '1cm' });
//       page.set('content', html, function (error) {
//         if (error) {
//           console.log('Error setting content: ', error);
//         }
//       });
 
//       page.onResourceRequested = function (rd, req) {
//         console.log("REQUESTING: ", rd[0]["url"]);
//       }
//       page.onResourceReceived = function (rd) {
//         rd.stage == "end" && console.log("LOADED: ", rd["url"]);
//       } 
//       page.onLoadFinished = function (status) {
//         page.render(url, function (error) {
//           if (error) console.log('Error rendering PDF: %s', error);
//           console.log("PDF GENERATED : ", status);
//           ph.exit();
//           cb && cb();
//         });
//       }
//     });
//   });


// var webPage = require('webpage');
// var page = webPage.create();

// page.viewportSize = { width: 1920, height: 1080 };
// page.open("http://www.google.com", function start(status) {
//   page.render('google_home.pdf', {format: 'pdf', quality: '100'});
//   phantom.exit();
// });