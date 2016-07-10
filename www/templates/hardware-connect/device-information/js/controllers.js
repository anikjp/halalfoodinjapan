// Controller of device information page.
// It use ionic.Platform.device() for getting device information. It will return object of current device.
// Learn more about ionic.Platform.device():
// http://ionicframework.com/docs/api/utility/ionic.Platform/

appControllers.controller('namazscheduleCtrl', function ($scope, $timeout,namaz_schedule_service) {

    // initialForm is the first activity in the controller.
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        // $scope.deviceInformation is store device information data.
        $scope.namaz_schedule = {};

        // Loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#device-information-loading-progress').show();
            }
            else {
                jQuery('#device-information-loading-progress').fadeIn(700);
            }
        }, 400);

        $timeout(function () {
            $scope.deviceInformation = ionic.Platform.device();
            jQuery('#device-information-loading-progress').hide();
            jQuery('#device-information-content').fadeIn();
        }, 1000);
    }; // End initialForm.

  namaz_schedule_service.getNamazSchedule()
    .then(function(NamazSchedule) {
      console.log(NamazSchedule);
      $scope.NamazSchedule=NamazSchedule;
      }).then(function(){
        $scope.ready = true;
        $scope.preloaderDone = true;
      });

    $scope.initialForm();

});// End of device information Controller.
