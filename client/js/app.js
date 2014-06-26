
var app = angular.module('superRap', [
        'ngRoute',
        'ngCookies']);

// url routes
app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when(
                '/people', {
                    templateUrl: 'partials/people-list.html',
                    controller: 'PeopleListCtrl'
            }).when(
                '/person/:personId', {
                    templateUrl: 'partials/person-details.html',
                    controller: 'PersonDetailsCtrl'
            }).when(
                '/person-form', {
                    templateUrl: 'partials/person-form.html',
                    controller: 'PersonFormCtrl'
            }).otherwise({
                redirectTo: '/people'
            });
        }]);

// controllers (until we decide to move them out somewhere else)

app.controller('AppCtrl', function($scope, $cookies) {
    $scope.$on('alter-ego-assumed', function(event, ego) {
        console.log($cookies);
        if (ego) {
            $scope.currentEgo = ego;
        } else if ($cookies.ego_id) {
            $scope.currentEgo = {id: $cookies.ego_id, name: $cookies.ego_name};
        }
    });
    $scope.$on('alter-ego-dropped', function(event) {
        console.log($cookies);
        console.log('logging out');
        $scope.currentEgo = null;
    });

    $scope.$emit('alter-ego-assumed');
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

app.controller('PersonDetailsCtrl', function($scope, $http, $routeParams) {
    $scope.id = $routeParams.personId;
    load($scope.id);

    $scope.$watch('id', function(newId, oldId) {
        if (newId != oldId) {
            load(newId);
        }
    });

    function load(id) {
        $http.get('/api/people/' + id).success(function(data, status, headers, config) {
            $scope.person = data;
        }).error(errorHandler);
    }
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

    $scope.becomeNobody = function() {
        console.log('becoming nobody');
        $http.get('/api/alterego').success(function(data, status, headers, config) {
            console.log('emitting logout message');
            $scope.$emit('alter-ego-dropped');
        }).error(errorHandler);
        console.log('argh');
    };

});
