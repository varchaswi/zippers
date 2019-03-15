var Service = require('node-windows').Service;
 
// Create a new service object
var svc = new Service({
  name:'Automation Zippers',
  description: 'The nodejs.org example web server.',
  script: 'D:\\project\\m2d\\app.js'
});
 
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});
 
svc.install();