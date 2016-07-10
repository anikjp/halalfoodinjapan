// Controller of WordPress feed Page.
// To connect with WordPress feed you have to install WP REST API to your WordPress site.
// by this link: https://wordpress.org/plugins/json-rest-api/
// Add WP REST API plugin to your WordPress site.
// Set website format to support with WP REST API.
// You can find more information at project documentation.

appControllers.controller('PostlistCtrl', function ($scope, $http, $state, $stateParams, $ionicHistory,WORDPRESS_API_URL,Postlist_service,$ionicLoading) {

$scope.posts = [];
  $scope.page = 1;
  $scope.totalPages = 1;


//Always bring me the latest posts => page=1
      // Setup the loader
  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner icon="lines" class="spinner-calm"></ion-spinner>',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
    Postlist_service.getRecentPosts($scope.page)
    .then(function(data){

      $scope.totalPages = data.pages;
      $scope.posts = Postlist_service.shortenPosts(data.posts);

      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    });


  $scope.doRefresh = function() {

    // Setup the loader
  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner icon="lines" class="spinner-calm"></ion-spinner>',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

    //Always bring me the latest posts => page=1
    Postlist_service.getRecentPosts(1)
    .then(function(data){

      $scope.totalPages = data.pages;
      $scope.posts = Postlist_service.shortenPosts(data.posts);
     console.info($scope.posts);
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.loadMoreData = function(){
    $scope.page += 1;

    Postlist_service.getRecentPosts($scope.page)
    .then(function(data){
      //We will update this value in every request because new posts can be created
      $scope.totalPages = data.pages;

      var new_posts = Postlist_service.shortenPosts(data.posts);
      var new_posts = Postlist_service.PostsAuthor(data.posts);
      $scope.posts = $scope.posts.concat(new_posts);

      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.moreDataCanBeLoaded = function(){
    return $scope.totalPages > $scope.page;
  };

  $scope.doRefresh();


 // navigateTo is for navigate to other page
    // by using targetPage to be the destination page.
    // Sending objectData and wordpress url to the destination page.
    // Parameter :
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    // wordpressUrl = wordpress url
    $scope.navigateTo = function (targetPage, post) {
		$state.go(targetPage, {
           post: post,
        });
    };// End navigateTo.

});

appControllers.controller('timelinedetailCtrl', function ($scope, $http, $stateParams,$ionicLoading,$timeout, $ionicModal,$ionicPopup,$mdToast,Postlist_service,WORDPRESS_API_URL) {
    $scope.post = $stateParams.post;
    console.log("-------");
    console.log($scope.post);


    $scope.initialForm = function () {

        // $scope.post  is post that pass from state parameter from WordPress Feed.
        $scope.post = $stateParams.post;

        // $scope.wordpressUrl  is url that pass from state parameter from WordPress Feed.

        // $scope.comments  is the variable that store comments of post.
        $scope.commentlist = [];

        //To get comment.
        $scope.getcomment();

        // The function for show/hide loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#wordpress-post-loading-progress').show();
            }
            else {
                jQuery('#wordpress-post-loading-progress').fadeIn(700);
            }
        }, 400);// End loading progress.
    }// End initialForm.

     // get comment is for get comment by calling to wordpress API.
    $scope.getcomment = function () {
        console.log("grabe comment---",WORDPRESS_API_URL + "wp/v2/comments?post=" + $scope.post.id)
        // API format is YOUR_WORDPRESS_URL/wp-json/posts/POST_ID/comments
        $http.get(WORDPRESS_API_URL + "wp/v2/comments?post=" + $scope.post.id, {
            params: {}
        }).then(function (result) {
            //success retrieve data by calling http service. it will store comment data to $scope.comments.
                $scope.commentlist = result.data;
                console.info($scope.commentlist);
                $timeout(function () {
                    jQuery('#wordpress-post-loading-progress').hide();
                    jQuery('#wordpress-post-content').fadeIn();
                }, 1000);
            },
            function (error) {
                //Error retrieve data.
            });
    };// End get comment.
    $scope.initialForm();

    // Triggered on a button click, or some other target
 // An elaborate, custom popup
   $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });


    // Triggered on a button click, or some other target
$scope.showPopup = function() {
  $scope.comment = {};

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<textarea style="width:100%" rows="7" maxlength="250" placeholder="Write something here ...." ng-model="comment.content"></textarea>',
    title: 'Add your comments!!!',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
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
      }
    ]
  });

  myPopup.then(function(res) {

    console.log('Tapped!', res);
   Postlist_service.submitComment($scope.post.id, $scope.comment.content)
    .then(function(data){
      if(data.status=="ok"){
        var user = Postlist_service.getUser();
        console.log("after data",data);
        console.log("after user",user);

        var comment = {
          author_name: user.data.username,
          content:{rendered: $scope.comment.content} ,
          date: Date.now(),
          author_avatar_urls : {
             "24" : user.avatar['24']
          } ,
          id: data.comment_id
        };
        $scope.commentlist.push(comment);
        $scope.new_comment = "";
        $scope.new_comment_id = data.comment_id;
        console.log("after comments",$scope.commentlist);

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
      }else{
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
});


 };


});// End of WordPress Feed Page  Controller.

