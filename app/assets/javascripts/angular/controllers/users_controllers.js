var myApp = angular.module('myapp', ['ngRoute', 'ngResource']);

//Factory
myApp.factory('Users', ['$resource',function($resource){
  return $resource('/users.json', {},{
    query: { method: 'GET', isArray: true },
    create: { method: 'POST' }
  })
}]);

myApp.factory('User', ['$resource', function($resource){
  return $resource('/users/:id.json', {}, {
    show: { method: 'GET' },
    update: { method: 'PUT', params: {id: '@id'} },
    delete: { method: 'DELETE', params: {id: '@id'} }
  });
}]);
myApp.factory('UserProfile', ['$resource', function($resource){
  return $resource('/users/:id/profile.json', {}, {
    profile: {method: 'GET', isArray: false}
  });
}]);
myApp.factory('UserImage', ['$resource', function($resource){
  return $resource('/users/:id/add_image.json', {}, {
    add_image: {method: 'PUT'}
  });
}]);
//Controller
myApp.controller("UserListCtr", ['$scope', '$http', '$resource', 'Users', 'User', '$location', function($scope, $http, $resource, Users, User, $location) {
  $scope.users = Users.query();
  $scope.deleteUser = function (userId) {
    if (confirm("Are you sure you want to delete this user?")){
      User.delete({ id: userId }, function(){
        $scope.users = Users.query();
        $location.path('/');
      });
    }
  };
}]);
myApp.controller('UserProfileCtr', function($scope, $resource, UserProfile, $location, $routeParams){
  $scope.user = UserProfile.get({ id: $routeParams.id });
});

myApp.controller("UserUpdateCtr", ['$scope', '$resource', 'User', '$location', '$routeParams', function($scope, $resource, User, $location, $routeParams) {
  $scope.user = User.get({id: $routeParams.id})
  $scope.update = function(){
    if ($scope.userForm.$valid){
      User.update({id: $scope.user.id},{user: $scope.user},function(){
      $location.path('/');
      }, function(error) {
        console.log(error)
      });
    }
  };
  $scope.addAddress = function(){
    $scope.user.addresses.push({street1: '', street2: '', city: '', state: '', country: '', zipcode: '' })
  }
  $scope.removeAddress = function(index, user){
    var address = user.addresses[index];
    if(address.id){
      address._destroy = true;
    }else{
      user.addresses.splice(index, 1);
    }
  };
}]);

myApp.controller("UserAddCtr", ['$scope', '$resource', 'Users', '$location', function($scope, $resource, Users, $location) {
  $scope.user = {addresses: [{street1: '', street2: '', city: '', state: '', country: '', zipcode: '' }]}
  $scope.save = function () {
    if ($scope.userForm.$valid){
      Users.create({user: $scope.user}, function(){
        $location.path('/');
      }, function(error){
      console.log(error)
      });
    }
  }
  $scope.addAddress = function(){
    $scope.user.addresses.push({street1: '', street2: '', city: '', state: '', country: '', zipcode: '' })
  }
  $scope.removeAddress = function(index, user){
    var address = user.addresses[index];
    if(address.id){
      address._destroy = true;
    }else{
      user.addresses.splice(index, 1);
    }
  };
}]);

//Routes
myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/users',{
    templateUrl: '/templates/users/index.html',
    controller: 'UserListCtr'
  });
  $routeProvider.when('/users/new', {
    templateUrl: '/templates/users/new.html',
    controller: 'UserAddCtr'
  });
  $routeProvider.when('/users/:id/edit', {
    templateUrl: '/templates/users/edit.html',
    controller: "UserUpdateCtr"
  });
  $routeProvider.when('/users/:id/profile', {
    templateUrl: '/templates/users/profile.html',
    controller: "UserProfileCtr"
  });
  $routeProvider.when('/users/:id/add_image', {
    templateUrl: '/templates/users/add_image.html',
    controller: "UserUpdateCtr"
  });
  $routeProvider.otherwise({
    redirectTo: '/users'
  });
  }
]);