appServices.service('post_card_service',function($http,WORDPRESS_API_URL){

  // Retrieve Weather from OWM
  this.getPostCard = function(latitude,longitude, countryCode, units) {

    return $http({
      method: 'GET',
      url: WORDPRESS_API_URL+'wp/v2/media',
      params: {
        categories: 268
      }
    }).then(function($data) {
      return $data.data;
    }, function($data) {
      return {
        error: "weatherService Error"
      };
    });
  }
});

appServices.service('restaurant_ad_service',function($http,WORDPRESS_API_URL){

  // Retrieve Weather from OWM
  this.getRestaurant_Advertisement = function(latitude,longitude, countryCode, units) {
    console.log(WORDPRESS_API_URL+'wp/v2/media');

    return $http({
      method: 'GET',
      url: WORDPRESS_API_URL+'wp/v2/media',
      params: {
        categories: 269
      }
    }).then(function($data) {
      return $data.data;
    }, function($data) {
      return {
        error: "weatherService Error"
      };
    });
  }
});
