// Controller of WordPress feed Page.
// To connect with WordPress feed you have to install WP REST API to your WordPress site.
// by this link: https://wordpress.org/plugins/json-rest-api/
// Add WP REST API plugin to your WordPress site.
// Set website format to support with WP REST API.
// You can find more information at project documentation.

// Controller of WordPress Post Page.
appControllers.controller('MosqueCtrl', function ($scope, $http, $state, $timeout,$ionicLoading,Mosque_service) {

  $scope.mosque_list = [];
  $scope.page = 1;
  $scope.totalPages = 1;
   $scope.paging = {
            page: 1,
            shouldLoadData: false
        };  
    
//Always bring me the latest posts => page=1
      // Setup the loader
  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner icon="lines" class="spinner-calm"></ion-spinner>',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
   Mosque_service.get_mosque_list()
    .then(function(data){
        console.log(data);
     if (data.length == 0) {
                $scope.paging.shouldLoadData = true;
            } 

            // If have data it will store feed data to  $scope.feedList variable to show in feed.
            else {
                for (var postItem = 0; postItem < data.length; postItem++) {
                    $scope.mosque_list.push(data[postItem]);
			//		console.log($scope.restaurant_type);	
                }
                $scope.paging.page = $scope.paging.page + 1;
            }

      

            $scope.isLoading = false;
			$ionicLoading.hide();
    }); 
  
   
});// End of WordPress Post Page Controller.

// Controller of WordPress Post Page.
appControllers.controller('MosqueCtrldetailCtrl', function ($scope, $http, $timeout, $stateParams) {
    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

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
}

	$scope.wordpressUrl="http://abnjp.com/resturent";
		// API format is YOUR_WORDPRESS_URL/wp-json/posts?_jsonp=JSON_CALLBACK&page=PAGE_NUMBER
        var RestaurantURL = $scope.wordpressUrl + "/wp-json/wp/v2/"+$stateParams.wordpressUrl+"/"+$stateParams.postDetail;
		$http.get(RestaurantURL, {
            params: {}
        }).then(function (result) {
            //success retrieve data by calling http service. it will store comment data to $scope.comments.
                $scope.restaurant = result.data;
				console.log($scope.restaurant);
				var string=$scope.restaurant.content.rendered;
				$scope.restaurant.content.rendered = string.replace(/<p>/i, '');
				$scope.restaurant.content.rendered = $scope.restaurant.content.rendered.replace("</p>", "");
				$scope.featured_image =$scope.restaurant.featured_image;
		

				
				
				
				
				var MediaURL = $scope.wordpressUrl + "/wp-json/wp/v2/media/"+$scope.featured_image;
		$http.get(MediaURL, {
            params: {}
        }).then(function (result) {
				//success retrieve data by calling http service. it will store comment data to $scope.comments.
                $scope.media = result.data;
                $timeout(function () {
                    jQuery('#wordpress-post-loading-progress').hide();
                    jQuery('#wordpress-post-content').fadeIn();
                }, 1000);
            },
            function (error) {
                //Error retrieve data.
            });

			var headers = {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
		
					var station = "http://geoapi.heartrails.com/api/json?method=getStations&postal=0010010";
				console.log(station);	
		$http.get(station, {
            params: {}
        }).then(function (result) {
				//success retrieve data by calling http service. it will store comment data to $scope.comments.
                $scope.media = result.data;
                $timeout(function () {
                    jQuery('#wordpress-post-loading-progress').hide();
                    jQuery('#wordpress-post-content').fadeIn();
                }, 1000);
            },
            function (error) {
                //Error retrieve data.
            });
			
/////comments////////							
				var MediaURL = $scope.wordpressUrl + "/wp-json/wp/v2/comments?post="+$scope.restaurant.id;
		$http.get(MediaURL, {
            params: {}
        }).then(function (result) {
				//success retrieve data by calling http service. it will store comment data to $scope.comments.
                $scope.comments = result.data;
				
                $timeout(function () {
                    jQuery('#wordpress-post-loading-progress').hide();
                    jQuery('#wordpress-post-content').fadeIn();
                }, 1000);
            },
            function (error) {
                //Error retrieve data.
            });
            },
            function (error) {
                //Error retrieve data.
            });
			
			// openGoogleMap is for open Google Map application.
    // Parameter :  
    // targetDestinationLocation = latitude,longitude of the destination location.
    $scope.openGoogleMap = function (targetDestinationLocation) {

        // window.open is to link to URL.
        // The format is comgooglemaps://?q=targetDestinationLocation(latitude,longitude)&zoom=15(Specifies the zoom level of the map).
        //  '_system' is for open map application
        window.open('comgooglemaps://?q=' + targetDestinationLocation + '&zoom=15', '_system');
        // If you would like to custom map you can use this paramitor below:
        // center: This is the map viewport center point. Formatted as a comma separated string of latitude,longitude.
        // mapmode: Sets the kind of map shown. Can be set to: standard or streetview. If not specified, the current application settings will be used.
        // views: Turns specific views on/off. Can be set to: satellite, traffic, or transit. Multiple values can be set using a comma-separator. If the parameter is specified with no value, then it will clear all views.
        // zoom: Specifies the zoom level of the map.
    };// End openGoogleMap
			
});// End of WordPress Post Page Controller.
