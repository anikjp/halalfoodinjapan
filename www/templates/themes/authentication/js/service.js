// WP POSTS RELATED FUNCTIONS
appServices.service('AuthService',  function ($rootScope, $http, $q, WORDPRESS_API_URL2,WORDPRESS_API_URL){

  this.validateAuth = function(user) {
    var deferred = $q.defer();
    $http.jsonp(WORDPRESS_API_URL2 + 'user/validate_auth_cookie/' +
    '?cookie='+ user.cookie +
    '&insecure=cool&callback=JSON_CALLBACK')
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  this.doLogin = function(user) {
    var deferred = $q.defer(),
        nonce_dfd = $q.defer(),
        authService = this;

    authService.requestNonce("user", "generate_auth_cookie")
    .then(function(nonce){

      nonce_dfd.resolve(nonce);
    });

    nonce_dfd.promise.then(function(nonce){
      //now that we have the nonce, ask for the new cookie

      authService.generateAuthCookie(user.userName, user.password, nonce)
      .then(function(data){
        if(data.status == "error"){
          // return error message
          deferred.reject(data.error);
        }else{
          //recieve and store the user's cookie in the local storage
          /*authService.initialpost(data)
          .then(function(result){
            console.log(result);
          });
          */

          authService.getfullUserinfo(data.user.id)
          .then(function(result){
            console.log(result);
            data.user.optionaldata=result.acf;
            var user = {
              cookie: data.cookie,
              data: data.user,
              user_id: data.user.id
            };
            console.log(user);
            authService.saveUser(user);

            //getavatar in full size
            authService.updateUserAvatar().then(function(){
              deferred.resolve(user);
            });
          });
        }
      });
    });
    return deferred.promise;
  };

  this.doRegister = function(user) {
    var deferred = $q.defer(),
        nonce_dfd = $q.defer(),
        authService = this;

    this.requestNonce("user", "register")
    .then(function(nonce){
      nonce_dfd.resolve(nonce);
    });

    nonce_dfd.promise.then(function(nonce){
      authService.registerUser(user.userName, user.email,
        user.displayName, user.password, nonce)
      .then(function(data){
        if(data.status == "error"){
          // return error message
          deferred.reject(data.error);
        }else{
          // in order to get all user data we need to call this function
          // because the register does not provide user data
          authService.doLogin(user).then(function(){
              deferred.resolve(user);
          });
        }
      });
    });

    return deferred.promise;
  };

  this.requestNonce = function(controller, method) {
    var deferred = $q.defer();
    var url=WORDPRESS_API_URL2 + 'get_nonce/' +'?controller=' + controller +'&method=' + method +'&insecure=cool&callback=JSON_CALLBACK';
    $http.jsonp(url)
    .success(function(data) {
      deferred.resolve(data.nonce);
        console.log(data.nonce);
    })
    .error(function(data) {
      console.log(url);
      deferred.reject(data.nonce);
    });

    return deferred.promise;
  };

  this.doForgotPassword = function(username) {
    var deferred = $q.defer();
    $http.jsonp(WORDPRESS_API_URL2 + 'user/retrieve_password/' +
    '?user_login='+ username +
    '&insecure=cool&callback=JSON_CALLBACK')
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  this.generateAuthCookie = function(username, password, nonce) {
    var deferred = $q.defer();
    $http.jsonp(WORDPRESS_API_URL2 + 'user/generate_auth_cookie/' +
    '?username='+ username +
    '&password=' + password +
    '&nonce='+ nonce +
    '&insecure=cool&callback=JSON_CALLBACK')
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  this.saveUser = function(user){
    window.localStorage.ionWordpress_user = JSON.stringify(user);
  };

  this.getUser = function(){

    var data = (window.localStorage.ionWordpress_user) ? JSON.parse(window.localStorage.ionWordpress_user).data : null,
        cookie = (window.localStorage.ionWordpress_user) ? JSON.parse(window.localStorage.ionWordpress_user).cookie : null;

  return {
      avatar : JSON.parse(window.localStorage.ionWordpress_user_avatar || null),
      data: data,
      cookie: cookie
    };
  };

  this.registerUser = function(username, email, displayName, password, nonce) {
    var deferred = $q.defer();
      console.log(WORDPRESS_API_URL2 + 'user/register/' +
    '?username='+ username +
    '&email=' + email +
    '&display_name='+ displayName +
    '&user_pass=' + password +
    '&nonce='+ nonce +
    '&callback=JSON_CALLBACK&insecure=cool');

    $http.jsonp(WORDPRESS_API_URL2 + 'user/register/' +
    '?username='+ username +
    '&email=' + email +
    '&display_name='+ displayName +
    '&user_pass=' + password +
    '&nonce='+ nonce +
    '&callback=JSON_CALLBACK&insecure=cool')
    .success(function(data) {
        console.log(data);
      deferred.resolve(data);
    })
    .error(function(data) {
        console.log(data);
      deferred.reject(data);
    });
    return deferred.promise;
  };

  this.userIsLoggedIn = function(){


    var deferred = $q.defer();

    var user = JSON.parse(window.localStorage.ionWordpress_user || null);
    if(user !== null && user.cookie !== null)
    {
      this.validateAuth(user).then(function(data){
        deferred.resolve(data.valid);
      });
    }
    else
    {
      deferred.resolve(false);
    }
    return deferred.promise;
  };

  this.logOut = function(){
    //empty user data

    window.localStorage.ionWordpress_user = null;
    window.localStorage.ionWordpress_user_avatar = null;
    // window.localStorage.ionWordpress_bookmarks = null;
  };


  //update user avatar from WP
  this.initialpost = function(user_id) {

  authService = this;
  authService.requestNonce("posts", "create_post")
  .then(function(nonce){
console.log(nonce);
$http.get(WORDPRESS_API_URL2 + 'posts/create_post/' +
'?nonce='+ nonce +
'&title=' + 'test' +
'&content='+ 'test content' +
'&callback=JSON_CALLBACK&insecure=cool')
.success(function(data) {
    console.log(data);

})
.error(function(data) {
    console.log(data);
});

  });
    console.log(user_id);
  //  return user_dfd.promise;
  };

//update user avatar from WP
this.getfullUserinfo = function(user_id) {
  var user_dfd = $q.defer(),
      authService = this

  $http.get(WORDPRESS_API_URL + 'wp/v2/users/' + user_id)
  .success(function(data) {

    //var avatar_aux = data.avatar.replace("http:", "");
    //var avatar = 'http:' + avatar_aux;
    console.log(data);
    user_dfd.resolve(data);
  })
  .error(function(err) {
    user_dfd.reject(err);
  });

  return user_dfd.promise;
};

  //update user avatar from WP
  this.updateUserAvatar = function() {
    var avatar_dfd = $q.defer(),
        authService = this,
        user = JSON.parse(window.localStorage.ionWordpress_user || null);

    $http.get(WORDPRESS_API_URL + 'wp/v2/users/' + user.user_id)
    .success(function(data) {

      //var avatar_aux = data.avatar.replace("http:", "");
      //var avatar = 'http:' + avatar_aux;
      console.log(data);
      window.localStorage.ionWordpress_user_avatar =  JSON.stringify(data.acf.images.sizes);
      avatar_dfd.resolve(data.acf.images.sizes);
    })
    .error(function(err) {
      avatar_dfd.reject(err);
    });

    return avatar_dfd.promise;
  };

});
