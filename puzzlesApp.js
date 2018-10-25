var puzzlesApp = angular.module('puzzlesApp', ["ngRoute"]).config(function($routeProvider) {
    $routeProvider.when('/menu', {
        templateUrl: 'views/menu.html',
        controller: 'MenuController'
    });
    $routeProvider.when('/gameOptions', {
        templateUrl: 'views/gameOptions.html',
        controller: 'GameOptionsController'
    });
    $routeProvider.when('/game', {
        templateUrl: 'views/game.html',
        controller: 'GameController'
    });
    $routeProvider.otherwise({
        redirectTo: '/menu'
    });
}).run(function($rootScope, $templateCache) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (typeof(current) !== 'undefined') {
            $templateCache.remove(current.templateUrl);
        }
    });
});