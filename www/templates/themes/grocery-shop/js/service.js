// WP POSTS RELATED FUNCTIONS
appServices.service('groceryshop_service', function ($rootScope, $http, $q, WORDPRESS_API_URL, AuthService){
    
  this.get_grocery_shop_list = function() {
      var deferred = $q.defer();
    $http.get(WORDPRESS_API_URL + 'wp/v2/ait-item?filter[ait-items]=grocery-shop')
    .success(function(data) {
        
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });

    return deferred.promise;
  };
    
    
   
});