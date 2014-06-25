// angular app config will go here

var app = angular.module('superRap', [
        'ngRoute']);

app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when(
                '/heroes', {
                    templateUrl: 'partials/heroes-list.html',
                    controller: 'HeroListCtrl'
            }).when(
                '/hero-form', {
                    templateUrl: 'partials/hero-form.html',
                    controller: 'HeroFormCtrl'
            }).otherwise({
                redirectTo: '/heroes'
            });
        }]);

app.controller('HeroFormCtrl', function($scope, $http, $location) {
    $scope.createHero = function(hero) {
        console.log('creating hero ' + hero);
        $http.post('/api/heroes', hero).success(function(data, status, headers, config) {
            console.log('success');
            $scope.newhero = {};
            $location.path('/heroes');
        }).error(function(data, status, headers, config) { 
            console.log('failed'); 
        });
    };
});

app.controller('HeroListCtrl', function($scope, $http) {
    $scope.title = 'Heroes';

    function load() {
        $http.get('/api/heroes').success(function(data, status, headers, config) {
            $scope.heroes = data
        }).error(function(data, status, headers, config) {
            console.log('failed');
        });
    }

    load();
});
