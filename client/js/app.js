// angular app config will go here

var app = angular.module('superRap', [
        'ngRoute']);

app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when(
                '/heroes', {
                    templateUrl: 'partials/heroes-list.html',
                    controller: 'HeroCtrl'
            }).when(
                '/hero-form', {
                    templateUrl: 'partials/hero-form.html',
                    controller: 'HeroCtrl'
            }).otherwise({
                redirectTo: '/heroes'
            });
        }]);

app.controller('HeroCtrl', function($scope, $http) {
    $scope.title = 'Heroes';

    $scope.createHero = function(hero) {
        console.log('creating hero ' + hero);
        $http.post('/api/heroes', hero).success(function(data, status, headers, config) {
            console.log('success');
        }).error(function(data, status, headers, config) { 
            console.log('failed'); 
        });
    };
});
