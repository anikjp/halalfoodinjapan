

// Controller of dashboard.
appControllers.controller('dashboardCtrl', function ($scope,$cordovaMedia, $cordovaGeolocation,$timeout, $interval,$state,$stateParams, $ionicHistory,positionService,weatherService,namaz_schedule_service,post_card_service) {

    //$scope.isAnimated is the variable that use for receive object data from state params.
    //For enable/disable row animation.
    $scope.isAnimated =  $stateParams.isAnimated;

    // navigateTo is for navigate to other page
    // by using targetPage to be the destination state.
    // Parameter :
    // stateNames = target state to go.
    $scope.navigateTo = function (stateName) {
        $timeout(function () {
            if ($ionicHistory.currentStateName() != stateName) {
                $ionicHistory.nextViewOptions({
                    disableAnimate: false,
                    disableBack: true
                });
                $state.go(stateName);
            }
        }, ($scope.isAnimated  ? 300 : 0));
    }; // End of navigateTo.

    // goToSetting is for navigate to Dashboard Setting page
    $scope.goToSetting = function () {
        $state.go("app.dashboardSetting");
    };// End goToSetting.

$scope.date = new Date();
$scope.clock = "loading clock..."; // initialise the time variable
$scope.tickInterval = 1000; //ms
$scope.namaz_status = 0;
$scope.upcomming_namaz_name = null;
$scope.upcomming_namaz_time = null;
$scope.fajr = null;
$scope.dhuhr = null;
$scope.asr = null;
$scope.maghrib = null;
$scope.isha = null;
$scope.post_card = null;
$scope.random1=0;
$scope.random2=1;
$scope.random3=2;
$scope.current_position="searching....."
namaz_schedule_service.getNamazSchedule()
  	.then(function(response) {
      $scope.NamazSchedule=response;
      console.log($scope.NamazSchedule);
  		}).then(function(){
  			$scope.ready = true;
  			$scope.preloaderDone = true;
  		});

      post_card_service.getPostCard()
      .then(function(response) {

        $scope.post_card=response;
        }).then(function(){
        });

        $scope.change_random = function () {
          $scope.random1 = Math.floor((Math.random() * $scope.post_card.length) + 1);
          $scope.random2 = Math.floor((Math.random() * $scope.post_card.length) + 1);
          $scope.random3 = Math.floor((Math.random() * $scope.post_card.length) + 1);
          }

      var tick = function() {
          var now = new Date();
          $scope.now=  Date.now();
          $timeout(tick, $scope.tickInterval); // reset the timer

      }



      // Start the timer
      $timeout(tick, $scope.tickInterval);
      var src = "F:\play.mp3";
      //var media=$cordovaMedia.newMedia(src);
       //media.play();


	$scope.ready = false;
    $scope.units = {
      base: 'metric',
      temp: 'celsius',
      speed: 'm/s'
    }

    $scope.toggleUnits = function() {
      if($scope.ready) {
        $scope.ready = false;
        $timeout(function(){
        if($scope.units.base === 'metric') {
           $scope.units = {
            base: 'imperial',
            temp: 'fahrenheit',
            speed: 'MPH'
          }

          $scope.weather.temperature = $scope.weather.temperature * 1.8 + 32.0;
          $scope.weather.windSpeed = $scope.weather.windSpeed / 0.44704;

        } else {
          $scope.units = {
            base: 'metric',
            temp: 'celsius',
            speed: 'm/s'
          }

          $scope.weather.temperature = ($scope.weather.temperature - 32.0) / 1.8;
          $scope.weather.windSpeed = $scope.weather.windSpeed * 0.44704;
        }

          $scope.ready = true;
        },500);
      }
    };

    // Calculate and set the Phone screen back-ground
    // It changes with temperature
    var setViewBg = function() {
      var resetHue = function(x){
        x =  (x > 360) ? x -360 : x;
        return (x < 0) ? x + 360 : x;
      };

    if(!isNaN($scope.weather.temperature)) {
        var hue = 250 - Math.round(6*$scope.weather.temperature);
        $scope.viewBg = 'linear-gradient(to bottom , hsl(' + resetHue(hue)+',70%,20%), hsl('+resetHue(hue+60) + ',80%,40%))';
      }

	   };

    // Set the page background
    var setMainBg = function() {
    if(!isNaN($scope.weather.temperature)) {
        var mainBg;
         if($scope.weather.temperature > 30)
          mainBg = 'http://emant.altervista.org/ext/w_bg_4.jpg';
        else if ($scope.weather.temperature > 20)
          mainBg = 'http://emant.altervista.org/ext/w_bg_3.jpg';
        else if ($scope.weather.temperature > 10)
          mainBg = 'http://emant.altervista.org/ext/w_bg_2.jpg';
        else
          mainBg = 'http://emant.altervista.org/ext/w_bg_1.jpg';

		// JQlite selection
        angular.element(document.querySelector('body'))
          .css('background-image', 'url(' + mainBg + ')');
      }
    };

    var initializeData = function(){
  var geoSettings = {frequency: 30000, timeout: 1000,enableHighAccuracy: false};
      var geo = $cordovaGeolocation.getCurrentPosition(geoSettings);
      geo.then(function (position) {

              $scope.latitude = position.coords.latitude;
              $scope.longitude = position.coords.longitude;
              return weatherService.getWeather($scope.latitude,$scope.longitude,'JP','metric')
                .then(function(res){
                  $scope.position = res.fulldata.data;
                  $scope.weather = res.weather;
                  $scope.current_position=res.fulldata.data.name;
                  console.log($scope.current_position);
                });

          },
          function error(err) {
              $scope.errors = err;
          }
      );

             $interval(function(){

                    var geoSettings = {frequency: 30000, timeout: 1000,enableHighAccuracy: false};

                    var geo = $cordovaGeolocation.getCurrentPosition(geoSettings);

                    geo.then(function (position) {

                            $scope.latitude = position.coords.latitude;
                            $scope.longitude = position.coords.longitude;
                            return weatherService.getWeather($scope.latitude,$scope.longitude,'JP','metric')
                              .then(function(res){
                                $scope.position = res.fulldata.data;
                                $scope.weather = res.weather;
                              });

                        },
                        function error(err) {
                            $scope.errors = err;
                        }
                    );
                 },100000);




      };


   initializeData();

}); // End of dashboard controller.

// Controller of Dashboard Setting.
appControllers.controller('dashboardSettingCtrl', function ($scope, $state,$ionicHistory,$ionicViewSwitcher) {

    // navigateTo is for navigate to other page
    // by using targetPage to be the destination state.
    // Parameter :
    // stateNames = target state to go.
    // objectData = Object data will send to destination state.
    $scope.navigateTo = function (stateName,objectData) {
            if ($ionicHistory.currentStateName() != stateName) {
                $ionicHistory.nextViewOptions({
                    disableAnimate: false,
                    disableBack: true
                });

                //Next view animate will display in back direction
                $ionicViewSwitcher.nextDirection('back');

                $state.go(stateName, {
                    isAnimated: objectData,
                });
            }
    }; // End of navigateTo.
}); // End of Dashboard Setting controller.
