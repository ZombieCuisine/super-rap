// angular app config will go here

var app = angular.module('superRap', []);

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
