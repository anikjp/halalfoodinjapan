appControllers.controller('signupCtrl', function ($scope,$state, $http, $stateParams, $ionicHistory,WORDPRESS_API_URL,AuthService,$ionicLoading,$mdSidenav) {
$scope.user = {};

    AuthService.userIsLoggedIn().then(function(response)
    {
      if(response === true)
      {
        //update user avatar and go on
        AuthService.updateUserAvatar();

        $state.go('app.expense');
      }
      else
      {
        $state.go('app.fakeSignUp');
      }
    });

  $scope.doRegister = function(){

    $ionicLoading.show({
      template: 'Registering user...'
    });

    var user = {
      userName: $scope.user.userName,
      password: $scope.user.password,
      email: $scope.user.email,
      displayName: $scope.user.displayName
    };

    console.log(user);
    AuthService.doRegister(user)
    .then(function(user){
        $ionicLoading.hide();
      $mdSidenav('left').close();
            if ($ionicHistory.currentStateName() != 'app.expense') {
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                $state.go('app.expense');
            }

    },function(err){
      //err
      $scope.error = err;
      $ionicLoading.hide();
    });
  };

  // navigateTo is for navigate to other page
  // by using targetPage to be the destination state.
  // Parameter :
  // stateNames = target state to go
  $scope.navigateTo = function (stateName) {
      $timeout(function () {
          $mdSidenav('left').close();
          if ($ionicHistory.currentStateName() != stateName) {
              $ionicHistory.nextViewOptions({
                  disableAnimate: true,
                  disableBack: true
              });
              $state.go(stateName);
          }
      }, ($scope.isAndroid == false ? 300 : 0));
  };// End navigateTo.

  $scope.ionicGoBack = function() {
    console.log("aaa");
    $ionicHistory.goBack();
};

})// End of WordPress Feed Page  Controller.


appControllers.controller('loginCtrl', function ($scope,$rootScope, $http,$state, $stateParams, $ionicHistory,WORDPRESS_API_URL,AuthService,$mdSidenav,$ionicLoading,Userfactory) {

      $scope.user = {};
      $mdSidenav('left').close(); AuthService.userIsLoggedIn().then(function(response)
    {
      if(response === true)
      {

        //update user avatar and go on
        AuthService.updateUserAvatar();
        //$state.go('app.expense');
      }
      else
      {
        $state.go('app.fakeLogin');
      }
    });

  $scope.doLogin = function(){

    $ionicLoading.show({
      template: 'Loging in...'
    });

    var user = {
      userName: $scope.user.userName,
      password: $scope.user.password
    };



    AuthService.doLogin(user)
    .then(function(user){
      $ionicLoading.hide();
      // navigateTo is for navigate to other page
    // by using targetPage to be the destination state.
    // Parameter :
    // stateNames = target state to go
    $rootScope.userisactive="true";
    console.log($rootScope.userisactive);

            if ($ionicHistory.currentStateName() != 'app.expense') {
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                $state.go('app.expense');
            }

    },function(err){
      //err
      $scope.error = err;
      $ionicLoading.hide();
    });
  };


});// End of WordPress Feed Page  Controller.
