// angular app config will go here

var app = angular.module('superRap', [
        'ngRoute']);

app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when(
                '/people', {
                    templateUrl: 'partials/people-list.html',
                    controller: 'PeopleListCtrl'
            }).when(
                '/person-form', {
                    templateUrl: 'partials/person-form.html',
                    controller: 'PersonFormCtrl'
            }).otherwise({
                redirectTo: '/people'
            });
        }]);

app.controller('PersonFormCtrl', function($scope, $http, $location) {
    $scope.createPerson = function(person) {
        console.log('creating person ' + person);
        $http.post('/api/people', person).success(function(data, status, headers, config) {
            console.log('success');
            $scope.newperson = {};
            $location.path('/people');
        }).error(function(data, status, headers, config) { 
            console.log('failed'); 
        });
    };
});

app.controller('PeopleListCtrl', function($scope, $http) {
    $scope.title = 'People';

    function load() {
        $http.get('/api/people').success(function(data, status, headers, config) {
            $scope.people = data
        }).error(function(data, status, headers, config) {
            console.log('failed');
        });
    }

    load();
});
