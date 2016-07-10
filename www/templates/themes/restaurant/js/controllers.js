// Controller of WordPress feed Page.
// To connect with WordPress feed you have to install WP REST API to your WordPress site.
// by this link: https://wordpress.org/plugins/json-rest-api/
// Add WP REST API plugin to your WordPress site.
// Set website format to support with WP REST API.
// You can find more information at project documentation.
appControllers.controller('restaurantCtrl', function($scope, $http, $state, $stateParams, $ionicHistory, WORDPRESS_API_URL, restaurants_service,restaurant_ad_service) {


    //background images
    $scope.posts = [];
    $scope.page = 1;
    $scope.restaurant_bg = 1;

    //Always bring me the latest posts => page=1
    $scope.slideHasChanged = function() {
        restaurants_service.get_restaurant_mainbanner()
            .then(function(data) {
                console.log(data);
                $scope.restaurant_bg.push(data);
                //$ionicLoading.hide();
                $ionicSlideBoxDelegate.update();
            });
    };



    restaurants_service.get_restaurant_type()
        .then(function(data) {
            console.log(data);
            if (data.length == 0) {
                $scope.paging.shouldLoadData = true;
            }

            // If have data it will store feed data to  $scope.feedList variable to show in feed.
            else {
                for (var postItem = 0; postItem < data.length; postItem++) {
                    $scope.restaurant_type.push(data[postItem]);
                    console.log($scope.restaurant_type);
                }
                $scope.paging.page = $scope.paging.page + 1;
            }



            $scope.isLoading = false;
            //$ionicLoading.hide();
        });

    restaurants_service.get_location_type()
        .then(function(data) {
            console.log(data);
            if (data.length == 0) {
                $scope.paging.shouldLoadData = true;
            }

            // If have data it will store feed data to  $scope.feedList variable to show in feed.
            else {
                for (var postItem = 0; postItem < data.length; postItem++) {
                    $scope.location_type.push(data[postItem]);
                    //		console.log($scope.restaurant_type);
                }
                $scope.paging.page = $scope.paging.page + 1;
            }



            $scope.isLoading = false;
            //$ionicLoading.hide();
        });

    restaurants_service.get_item_type()
        .then(function(data) {
            console.log(data);
            if (data.length == 0) {
                $scope.paging.shouldLoadData = true;
            }

            // If have data it will store feed data to  $scope.feedList variable to show in feed.
            else {
                for (var postItem = 0; postItem < data.length; postItem++) {
                    $scope.item_type.push(data[postItem]);
                    //		console.log($scope.restaurant_type);
                }
                $scope.paging.page = $scope.paging.page + 1;
            }



            $scope.isLoading = false;
            //$ionicLoading.hide();
        });



        restaurant_ad_service.getRestaurant_Advertisement()
        .then(function(response) {
          $scope.restaurant_ad=response;
          $scope.background1 = {
            background: "url("+response[0].media_details.sizes.medium.source_url+")"
          };
          $scope.background2 = {
            background: "url("+response[1].media_details.sizes.medium.source_url+")"
          };
          $scope.background3 = {
            background: "url("+response[2].media_details.sizes.medium.source_url+")"
          };
          $scope.background4 = {
            background: "url("+response[3].media_details.sizes.medium.source_url+")"
          };
          $scope.background5 = {
            background: "url("+response[4].media_details.sizes.medium.source_url+")"
          };

        console.log($scope.restaurant_ad);
          }).then(function(){
          });



    // This function is the first activity in the controller.
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function() {
        // $scope.feedList is the variable that store feed data from wordPress API.
        $scope.restaurant_type = [];
        $scope.location_type = [];
        $scope.item_type = [];

        // $scope.paging is the variable that store page index of feed data from wordPress API.
        $scope.paging = {
            page: 1,
            shouldLoadData: false
        };

        // $scope.wordpressUrl is the variable that use to call wordPress API.
        // It get wordpressUrl from state parameter that pass from wordpressLogin page.
        $scope.wordpressUrl = $stateParams.wordpressUrl;

        // $scope.isLoading is the variable use for loading.
        $scope.isLoading = false;
    }; // End initialForm.


    // navigateTo is for navigate to other page
    // by using targetPage to be the destination page.
    // Sending objectData and wordpress url to the destination page.
    // Parameter :
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    // wordpressUrl = wordpress url
    $scope.navigateTo = function(targetPage, objectData, wordpressUrl) {
        console.log(objectData);
        console.log(wordpressUrl);
        console.log(targetPage);
        $state.go(targetPage, {
            postDetail: objectData,
            wordpressUrl: wordpressUrl
        });
    }; // End navigateTo.

    // goBack is for navigate back to wordpressLogin page
    $scope.goBack = function() {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go("app.wordpressLogin", {
                isShowError: false
            });
        } // End goBack.

    // doRefresh is for refresh feed and it will set page number to be 1 for refresh.
    $scope.doRefresh = function() {
        $scope.restaurant_type = [];
        $scope.location_type = [];
        $scope.paging.page = 1;
        $scope.paging.shouldLoadData = false;
        $scope.getPostData(false);
    }; // End doRefresh.

    // loadMore is for loading more feed.
    $scope.loadMore = function() {
        if ($scope.isLoading == false) {
            $scope.isLoading = true;
            $scope.getPostData(true);
        }
    }; // End loadMore.

    $scope.initialForm();
}); // End of WordPress Feed Page  Controller.


