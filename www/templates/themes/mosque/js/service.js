// WP POSTS RELATED FUNCTIONS
appServices.service('mosque_service', function ($rootScope, $http, $q, WORDPRESS_API_URL, AuthService){
    
  this.get_mosque_list = function() {
      var deferred = $q.defer();
    $http.get(WORDPRESS_API_URL + 'wp/v2/ait-item?filter[ait-items]=mosque')
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
    $http.get(WORDPRESS_API_URL + 'wp/v2/ait-items?parent=291')
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
    $http.get(WORDPRESS_API_URL + 'wp/v2/ait-locations?parent=266')
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