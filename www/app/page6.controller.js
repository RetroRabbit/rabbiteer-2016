const firebase = require("firebase");
const nipplejs = require("nipplejs");
module.exports = function ($scope) {

//Firebase Config used to connect to your firebase app (cant download this under Firebase Project Settings)
  var config = {
    apiKey: "AIzaSyBnRqWBvsbR-5bnvaRAZZbJc_DQK2JzxHo",
    authDomain: "rabbiteer-bbb91.firebaseapp.com",
    databaseURL: "https://rabbiteer-bbb91.firebaseio.com",
    storageBucket: "rabbiteer-bbb91.appspot.com"
  };

  //Provider used to log into firebase (Can enable multipe providers under the Firebase Auth Section)
  //var providerGitHub = new firebase.auth.GithubAuthProvider();

  //Check if App is initialized if not initialize 
  if (firebase.apps.length == 0)
    firebase.initializeApp(config);

  var s = function (sel) {
    return document.querySelector(sel);
  };
  var sId = function (sel) {
    return document.getElementById(sel);
  };
  var joysticks = {
    static: {
      zone: document.getElementById('zone_joystick'),
      mode: 'static',
      position: {
        left: '50%',
        top: '50%'
      },
      color: 'red'
    }
  };
  var joystick;

  // Get debug elements and map them
  var elDebug = sId('debug');
  var elDump = elDebug.querySelector('.dump');
  var els = {
    position: {
      x: elDebug.querySelector('.position .x .data'),
      y: elDebug.querySelector('.position .y .data')
    },
    force: elDebug.querySelector('.force .data'),
    pressure: elDebug.querySelector('.pressure .data'),
    distance: elDebug.querySelector('.distance .data'),
    angle: {
      radian: elDebug.querySelector('.angle .radian .data'),
      degree: elDebug.querySelector('.angle .degree .data')
    },
    direction: {
      x: elDebug.querySelector('.direction .x .data'),
      y: elDebug.querySelector('.direction .y .data'),
      angle: elDebug.querySelector('.direction .angle .data')
    }
  };
  
  var nbEvents = 0;
// Dump data
  function dump(evt) {
    setTimeout(function () {
      if (elDump.children.length > 4) {
        elDump.removeChild(elDump.firstChild);
      }
      var newEvent = document.createElement('div');
      newEvent.innerHTML = '#' + nbEvents + ' : <span class="data">' +
        evt + '</span>';
      elDump.appendChild(newEvent);
      nbEvents += 1;
    }, 0);
  }
// Print data into elements
  function debug(obj) {
    function parseObj(sub, el) {
      for (var i in sub) {
        if (typeof sub[i] === 'object' && el) {
          parseObj(sub[i], el[i]);
        } else if (el && el[i]) {
          el[i].innerHTML = sub[i];
        }
      }
    }
    setTimeout(function () {
      parseObj(obj, els);
    }, 0);
  }
  $scope.robot = {}
  $scope.robot.name = 'Droid-D3'
  function bindNipple() {
    joystick.on('start', function (evt, data) {
      firebase.database().ref('/robot/')
      .child($scope.robot.name)
      .set({
        "angle": 0,
        "moveX": 542,
        "moveY": 534,
        "scaledX": 0,
        "scaledY":0,
        "online": true
      }, function (e) {
        if (e != null)
          alert(e.message);
      });
      dump(evt.type);
      debug(data);
    }).on('end', function (evt, data) {
      firebase.database().ref('/robot/')
      .child($scope.robot.name)
      .set({
        "angle": 0,
        "moveX": 542,
        "moveY": 534,
        "scaledX": 0,
        "scaledY":0,
        "online": false
      }, function (e) {
        if (e != null)
          alert(e.message);
      });
      dump(evt.type);
      debug(data);
    }).on('move', function (evt, data) {
      firebase.database().ref('/robot/')
      .child($scope.robot.name)
      .set({
        "angle": 360 - data.angle.degree,
        "moveX": 542,
        "moveY": 534,
        "scaledX":data.distance/50.0,
        "scaledY":data.distance/50.0,
        "online": true
      }, function (e) {
        if (e != null)
          alert(e.message);
      });
      dump(evt.type);
      debug(data);
    }).on('dir:up plain:up dir:left plain:left dir:down plain:down dir:right plain:right', function (evt) {                                                                                             
      dump(evt.type);                                                                                            
    }).on('pressure', function (evt, data) {                                                                      
      debug({                                                                                                    
        pressure: data                                                                                           
      })
    });
  }

  function createNipple(evt) {
    var options = {
        zone: document.getElementById('zone_joystick'),

    };
    var type = typeof evt === 'string' ?
      evt : evt.target.getAttribute('data-type');
    if (joystick) {
      joystick.destroy();
    }
    s('.highlight.' + type).className += ' active';
    s('.button.' + type).className += ' active';
    s('.zone.' + type).className += ' active';
    joystick = nipplejs.create(options);
    bindNipple();
  }
  createNipple('dynamic');


  
}