// Controller of WordPress feed Page.
// To connect with WordPress feed you have to install WP REST API to your WordPress site.
// by this link: https://wordpress.org/plugins/json-rest-api/
// Add WP REST API plugin to your WordPress site.
// Set website format to support with WP REST API.
// You can find more information at project documentation.

// Controller of WordPress Post Page.
appControllers.controller('clothCtrl', function($scope, $http, $state, $timeout, $stateParams, WORDPRESS_API_URL) {

    // This function is the first activity in the controller.
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function() {

            // $scope.post  is post that pass from state parameter from WordPress Feed.
            $scope.item_type = $stateParams.postDetail;
            console.log($scope.item_type);
            // $scope.wordpressUrl  is url that pass from state parameter from WordPress Feed.
            $scope.wordpressUrl = $stateParams.wordpressUrl;

            // $scope.comments  is the variable that store comments of post.
            $scope.restaurants = [];

            $scope.rating = 4;
            $scope.data = {
              rating : 1,
              max: 5
              }
            // The function for show/hide loading progress.
            $timeout(function() {
                if ($scope.isAndroid) {
                    jQuery('#wordpress-post-loading-progress').show();
                } else {
                    jQuery('#wordpress-post-loading-progress').fadeIn(700);
                }
            }, 400); // End loading progress.
        } // End initialForm.

    // API format is YOUR_WORDPRESS_URL/wp-json/posts?_jsonp=JSON_CALLBACK&page=PAGE_NUMBER
    var dataURL = WORDPRESS_API_URL + "wp/v2/ait-item?filter[ait-items]=restaurant_catagory&filter[" + $stateParams.wordpressUrl + "]=" + $stateParams.postDetail;
    console.log(dataURL);
    // http will return feed data.
    $http.get(dataURL).success(function(data, status, headers, config) {
        // Success retrieve data by calling http service.

        // If it don't have data. Loading progress will stop and appear empty feed.
        if (data.length == 0) {
            $scope.paging.shouldLoadData = true;
        }

        // If have data it will store feed data to  $scope.feedList variable to show in feed.
        else {
            for (var postItem = 0; postItem < data.length; postItem++) {
                var imagefile = "";
                var MediaURL = WORDPRESS_API_URL + "wp/v2/media/" + data[postItem].featured_media;
                $http.get(MediaURL, {
                    params: {}
                }).then(function(result) {
                        //success retrieve data by calling http service. it will store comment data to $scope.comments.
                        imagefile = result.data.source_url;
                        console.log(imagefile);
                        $timeout(function() {
                            jQuery('#wordpress-post-loading-progress').hide();
                            jQuery('#wordpress-post-content').fadeIn();
                        }, 100);
                    },
                    function(error) {
                        //Error retrieve data.
                    });
                data[postItem].feature_img = imagefile;
                $scope.restaurants.push(data[postItem]);
                console.log($scope.restaurants);
            }
        }



        $scope.isLoading = false;
    }).
    error(function(data, status, headers, config) {
        // Error retrieve data  it will navigate back to wordpressLogin page.
        $scope.isLoading = false;

        $ionicHistory.nextViewOptions({
            disableBack: false
        });



    });

    // navigateTo is for navigate to other page
    // by using targetPage to be the destination page.
    // Sending objectData and wordpress url to the destination page.
    // Parameter :
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    // wordpressUrl = wordpress url
    $scope.navigateTo = function(targetPage, objectData, wordpressUrl) {
        console.log(targetPage, objectData, wordpressUrl);
        $state.go(targetPage, {
            postDetail: objectData,
            wordpressUrl: wordpressUrl
        });
    }; // End navigateTo.

    $scope.initialForm();
}); // End of WordPress Post Page Controller.

