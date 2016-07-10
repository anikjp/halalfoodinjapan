// Controller of WordPress feed Page.
// To connect with WordPress feed you have to install WP REST API to your WordPress site.
// by this link: https://wordpress.org/plugins/json-rest-api/
// Add WP REST API plugin to your WordPress site.
// Set website format to support with WP REST API.
// You can find more information at project documentation.
appControllers.controller('nearbyCtrl', function($scope, $http,$ionicModal,$mdBottomSheet, $interval,$cordovaGeolocation,$state, $stateParams, $ionicLoading, $ionicHistory, WORDPRESS_API_URL, positionService, nearby_service,vibrationCtrl_service,$filter) {


    //background images
    $scope.posts = [];
    $scope.page = 1;
    $scope.restaurant_bg = 1;
    $scope.position = [];
    $scope.distance = [];
    $scope.settingsList=[];
    $scope.latitude='35.825080899999996';
    $scope.longitude='139.5864364';
    $scope.mapid="SATELLITE";

    // This function is the first activity in the controller.
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function() {
        // $scope.feedList is the variable that store feed data from wordPress API.
        $scope.itemlist = [];

        // $scope.paging is the variable that store page index of feed data from wordPress API.
        $scope.paging = {
            page: 1,
            shouldLoadData: false
        };
    }; // End initialForm.


    // sharedProduct fro show shared social bottom sheet by calling sharedSocialBottomSheetCtrl controller.
       $scope.pinClicked = function ($event, item) {
         $scope.selectitem=item;
         console.log('the marker ->', $scope.selectitem); //prints undefined
           $mdBottomSheet.show({
               templateUrl: 'bottom-sheet-shared.html',
               controller: 'sharedSocialBottomSheetCtrl',
               targetEvent: $event,
               locals: {
                   product: item
               }
           });
       };// End sharedProduct.

    console.info($scope.settingsList);
    $interval(function(){

           var geoSettings = {frequency: 3000, timeout: 1000,enableHighAccuracy: false};

           var geo = $cordovaGeolocation.getCurrentPosition(geoSettings);

           geo.then(function (position) {

                   $scope.latitude = position.coords.latitude;
                   $scope.longitude = position.coords.longitude;
                   console.log($scope.latitude,$scope.longitude);
           });
        },5000);




    $scope.distanceTo = function(restaurant) {
        //console.log("console.log($scope.position);", $scope.position);
       // console.log(restaurant.longitude,
        //    restaurant.latitude, $scope.position);

        nearby_service.distance(restaurant.longitude,
                restaurant.latitude, $scope.longitude,$scope.latitude)
            .then(function(data) {
                console.log("distance", data);

            });

        console.log("distance", $scope.distance);

        /*
        console.log(restaurant);
          nearby_service.distance( restaurant.long,
          restaurant.lat, $scope.position.lon, $scope.position.lat);

        var distance = nearby_service.distance( restaurant.long,restaurant.lat, $scope.position.lon, $scope.position.lat)
        restaurant.distance = distance;
        distance = distance.toFixed(1);
        return distance;
        */
    };

    // Setup the loader
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner icon="lines" class="spinner-calm"></ion-spinner>',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    nearby_service.get_all_item_list()
        .then(function(data) {
            if (data.length == 0) {
                $scope.paging.shouldLoadData = true;
            }

            // If have data it will store feed data to  $scope.feedList variable to show in feed.
            else {
                for (var postItem = 0; postItem < data.length; postItem++) {
                        var type=data[postItem]['ait-items'];
                    console.log(data);
                       for (var Item = 0; Item < type.length; Item++) {
                         if(data[postItem]['ait-items'][Item]=="265"){
                        data[postItem].map_icon="http://abnjp.com/resturent/wp-content/uploads/shopping_pin.png";
                         data[postItem].item_type="grocery-shop";                         }
                        else if(data[postItem]['ait-items'][Item]=="261"){
                            data[postItem].map_icon="http://abnjp.com/resturent/wp-content/uploads/sport_pin.png";
                         data[postItem].item_type="mosque";
                        }
                        else if(data[postItem]['ait-items'][Item]=="257"){
                            data[postItem].map_icon="http://abnjp.com/resturent/wp-content/uploads/food_pin.png";
                         data[postItem].item_type="Restaurant";
                        }
                        else{
                            data[postItem].map_icon="";
                        }
                    }

               var  distance= nearby_service.distance(data[postItem]['_ait-item_item-data'][0]['map'].longitude,
                            data[postItem]['_ait-item_item-data'][0]['map'].latitude, $scope.longitude,$scope.latitude);
                    data[postItem].distance=distance;

                    $scope.itemlist.push(data[postItem]);


                }

               console.log($scope.itemlist);
                $scope.paging.page = $scope.paging.page + 1;
            }



            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');

        });

    $scope.loadMoreData = function() {
        $scope.page += 1;


    };

    $scope.moreDataCanBeLoaded = function() {
        return $scope.totalPages > $scope.page;
    };

    // navigateTo is for navigate to other page
    // by using targetPage to be the destination page.
    // Sending objectData and wordpress url to the destination page.
    // Parameter :
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    // wordpressUrl = wordpress url
    $scope.navigateTo = function(targetPage, objectData, wordpressUrl) {
        //console.log(objectData);
        //console.log(wordpressUrl);
        //console.log(targetPage);
        $state.go(targetPage, {
            postDetail: objectData,
            wordpressUrl: wordpressUrl
        });
    }; // End navigateTo.

    // doRefresh is for refresh feed and it will set page number to be 1 for refresh.
    $scope.doRefresh = function() {
        nearby_service.get_all_item_list()
            .then(function(data) {
                 if (data.length == 0) {
                $scope.paging.shouldLoadData = true;
            }

            // If have data it will store feed data to  $scope.feedList variable to show in feed.
            else {
                for (var postItem = 0; postItem < data.length; postItem++) {
                        var type=data[postItem]['ait-items'];
                    console.log(type);
                       for (var Item = 0; Item < type.length; Item++) {
                         if(data[postItem]['ait-items'][Item]=="265"){
                        data[postItem].map_icon="http://abnjp.com/resturent/wp-content/uploads/shopping_pin.png";
                         data[postItem].item_type="grocery-shop";                         }
                        else if(data[postItem]['ait-items'][Item]=="261"){
                            data[postItem].map_icon="http://abnjp.com/resturent/wp-content/uploads/sport_pin.png";
                         data[postItem].item_type="mosque";
                        }
                        else if(data[postItem]['ait-items'][Item]=="257"){
                            data[postItem].map_icon="http://abnjp.com/resturent/wp-content/uploads/food_pin.png";
                         data[postItem].item_type="Restaurant";
                        }
                        else{
                            data[postItem].map_icon="";
                        }
                    }

               var  distance= nearby_service.distance(data[postItem]['_ait-item_item-data'][0]['map'].latitude,
                            data[postItem]['_ait-item_item-data'][0]['map'].longitude, $scope.latitude,$scope.longitude,"KM");
                    data[postItem].distance=distance;

                    $scope.itemlist.push(data[postItem]);


                }

               console.log($scope.itemlist);
                $scope.paging.page = $scope.paging.page + 1;
            }



            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            });
    }; // End doRefresh.



  $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.settingsList = vibrationCtrl_service.settings();
  console.log($scope.settingsList);

     $scope.change = function() {

     }

      $scope.criteriaMatch = function( criteria ) {

    return function( item ) {
        for(var i=0;i<criteria.length;i++){

            if(criteria[i].value!=false){
            console.log(criteria[i].text);
              return item.item_type === criteria[i].text;
            }

        }

    };
  };


  $scope.doFilter = function() {
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };




      $scope.colourIncludes = [];

    $scope.includeColour = function(colour) {
        var i = $.inArray(colour, $scope.colourIncludes);
        if (i > -1) {
            $scope.colourIncludes.splice(i, 1);
        } else {
            $scope.colourIncludes.push(colour);
        }
    }

    $scope.colourFilter = function(itemlist) {
        if ($scope.colourIncludes.length > 0) {
            if ($.inArray(itemlist.item_type, $scope.colourIncludes) < 0)
                return;
        }

        return itemlist;
    }

   $scope.range = {
    value: 180,
    level1wordDescription: "INTERMEDIATE+",
    showitems: 10
  }

    $scope.Is_InRange = function(value) {
        if (value > $scope.range.value == 0)
            return true;
        else
            return false;
    };

     $scope.Is_InRangeinmap = function(itemlist) {

      for (var key in itemlist.map.markers) {
           console.info(itemlist);
          itemlist.map.markers[key].setMap(null);
        };
    };

    $scope.showtype = {
    map: true,
    tab: false
    }

    $scope.changetomap = function() {

         $scope.showtype.map=true;
         $scope.showtype.tab=false;
         console.log($scope.showtype);
    };

    $scope.changetoroad = function() {

         $scope.showtype.road=true;
         $scope.showtype.map=false;
    };

     $scope.changetolist = function() {

         $scope.showtype.map=false;
         $scope.showtype.tab=true;
        console.log($scope.showtype);
    };


    $scope.initialForm();
}); // End of WordPress Feed Page  Controller.

