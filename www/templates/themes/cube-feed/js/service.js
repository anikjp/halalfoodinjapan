// WP POSTS RELATED FUNCTIONS
appServices.service('Postlist_service', function ($rootScope, $http, $q,WORDPRESS_API_URL2,WORDPRESS_API_URL){


  this.getRecentPosts = function(page) {
    var deferred = $q.defer();

    $http.jsonp(WORDPRESS_API_URL2 + 'get_recent_posts/' +
      '?page='+ page +
      '&callback=JSON_CALLBACK')
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });

    return deferred.promise;
  };

  this.getUserGravatar = function(userId){
    var deferred = $q.defer();

    $http.jsonp(WORDPRESS_API_URL2 + 'user/get_avatar/' +
    '?user_id='+ userId +
    '&type=small' +
    '&callback=JSON_CALLBACK')
    .success(function(data) {
      var avatar_aux = data.avatar.replace("http:", "");
      var avatar = 'http:' + avatar_aux;

      deferred.resolve(avatar);
    })
    .error(function(data) {
      deferred.reject(data);
    });

    return deferred.promise;
  };

  this.getPost = function(postId) {
    var deferred = $q.defer();

    $http.get(WORDPRESS_API_URL2 + 'get_post/' +
      '?post_id='+ postId +
      '&callback=JSON_CALLBACK')
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });

    return deferred.promise;
  };

    this.submitComment = function(postId, content) {
        authService = this;
    var deferred = $q.defer(),
    user = authService.getUser();
    console.info
    $http.jsonp(WORDPRESS_API_URL2 + 'user/post_comment/' +
    '?post_id='+ postId +
    '&cookie='+ user.cookie +
    '&comment_status=1' +
    '&content='+ content +
    '&callback=JSON_CALLBACK&insecure=cool')
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });

    return deferred.promise;
  };

  this.shortenPosts = function(posts) {
    //we will shorten the post
    //define the max length (characters) of your post content

    var self = this;
    var maxLength = 300;
    authService = this;
     return _.map(posts, function(post){
      if(post.excerpt.length > maxLength){
        //trim the string to the maximum length
        var trimmedString = post.excerpt.substr(0, maxLength);
        //re-trim if we are in the middle of a word
        trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf("</p>")));
        post.excerpt = trimmedString;

      }
        var author_id=post['author'].id;
        authService.get_userinfo(author_id)
      .then(function(user){
        if(user.acf.images){
        post['author'].images=user.acf.images.sizes.thumbnail;
      }else{
        post['author'].images=user.avatar_urls;
      }
      });
      console.log(post);
      return post;
    });

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

  this.get_userinfo = function(userid) {
    var deferred = $q.defer();

    $http.get(WORDPRESS_API_URL + 'wp/v2/users/'+ userid)
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });

    return deferred.promise;
  };


  this.RearrangePostcard = function(posts) {
    //we will shorten the post
    //define the max length (characters) of your post content

    var self = this;
    var maxLength = 300;
    authService = this;
     return _.map(posts, function(post){
        var author_id=post.author;
        authService.get_userinfo(author_id)
      .then(function(user){
        post.author=user;
      });
      return post;
    });

  };

});

appServices.factory('localStorage', function ($filter, $window) {
    return {
        // Get data from localStorage it will use data key for getting the data.
        // Parameter :
        // key = reference of object in localStorage.
        get: function (key) {
            return JSON.parse($window.localStorage[key] || "null");
        },

        // Add data to localStorage it will use data key
        // by input data key and value for setting data to localStorage.
        // Parameter :
        // key = reference of object in localStorage.
        // value = data that will store in localStorage.
        set: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },

        //Remove all data from localStorage.
        removeAll: function () {
            $window.localStorage.clear();
        }

    };
});//End LocalStorage service.
// NoteDB service will call localStorage Services to present notes data to controller.
appServices.factory('NoteDB', function (localStorage) {
    return {
        //  Get all data from localStorage.
        selectAll: function () {
            //noteData is the key of object that store in localStorage.
            return localStorage.get("noteData");
        },

        // Add new note data to localStorage.
        // It will receive note data from controller to store in localStorage.
        // Parameter :
        // note = data that will store in localStorage.
        insert: function (note) {
            var notesList = localStorage.get("noteData");
            if (notesList == null) {
                // For first value of data.
                var newNoteData = [{
                    id: 1,
                    title: note.title,
                    detail: note.detail,
                    createDate: note.createDate
                }];
                localStorage.set("noteData", newNoteData);
            }
            else {
                // For up to second value of data.
                var newNoteData = {
                    id: (notesList.length + 1),
                    title: note.title,
                    detail: note.detail,
                    createDate: note.createDate
                };
                notesList.push(newNoteData);
                localStorage.set("noteData", notesList);
            }
        },

        // Update note data to localStorage.
        // It will receive note data from controller to store in localStorage.
        // Parameter :
        // note = data that will update to localStorage.
        update: function (note) {
            var notesList = localStorage.get("noteData");

            for (var i = 0; i <= notesList.length; i++) {
                if (notesList[i].id == note.id) {
                    notesList[i] = note;
                    break;
                }
            }

            localStorage.set("noteData", notesList);
        },

        // Remove data from localStorage it will receive note data
        // from controller to remove data from localStorage.
        // Parameter :
        // note = data that will delete from localStorage.
        delete: function (note) {
            var notesList = localStorage.get("noteData");

            for (var i = 0; i <= notesList.length; i++) {
                if (notesList[i].id == note.id) {
                    notesList.splice(i, 1);
                    break;
                }
            }

            localStorage.set("noteData", notesList);
        },

        // Remove All data from localStorage.
        clear: function () {
            localStorage.removeAll();
        },

        // Get number of notes.
        count: function () {
            var notesList = localStorage.get("noteData");
            return (notesList == null ? 0 : notesList.length);
        }
    };
});//End NoteDB service.