// Controller of Note Detail Page.
appControllers.controller('commentdetailCtrl', function ($scope, NoteDB, $stateParams, $filter, $mdBottomSheet, $mdDialog, $mdToast, $ionicHistory) {

    // initialForm is the first activity in the controller.
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.actionDelete is the variable for allow or not allow to delete data.
        // It will allow to delete data when found data in the database.
        // $stateParams.actionDelete(bool) = status that pass from note list page.
        $scope.actionDelete = $stateParams.actionDelete;

        // $scope.note is the variable that store note detail data that receive form note list page.
        // Parameter :
        // $scope.actionDelete = status that pass from note list page.
        // $stateParams.contractdetail(object) = note data that user select from note list page.
        $scope.note = $scope.getNoteData($scope.actionDelete, $stateParams.noteDetail);

        // $scope.noteList is the variable that store data from NoteDB service.
        $scope.noteList = [];
    };// End initialForm.

    //getNoteData is for get note detail data.
    $scope.getNoteData = function (actionDelete, noteDetail) {
        // tempNoteData is temporary note data detail.
        var tempNoteData = {
            id: null,
            title: '',
            detail: '',
            createDate: $filter('date')(new Date(), 'MMM dd yyyy'),
        };

        // If actionDelete is true note Detail Page will show note detail that receive form note list page.
        // else it will show tempNoteData for user to add new data.
        return (actionDelete ? angular.copy(noteDetail) : tempNoteData);
    };// End getNoteData.

    // showListBottomSheet is for showing the bottom sheet.
    // Parameter :
    // $event(object) = position of control that user tap.
    // noteForm(object) = note object that presenting on the view.
    $scope.showListBottomSheet = function ($event, noteForm) {

        $scope.disableSaveBtn = $scope.validateRequiredField(noteForm);

        $mdBottomSheet.show({
            templateUrl: 'contract-actions-template',
            targetEvent: $event,
            scope: $scope.$new(false),
        });
    };// End showing the bottom sheet.

    // validateRequiredField is for validate the required field.
    // Parameter :
    // form(object) = note object that presenting on the view.
    $scope.validateRequiredField = function (form) {
        return !(form.noteTitle.$error.required == undefined);
    };// End validate the required field.

    // saveNote is for save note.
    // Parameter :
    // note(object) = note object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.saveNote = function (note, $event) {
        // $mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();

        // mdDialog.show use for show alert box for Confirm to save data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to save data?",
                    content: "Data will save to Local Storage.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {

            // For confirm button to save data.
            try {
                // To update data by calling  NoteDB.update($scope.note) service.
                if ($scope.actionDelete) {

                    if ($scope.note.id == null) {
                        $scope.note.id = $scope.noteList[$scope.noteList.length - 1].id;
                    }
                    NoteDB.update($scope.note);
                } // End update data.

                // To add new data by calling NoteDB.insert(note) service.
                else {
                    NoteDB.insert(note);
                    $scope.noteList = NoteDB.selectAll();
                    $scope.actionDelete = true;
                }// End  add new  data.

                // Showing toast for save data is success.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 400,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "Data Saved !"
                        }
                    }
                });//End showing toast.
            }
            catch (e) {
                // Showing toast for unable to save data.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: window.globalVariable.message.errorMessage
                        }
                    }
                });// End showing toast.
            }

        }, function () {
            // For cancel button to save data.
        });// End alert box.
    };// End save note.

    // deleteNote is for remove note.
    // Parameter :
    // note(object) = note object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.deleteNote = function (note, $event) {
        // $mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();

        // mdDialog.show use for show alert box for Confirm to delete data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to remove data?",
                    content: "Data will remove from Local Storage.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove data.
            try {
                // Remove note by calling  NoteDB.delete(note) service.
                if ($scope.note.id == null) {
                    $scope.note.id = $scope.noteList[$scope.noteList.length - 1].id;
                }
                NoteDB.delete(note);
                $ionicHistory.goBack();
            }// End remove note.
            catch (e) {
                // Showing toast for unable to remove data.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: window.globalVariable.message.errorMessage
                        }
                    }
                });//End showing toast.
            }

        }, function () {
            // For cancel button to remove data.
        });// End alert box.
    };// End remove note.

    $scope.initialForm();
});// End of Notes Detail Page  Controller.
