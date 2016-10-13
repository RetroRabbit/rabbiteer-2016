module.exports = function ($stateProvider, $urlRouterProvider, $locationProvider) {

  //$locationProvider.html5Mode(true);
  $locationProvider.html5Mode((false));

  $stateProvider.state('Home', {
    url: '/',
    templateUrl: 'templates/home.html',
    controller: require('./home.controller')
  });

  $stateProvider.state('Page1', {
    url: '/page1',
    templateUrl: 'templates/page1.html',
    controller: require('./page1.controller')
  });

  $stateProvider.state('Page2', {
    url: '/page2',
    templateUrl: 'templates/page2.html',
    controller: require('./page2.controller')
  });

  $stateProvider.state('Page3', {
    url: '/page3',
    templateUrl: 'templates/page3.html',
    controller: require('./page3.controller')
  });

  $stateProvider.state('Page4', {
    url: '/page4',
    templateUrl: 'templates/page4.html',
    controller: require('./page4.controller')
  });

  $stateProvider.state('Page5', {
    url: '/page5',
    templateUrl: 'templates/page5.html',
    controller: require('./page5.controller')
  });
  
  $stateProvider.state('devtools', {
    url: '/devtools',
    templateUrl: 'templates/devtools.html',
    controller: require('./devtools.controller')
  });
  $urlRouterProvider.when('', '/');
}