// Controller of WordPress Post Page.
appControllers.controller('restaurantdetailCtrl', function($scope, $http, $stateParams,$cordovaInAppBrowser, $ionicLoading, $timeout, $ionicModal, $ionicPopup, $mdToast, Postlist_service, WORDPRESS_API_URL) {
    // This function is the first activity in the controller.
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function() {

        // $scope.post  is post that pass from state parameter from WordPress Feed.
        $scope.post = $stateParams.postDetail;

        // $scope.wordpressUrl  is url that pass from state parameter from WordPress Feed.
        $scope.wordpressUrl = $stateParams.wordpressUrl;

        // $scope.comments  is the variable that store comments of post.
        $scope.restaurant = [];
        $scope.media = [];
        $scope.featured_image = [];
        $scope.comments = [];
        $scope.initialForm();
        // $scope.comments  is the variable that store comments of post.
        $scope.commentlist = [];
        $scope.stationlist = [];

        console.log("$scope.addcomment");
    }


    $scope.openbrowser = function(link){
      var options = {
            location: 'yes',
            clearcache: 'yes',
            toolbar: 'no'
          };
      $cordovaInAppBrowser.open(link, '_system', options)
      .then(function(event) {
        // success
      })
      .catch(function(event) {
        // error
      });
    }


    $scope.wordpressUrl = "http://abnjp.com/resturent";
    // API format is YOUR_WORDPRESS_URL/wp-json/posts?_jsonp=JSON_CALLBACK&page=PAGE_NUMBER
    var RestaurantURL = $scope.wordpressUrl + "/wp-json/wp/v2/" + $stateParams.wordpressUrl + "/" + $stateParams.postDetail;
    $http.get(RestaurantURL, {
        params: {}
    }).then(function(result) {
            //success retrieve data by calling http service. it will store comment data to $scope.comments.
            $scope.restaurant = result.data;
            console.log("restaurant details", $scope.restaurant);
            console.log("restaurant details featured_media", $scope.restaurant.featured_media);
            var string = $scope.restaurant.content.rendered;
            $scope.restaurant.content.rendered = string.replace(/<p>/i, '');
            $scope.restaurant.content.rendered = $scope.restaurant.content.rendered.replace("</p>", "");
            console.log("scope.featured_image", $scope.restaurant.featured_media);

            $scope.address_map_url="http://maps.googleapis.com/maps/api/staticmap?center="+$scope.restaurant['_ait-item_item-data'][0]['map'].latitude+","+$scope.restaurant['_ait-item_item-data'][0]['map'].longitude+"&zoom=15&size=600x150&markers=Clabel:S%7C"+$scope.restaurant['_ait-item_item-data'][0]['map'].latitude+","+$scope.restaurant['_ait-item_item-data'][0]['map'].longitude+"&format=png&visual_refresh=true";
            console.log("address_map_url", $scope.address_map_url);

            var MediaURL = $scope.wordpressUrl + "/wp-json/wp/v2/media/" + $scope.restaurant.featured_media;
            $http.get(MediaURL, {
                params: {}
            }).then(function(result) {
                    //success retrieve data by calling http service. it will store comment data to $scope.comments.
                    $scope.media = result.data;
                    $timeout(function() {
                        jQuery('#wordpress-post-loading-progress').hide();
                        jQuery('#wordpress-post-content').fadeIn();
                    }, 1000);
                },
                function(error) {
                    //Error retrieve data.
                });



            /////comments////////
            var MediaURL = $scope.wordpressUrl + "/wp-json/wp/v2/comments?post=" + $scope.restaurant.id;
            $http.get(MediaURL, {
                params: {}
            }).then(function(result) {
                    //success retrieve data by calling http service. it will store comment data to $scope.comments.
                    $scope.commentlist = result.data;
                    console.log($scope.commentlist);
                    $timeout(function() {
                        jQuery('#wordpress-post-loading-progress').hide();
                        jQuery('#wordpress-post-content').fadeIn();
                    }, 1000);
                },
                function(error) {
                    //Error retrieve data.
                });

                /////comments////////
                var StationURL = "http://map.simpleapi.net/stationapi?x=" + $scope.restaurant['_ait-item_item-data'][0]['map'].longitude +"&y="+ $scope.restaurant['_ait-item_item-data'][0]['map'].latitude +"&output=json";
                console.log(StationURL);
                $http.get(StationURL, {
                params: {}
                }).then(function(result) {
                //success retrieve data by calling http service. it will store comment data to $scope.comments.
                $scope.stationlist=result.data;
                console.log($scope.stationlist);
                },
                function(error) {
                //Error retrieve data.
                });


        },
        function(error) {
            //Error retrieve data.
        });

    // Triggered on a button click, or some other target

    $scope.showPopup = function() {

        console.log("$scope.addcomment", $scope.restaurant);
        $scope.comment = {};


        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<textarea style="width:100%" rows="7" maxlength="250" placeholder="Write something here ...." ng-model="comment.content"></textarea>',
            title: 'Add your comments!!!',
            scope: $scope,
            buttons: [{
                text: 'Cancel',
                type: 'button-default'
            }, {
                text: '<b>Submit</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.comment.content) {
                        //don't allow the user to close unless he enters wifi password
                        e.preventDefault();
                    } else {
                        console.log($scope.comment.content);
                        return $scope.comment.content;
                    }
                }
            }]
        });


        myPopup.then(function(res) {
            if (res) {
                console.log('Tapped!', res);
                Postlist_service.submitComment($scope.restaurant.id, $scope.comment.content)
                    .then(function(data) {
                        if (data.status == "ok") {
                            var user = Postlist_service.getUser();
                            console.log("after data", data);
                            console.log("after user", user);

                            var comment = {
                                author_name: user.data.username,
                                content: {
                                    rendered: $scope.comment.content
                                },
                                date: Date.now(),
                                author_avatar_urls: {
                                    "24": user.avatar['24']
                                },
                                id: data.comment_id
                            };
                            $scope.commentlist.push(comment);
                            $scope.new_comment = "";
                            $scope.new_comment_id = data.comment_id;
                            console.log("after comments", $scope.commentlist);

                            $mdToast.show({
                                controller: 'toastController',
                                templateUrl: 'toast.html',
                                hideDelay: 800,
                                position: 'top',
                                locals: {
                                    displayOption: {
                                        title: 'Your comment has been posted.'
                                    }
                                }
                            });
                        } else {
                            $mdToast.show({
                                controller: 'toastController',
                                templateUrl: 'toast.html',
                                hideDelay: 800,
                                position: 'top',
                                locals: {
                                    displayOption: {
                                        title: 'Sorry Your comment isnot being posted.'
                                    }
                                }
                            });
                        }
                    });
            }

        });


    };



    $scope.showImages = function(index) {
  $scope.activeSlide = index;
  $scope.showModal('image-popover.html');
  }

  $scope.showModal = function(templateUrl) {
  $ionicModal.fromTemplateUrl(templateUrl, {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();
  });
  }

  // Close the modal
  $scope.closeModal = function() {
  $scope.modal.hide();
  $scope.modal.remove()
  };





 // openGoogleMap is for open Google Map application.
    // Parameter :
    // targetDestinationLocation = latitude,longitude of the destination location.
    $scope.openGoogleMap = function(targetDestinationLocation) {
      //  var targetDestinationLocation=latitude+","+longitude;
        // window.open is to link to URL.
        // The format is comgooglemaps://?q=targetDestinationLocation(latitude,longitude)&zoom=15(Specifies the zoom level of the map).
        //  '_system' is for open map application
        window.open('comgooglemaps://?q=' + targetDestinationLocation + '&zoom=15', '_system');
        // If you would like to custom map you can use this paramitor below:
        // center: This is the map viewport center point. Formatted as a comma separated string of latitude,longitude.
        // mapmode: Sets the kind of map shown. Can be set to: standard or streetview. If not specified, the current application settings will be used.
        // views: Turns specific views on/off. Can be set to: satellite, traffic, or transit. Multiple values can be set using a comma-separator. If the parameter is specified with no value, then it will clear all views.
        // zoom: Specifies the zoom level of the map.
    }; // End openGoogleMap

}); // End of WordPress Post Page Controller.
