appControllers.controller('Userctrl', function($scope, $http, $state, $mdUtil, $ionicPlatform, $cordovaLocalNotification, $log, $timeout, $mdSidenav, $stateParams, $ionicModal, $ionicHistory, $ionicViewSwitcher, WORDPRESS_API_URL, $ionicLoading, AuthService) {

        //var authorizationProcess = oauth1Client.authorize();

        $ionicPlatform.ready(function() {

            // ========== Scheduling

            $scope.scheduleSingleNotification = function() {
                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: 'Title here',
                    text: 'Text here',
                    data: {
                        customProperty: 'custom value'
                    }
                }).then(function(result) {
                    // ...
                });
            };

            $scope.cancelSingleNotification = function() {
                $cordovaLocalNotification.cancel(1).then(function(result) {
                    // ...
                });
            };

        });


        $scope.initialForm = function() {

            AuthService.userIsLoggedIn()
                .then(function(response) {
                    if (response == true) {
                        console.log("User is Logged!!", response);
                        $scope.navigateTo('app.dashboard');
                    } else {

                        console.log("User is not Logged!!", response);
                    }
                }, function(err) {
                    //err
                    console.log(err, "is in menu controller!!")
                });
        }; // End initialForm.

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



        // navigateTo is for navigate to other page
        // by using targetPage to be the destination state.
        // Parameter :
        // stateNames = target state to go
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
            }, ($scope.isAndroid == false ? 30 : 0));
        }; // End navigateTo.

        $scope.navigateToAuth = function(stateName) {
            $timeout(function() {
                $mdSidenav('left').close();
                $state.go(stateName);
            }, ($scope.isAndroid == false ? 30 : 0));
        }; // End navigateTo.

        $ionicModal.fromTemplateUrl('templates/themes/try-app/html/terms-of-service.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.terms_of_service_modal = modal;
        });

        $ionicModal.fromTemplateUrl('templates/themes/try-app/html/privacy-policy.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.privacy_policy_modal = modal;
        });

        $scope.showTerms = function() {
            $scope.terms_of_service_modal.show();
        };

        $scope.showPrivacyPolicy = function() {
            $scope.privacy_policy_modal.show();
        };
    }) // End of WordPress Feed Page  Controller.
