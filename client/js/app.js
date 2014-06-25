
var app = angular.module('superRap', [
        'ngRoute']);

// url routes
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

// controllers (until we decide to move them out somewhere else)

app.controller('AppCtrl', function($scope) {
    $scope.$on('alter-ego-assumed', function(event, ego) {
        $scope.currentEgo = ego;
    });
});

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

function errorHandler(data, status, headers, config) {
    console.log('failed');
    console.log(status);
    console.log(data);
}

app.controller('PeopleListCtrl', function($scope, $http) {
    $scope.title = 'People';

    function load() {
        $http.get('/api/people').success(function(data, status, headers, config) {
            $scope.people = data
        }).error(errorHandler);
    }

    load();
});

app.controller('AlterEgoCtrl', function($scope, $http) {
    $scope.assumeEgo = function(id) {
        $http.get('/api/alterego?id=' + id).success(function(data, status, headers, config) {
            console.log(data);
            $scope.$emit('alter-ego-assumed', data);
        }).error(errorHandler);
    };
});
