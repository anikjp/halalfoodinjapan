// Controller of menu toggle.
// Learn more about Sidenav directive of angular material
// https://material.angularjs.org/latest/#/demo/material.components.sidenav
appControllers.controller('menuCtrl', function($scope, $rootScope, $timeout, $mdUtil, $mdSidenav, $log, $ionicHistory, $state, AuthService, Userfactory) {
    // This function is the first activity in the controller.
    // It will initial all variable data and let the function works when page load.
  $scope.initialForm = function() {
        $scope.userFname = "";
        $scope.userLname = "";
        $scope.userimage = "";
        $scope.email = "";

        AuthService.userIsLoggedIn()
            .then(function(response) {
                if (response == true) {
                    $scope.user = AuthService.getUser();
                    if ($scope.user) {
                      $scope.userFname = $scope.user.data.firstname;
                      $scope.userLname = $scope.user.data.lastname;
                      $scope.userimage = $scope.user.avatar.thumbnail;
                      $scope.email = $scope.user.data.email;
                      console.log($scope.userFname,$scope.userLname,$scope.userimage,$scope.email);
                      $rootScope.userisactive = true;
                    }

                } else {

                    console.log("User is not Logged!!", response);
                }
            }, function(err) {
                //err
                console.log(err, "is in menu controller!!")
            });
    }; // End initialForm.
$scope.getuser= function() {

  $scope.user = AuthService.getUser();
  if ($scope.user) {
    $scope.userFname = $scope.user.data.firstname;
    $scope.userLname = $scope.user.data.lastname;
    $scope.userimage = $scope.user.avatar.thumbnail;
    $scope.email = $scope.user.data.email;
    console.log($scope.userFname,$scope.userLname,$scope.userimage,$scope.email);
    $rootScope.userisactive = true;

} else {

  console.log("User is not Logged!!", response);
}
};
    $scope.initialForm();
    $scope.toggleLeft = buildToggler('left');
    // buildToggler is for create menu toggle.
    // Parameter :
    // navID = id of navigation bar.
    function buildToggler(navID) {
        var debounceFn = $mdUtil.debounce(function() {
            $mdSidenav(navID).toggle();
        }, 0);
        return debounceFn;
    }; // End buildToggler.

    $scope.navigateTo = function(stateName) {
        $timeout(function() {
            $mdSidenav('left').close();
            if ($ionicHistory.currentStateName() != stateName) {
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                $state.go(stateName);
            }
        }, ($scope.isAndroid == false ? 300 : 0));
    }; // End navigateTo.

}); // End of menu toggle controller.