// Controller of share social bottom sheet.
appControllers.controller('sharedSocialBottomSheetCtrl', function ($scope, $mdBottomSheet, $timeout, product, $mdToast, $cordovaSocialSharing) {

$scope.item=product;
  console.log($scope.item);
/*
    // This function is the first activity in the controller.
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        //$scope.setCanvasImage for set canvas image to save to your mobile gallery.
        $scope.setCanvasImage(product.img);
        //$scope.isSaving is image saving status.
        $scope.isSaving = false;
    };// End initialForm.

    //setCanvasImage for set canvas image to save to your mobile gallery.
    $scope.setCanvasImage = function (imgPath) {
        // create canvas image.
        var canvas = document.getElementById('imgCanvas');
        var context = canvas.getContext('2d');
        var imageObj = new Image();

        imageObj.onload = function () {
            canvas.height = this.height;
            canvas.width = this.width;
            context.drawImage(imageObj, 0, 0);
        };
        //image path.
        imageObj.src = imgPath;

        return canvas.toDataURL();
    };// End setCanvasImage.

    // getCanvasImageUrl for get canvas image path.
    $scope.getCanvasImageUrl = function () {
        var canvas = document.getElementById('imgCanvas');
        return canvas.toDataURL();
    };// End getCanvasImageUrl.

    // sharedFacebook for share product picture to facebook by calling $cordovaSocialSharing.
    $scope.sharedFacebook = function () {
        $cordovaSocialSharing.shareViaFacebook(" ", $scope.getCanvasImageUrl());
        $mdBottomSheet.hide();
    }// End sharedFacebook.

    // sharedTwitter for share product picture to twitter by calling $cordovaSocialSharing.
    $scope.sharedTwitter = function () {
        $cordovaSocialSharing.shareViaTwitter(" ", $scope.getCanvasImageUrl());
        $mdBottomSheet.hide();
    }// End sharedTwitter.

    // sharedMail for share product picture to email by calling $cordovaSocialSharing.
    $scope.sharedMail = function () {
        $cordovaSocialSharing.shareViaEmail(" ", "Shopping with ionic meterial", "ionicmaterialdesign@gmail.com", "cc@IonicMeterial.com", "bcc@IonicMeterial.com", $scope.getCanvasImageUrl());
        $mdBottomSheet.hide();
    }// End sharedMail.

    // saveImage for save product picture to mobile gallery.
    $scope.saveImage = function () {

        if ($scope.isSaving == false) {
            try {
                // calling canvas2ImagePlugin to save image to gallery.
                window.canvas2ImagePlugin.saveImageDataToLibrary(
                    function (msg) {

                    },
                    function (err) {
                        throw err;
                    },
                    document.getElementById('imgCanvas'));
                $scope.isSaving = true;

                // show Image Saved ! toast when save image success.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "Image Saved !"
                        }
                    }
                });
            }
            catch (e) {
                console.log(e);
                // show Save Failed : Please try again! toast when save image  is error.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "Save Failed : Please try again!"
                        }
                    }
                });
            }
        }
        // Hide bottom sheet.
        $timeout(function () {
            $mdBottomSheet.hide();
        }, 1800);
    }// End saveImage.

    // sharedMore for hide bottom sheet.
    $scope.sharedMore = function () {

        $mdBottomSheet.hide();
    }// End sharedMore.

    $scope.initialForm();
});// End of share social bottom sheet controller.

// Controller of product check out page.
appControllers.controller('productCheckoutCtrl', function ($scope, $mdToast, $mdDialog) {
    //You can do some thing hear when tap on a credit card button.
    $scope.doSomeThing = function () {

    }// End doSomeThing.

    // showConfirmDialog for show alert box.
    $scope.showConfirmDialog = function ($event) {
        //mdDialog.show use for show alert box for Confirm to complete order.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Complete Order",
                    content: "Confirm to complete Order.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to complete order.

            //Showing Order Completed. Thank You ! toast.
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 1200,
                position: 'top',
                locals: {
                    displayOption: {
                        title: "Order Completed. Thank You !"
                    }
                }
            });
        }, function () {
            // For cancel button to complete order.
        });
    }// End showConfirmDialog.
    */
});// End of product check out controller.
