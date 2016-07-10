// For using flashlight you have to install $cordovaFlashlight by running the following
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin remove nl.x-services.plugins.flashlight
// $ ionic plugin add https://github.com/EddyVerbruggen/Flashlight-PhoneGap-Plugin.git
//
// Learn more about $cordovaFlashlight :
// http://ngcordova.com/docs/plugins/flashlight/
//
// Controller of Flashlight page.
appControllers.controller('flashLightCtrl', function ($scope, $cordovaFlashlight, $ionicHistory,$mdDialog,$ionicModal,$timeout) {


  $scope.ionicGoBack = function() {
    $ionicHistory.goBack();
};

    // initialForm is the first activity in the controller.
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        //$scope.isTurnOn  is Flashlight status.
        $scope.isTurnOn = false;

        //$scope.deviceInformation  is getting device platform.
        $scope.deviceInformation = ionic.Platform.device();
        //If you start your application with flash Light feature.
        //You have to add timeout for 2 sec before run it.
    }; // End initialForm.

  $scope.messages = [
    {id: 1, name: 'Janet Perkins',title: "Message A", selected: false ,img: '/img/restaurant_bg/search15.jpg',},
    {id: 2, name: 'Mary Johnson',title: "Message B", selected: true ,img: '/img/restaurant_bg/search16.jpg',},
    {id: 3, name: 'Mary Johnson' ,title: "Message C", selected: true ,img: '/img/restaurant_bg/search17.jpg',},
  ];

  $scope.people = [
    { name: 'Janet Perkins', img: '/img/restaurant_bg/search11.jpg', newMessage: true },
    { name: 'Mary Johnson', img: '/img/restaurant_bg/search13.jpg', newMessage: false },
    { name: 'Peter Carlsson', img: '/img/restaurant_bg/search14.jpg', newMessage: false }
  ];


});// End of Flashlight Controller.
