// WP POSTS RELATED FUNCTIONS
appServices.service('restaurants_service', function ($rootScope, $http, $q, WORDPRESS_API_URL, AuthService){
    
  this.get_restaurant_mainbanner = function() {
      var deferred = $q.defer();
    $http.get(WORDPRESS_API_URL + 'wp/v2/ait-ad-space?ait-spaces=82')
    .success(function(data) {
        
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });

    return deferred.promise;
  };
    
    
   this.get_restaurant_type = function() {
      var deferred = $q.defer();
       console.log(WORDPRESS_API_URL + 'wp/v2/ait-items?parent=257');
    $http.get(WORDPRESS_API_URL + 'wp/v2/ait-items?parent=257')
    .success(function(data) {
        
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });

    return deferred.promise;
  }; 
    
     this.get_location_type = function() {
      var deferred = $q.defer();
    $http.get(WORDPRESS_API_URL + 'wp/v2/ait-locations')
    .success(function(data) {
        
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });

    return deferred.promise;
  }; 
    
      this.get_item_type = function() {
      var deferred = $q.defer();
    $http.get(WORDPRESS_API_URL + 'wp/v2/ait-items_tags')
    .success(function(data) {
        
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });

    return deferred.promise;
  };     

});