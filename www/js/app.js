//
//Welcome to app.js
//This is main application config of project. You can change a setting of :
//  - Global Variable
//  - Theme setting
//  - Icon setting
//  - Register View
//  - Spinner setting
//  - Custom style
//
//Global variable use for setting color, start page, message, oAuth key.
var db = null; //Use for SQLite database.
window.globalVariable = {
    //custom color style variable
    color: {
        appPrimaryColor: "",
        dropboxColor: "#017EE6",
        facebookColor: "#3C5C99",
        foursquareColor: "#F94777",
        googlePlusColor: "#D73D32",
        instagramColor: "#517FA4",
        wordpressColor: "#0087BE",
        NearbyColor : "#9C27B0",
        DashboardColor :"#444555"
    },// End custom color style variable
    startPage: {
        url: "/app/authentication",//Url of start page.
        state: "app.authentication"//State name of start page.
    },
    message: {
        errorMessage: "Technical error please try again later." //Default error message.
    },
    oAuth: {
        dropbox: "your_api_key",//Use for Dropbox API clientID.
        facebook: "288883527902019",//Use for Facebook API appID.
        foursquare: "your_api_key", //Use for Foursquare API clientID.
        instagram: "your_api_key",//Use for Instagram API clientID.
        googlePlus: "your_api_key",//Use for Google API clientID.
        adMob: "your_api_key" //Use for AdMob API clientID.
    }
};// End Global variable


angular.module('starter', ['ionic','ngMap','ngIOS9UIWebViewPatch', 'starter.controllers', 'starter.services','starter.filters','starter.config', 'starter.factory','ngMaterial', 'ngMessages', 'ngCordova','ion-gallery','oauth1Client'])
    .run(function ($ionicPlatform, $cordovaMedia,$cordovaGeolocation,$cordovaSQLite, $rootScope, $ionicHistory, $state, $mdDialog, $mdBottomSheet) {


        //Create database table of contracts by using sqlite database.
        //Table schema :
        //Column	   Type	     Primary key
        //  id	        Integer	    Yes
        //  firstName	Text	    No
        //  lastName	Text	    No
        //  telephone	Text	    No
        //  email	    Text	    No
        //  note	    Text	    No
        //  createDate	DateTime	No
        //  age	        Integer	    No
        //  isEnable	Boolean	    No

        function initialSQLite() {
            db = window.cordova ? $cordovaSQLite.openDB("contract.db") : window.openDatabase("contract.db", "1.0", "IonicMaterialDesignDB", -1);
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS contracts " +
                "( id           integer primary key   , " +
                "  firstName    text                  , " +
                "  lastName     text                  , " +
                "  telephone    text                  , " +
                "  email        text                  , " +
                "  note         text                  , " +
                "  createDate   dateTime              , " +
                "  age          integer               , " +
                "  isEnable     Boolean)                ");
        };
        // End creating SQLite database table.

        // Create custom defaultStyle.
        function getDefaultStyle() {
            return "" +
                ".material-background-nav-bar { " +
                "   background-color        : " + appPrimaryColor + " !important; " +
                "   border-style            : none;" +
                "}" +
                ".md-primary-color {" +
                "   color                     : " + appPrimaryColor + " !important;" +
                "}";
        }// End create custom defaultStyle

        // Create custom style for product view.
        function getProductStyle() {
            return "" +
                ".material-background-nav-bar { " +
                "   background-color        : " + appPrimaryColor + " !important;" +
                "   border-style            : none;" +
                "   background-image        : url('img/background_cover_pixels.png') !important;" +
                "   background-size         : initial !important;" +
                "}" +
                ".md-primary-color {" +
                "   color                     : " + appPrimaryColor + " !important;" +
                "}";
        }// End create custom style for product view.

        // Create custom style for contract us view.
        function getContractUsStyle() {
            return "" +
                ".material-background-nav-bar { " +
                "   background-color        : transparent !important;" +
                "   border-style            : none;" +
                "   background-image        : none !important;" +
                "   background-position-y   : 4px !important;" +
                "   background-size         : initial !important;" +
                "}" +
                ".md-primary-color {" +
                "   color                     : " + appPrimaryColor + " !important;" +
                "}";
        } // End create custom style for contract us view.

        // Create custom style for Social Network view.
        function getSocialNetworkStyle(socialColor) {
            return "" +
                ".material-background-nav-bar {" +
                "   background              : " + socialColor + " !important;" +
                "   border-style            : none;" +
                "} "+
                "md-toolbar {" +
                "   color                   : " + socialColor + " !important;" +
                "   background              : " + socialColor + " !important;" +
                "}" +
                "md-ink-bar {" +
                "   color                   : " + socialColor + " !important;" +
                "   background              : " + socialColor + " !important;" +
                "}" +
                "md-tab-item {" +
                "   color                   : " + socialColor + " !important;" +
                "}" +
                " md-progress-circular.md-warn .md-inner .md-left .md-half-circle {" +
                "   border-left-color       : " + socialColor + " !important;" +
                "}" +
                " md-progress-circular.md-warn .md-inner .md-left .md-half-circle, md-progress-circular.md-warn .md-inner .md-right .md-half-circle {" +
                "    border-top-color       : " + socialColor + " !important;" +
                "}" +
                " md-progress-circular.md-warn .md-inner .md-gap {" +
                "   border-top-color        : " + socialColor + " !important;" +
                "   border-bottom-color     : " + socialColor + " !important;" +
                "}" +
                "md-progress-circular.md-warn .md-inner .md-right .md-half-circle {" +
                "  border-right-color       : " + socialColor + " !important;" +
                " }" +
                ".spinner-android {" +
                "   stroke                  : " + socialColor + " !important;" +
                "}" +
                ".md-primary-color {" +
                "   color                   : " + socialColor + " !important;" +
                "}" +
                "a.md-button.md-primary, .md-button.md-primary {" +
                "   color                   : " + socialColor + " !important;" +
                "}";
        }// End create custom style for Social Network view.


        function initialRootScope() {
            $rootScope.appPrimaryColor = appPrimaryColor;// Add value of appPrimaryColor to rootScope for use it to base color.
            $rootScope.isAndroid = ionic.Platform.isAndroid();// Check platform of running device is android or not.
            $rootScope.isIOS = ionic.Platform.isIOS();// Check platform of running device is ios or not.
        };

        function hideActionControl() {
            //For android if user tap hardware back button, Action and Dialog should be hide.
            $mdBottomSheet.cancel();
            $mdDialog.cancel();
        };


        // createCustomStyle will change a style of view while view changing.
        // Parameter :
        // stateName = name of state that going to change for add style of that page.
        function createCustomStyle(stateName) {
            var customStyle =
                ".material-background {" +
                "   background-color          : " + appPrimaryColor + " !important;" +
                "   border-style              : none;" +
                "}" +
                ".spinner-android {" +
                "   stroke                    : " + appPrimaryColor + " !important;" +
                "}";

            switch (stateName) {
                case "app.productList" :
                case "app.productDetail":
                case "app.productCheckout":
                case "app.catalog" :
                    customStyle += getProductStyle();
                    break;
                case "app.expense" :
                case "app.expenseSetting":
                case "app.dropboxFeed" :
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.dropboxColor);
                    break;
                case "app.restaurant" :
                case "app.clothShop":
                case "app.facebookFeed" :
                case "app.facebookFriendList":
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.facebookColor);
                    break;
                case "app.nearby" :
                case "app.foursquareProfile":
                case "app.foursquareFeed" :
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.NearbyColor);
                    break;
                case "app.dashboard" :
                case "app.googlePlusProfile":
                case "app.googlePlusFeed" :
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.DashboardColor);
                    break;
                case "app.instagramLogin" :
                case "app.instagramProfile":
                case "app.instagramFeed" :
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.instagramColor);
                    break;
                case "app.wordpressLogin" :
                case "app.wordpressFeed":
                case "app.wordpressPost" :
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.wordpressColor);
                    break;
                case "app.contractUs":
                    customStyle += getContractUsStyle();
                    break;
                default:
                    customStyle += getDefaultStyle();
                    break;
            }
            return customStyle;
        }// End createCustomStyle

        // Add custom style while initial application.
        $rootScope.customStyle = createCustomStyle(window.globalVariable.startPage.state);

        $ionicPlatform.ready(function () {
            ionic.Platform.isFullScreen = true;
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            initialSQLite();
            initialRootScope();

            //Checking if view is changing it will go to this function.
            $rootScope.$on('$ionicView.beforeEnter', function () {
                //hide Action Control for android back button.
                hideActionControl();
                // Add custom style ti view.
                $rootScope.customStyle = createCustomStyle($ionicHistory.currentStateName());
            });
        });

    })

    .config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider, $mdColorPalette, $mdIconProvider,ionGalleryConfigProvider,oauth1ClientProvider) {
        // Use for change ionic spinner to android pattern.



        oauth1ClientProvider.config({
            consumerKey: 'pk4AkZD8U3w5jCnRCeZ61K5RsBTWIR',
            consumerSecret: 'f8bkIvjlEdpajJNGAqVAwXkCOMeIJW',
            requestEndpoint: 'http://abnjp.com/resturent/oauth1/request',
            authorizeEndpoint: 'http://abnjp.com/resturent/oauth1/authorize',
            accessEndpoint: 'http://abnjp.com/resturent/oauth1/access',
            oauthCallback: 'http://www.google.com'
        });

        ionGalleryConfigProvider.setGalleryConfig({
                          action_label: 'Close',
                          template_gallery: 'gallery.html',
                          template_slider: 'slider.html',
                          toggle: false,
                          row_size: 3,
                          fixed_row_size: true
                        });


        $ionicConfigProvider.spinner.icon("android");
        $ionicConfigProvider.views.swipeBackEnabled(false);

        // mdIconProvider is function of Angular Material.
        // It use for reference .SVG file and improve performance loading.
        $mdIconProvider
            .icon('facebook', 'img/icons/facebook.svg')
            .icon('twitter', 'img/icons/twitter.svg')
            .icon('mail', 'img/icons/mail.svg')
            .icon('message', 'img/icons/message.svg')
            .icon('share-arrow', 'img/icons/share-arrow.svg')
            .icon('more', 'img/icons/more_vert.svg');

        //mdThemingProvider use for change theme color of Ionic Material Design Application.
        /* You can select color from Material Color List configuration :
         * red
         * pink
         * purple
         * purple
         * deep-purple
         * indigo
         * blue
         * light-blue
         * cyan
         * teal
         * green
         * light-green
         * lime
         * yellow
         * amber
         * orange
         * deep-orange
         * brown
         * grey
         * blue-grey
         */
        //Learn more about material color patten: https://www.materialpalette.com/
        //Learn more about material theme: https://material.angularjs.org/latest/#/Theming/01_introduction
        $mdThemingProvider
		.theme('default')
		.primaryPalette('blue-grey')
		.accentPalette('red');

        appPrimaryColor = $mdColorPalette[$mdThemingProvider._THEMES.default.colors.primary.name]["500"]; //Use for get base color of theme.

        //$stateProvider is using for add or edit HTML view to navigation bar.
        //
        //Schema :
        //state_name(String)      : Name of state to use in application.
        //page_name(String)       : Name of page to present at localhost url.
        //cache(Bool)             : Cache of view and controller default is true. Change to false if you want page reload when application navigate back to this view.
        //html_file_path(String)  : Path of html file.
        //controller_name(String) : Name of Controller.
        //
        //Learn more about ionNavView at http://ionicframework.com/docs/api/directive/ionNavView/
        //Learn more about  AngularUI Router's at https://github.com/angular-ui/ui-router/wiki
        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu/html/menu.html",
                controller: 'menuCtrl'
            })
            .state('app.dashboard', {
                url: "/dashboard",
                params:{
                    isAnimated:false
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/material-user-interface/dashboard/html/dashboard.html",
                        controller: 'dashboardCtrl'
                    }
                }
            })
            .state('app.dashboardSetting', {
                url: "/dashboardSetting",
                views: {
                    'menuContent': {
                        templateUrl: "templates/material-user-interface/dashboard/html/dashboard-setting.html",
                        controller: "dashboardSettingCtrl"
                    }
                }
            })
            .state('app.nearby', {
                url: "/nearby",
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/nearby/html/nearby.html",
                        controller: "nearbyCtrl"
                    }
                }
            })
            .state('app.namazschedule', {
                url: "/namazschedule",
                views: {
                    'menuContent': {
                        templateUrl: "templates/hardware-connect/device-information/html/device-information.html",
                        controller: 'namazscheduleCtrl'
                    }

                }
            })
            .state('app.flashLight', {
                url: "/flashLight",
                views: {
                    'menuContent': {
                        templateUrl: "templates/hardware-connect/flash-light/html/flash-light.html",
                        controller: 'flashLightCtrl'
                    }

                }
            })
            .state('app.imagePicker', {
                url: "/imagePicker",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/hardware-connect/image-picker/html/image-picker.html",
                        controller: 'imagePickerCtrl'
                    }

                }
            })

            .state('app.authentication', {
                url: "/authentication",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/try-app/html/try-app.html",
                        controller: 'Userctrl'
                    }
                }
            })
            .state('app.fakeLogin', {
                url: "/authentication",
                params:{
                    isAnimated:true
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/authentication/html/login.html",
                        controller: 'loginCtrl'
                    }
                }
            })
            .state('app.fakeSignUp', {
                url: "/authentication",
                params:{
                    isAnimated:true
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/authentication/html/sign-up.html",
                        controller: 'signupCtrl'
                    }
                }
            })
            .state('app.expense', {
                url: "/expense",
                params:{
                    isAnimated:true
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/expense-dashboard/html/expense-dashboard.html",
                        controller: "expenseDashboardCtrl"
                    }
                }
            })
            .state('app.expenseSetting', {
                url: "/expense",
                params:{
                    isAnimated:true
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/expense-dashboard/html/expense-dashboard-setting.html",
                        controller: "expenseDashboardSettingCtrl"
                    }
                }
            })
            .state('app.cubeFeed', {
                url: "/cubeFeed",
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/cube-feed/html/cube-feed.html",
                        controller: "PostlistCtrl"
                    }
                }
            })
            .state('app.timelinedetail', {
                url: "/timelinedetail",
                params: {
                    post: null
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/cube-feed/html/postdetail.html",
                        controller: "timelinedetailCtrl"
                    }
                }
            })
            .state('app.commentdetail', {
                url: "/commentdetail",
                params: {
                    noteDetail: null,
                    actionDelete: false
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/cube-feed/html/comment-detail.html",
                        controller: 'commentdetailCtrl'
                    }
                }
            })
            .state('app.restaurant', {
                url: "/restaurant",
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/restaurant/html/restaurant-dashboard.html",
						controller: "restaurantCtrl"
                    }
                }
            })
            .state('app.mosquelist', {
                url: "/mosque",
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/mosque/html/mosque-list.html",
						controller: "mosquelistCtrl"
                    }
                }
            })
             .state('app.mosquedetail', {
                url: "/mosque",
                params: {
                    postDetail: null,
                    wordpressUrl: null
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/mosque/html/mosque-detail.html",
						controller: "mosquedetailCtrl"
                    }
                }
            })
            .state('app.groceryshoplist', {
                url: "/groceryshop",
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/grocery-shop/html/grocery-shop-list.html",
						controller: "groceryshoplistCtrl"
                    }
                }
            })
            .state('app.groceryshopdetial', {
                url: "/groceryshop",
                params: {
                    postDetail: null,
                    wordpressUrl: null
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/grocery-shop/html/grocery-shop-detail.html",
						controller: "groceryshopdetailCtrl"
                    }
                }
            })
            .state('app.clothShop', {
                url: "/clothShop",
                params: {
                    postDetail: null,
                    wordpressUrl: null
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/restaurant/html/restaurant-list.html",
						controller: 'clothCtrl'
                    }
                }
            })
        .state('app.restaurantdetail', {
                url: "/details",
				            cache: false,
                params: {
                    postDetail: null,
                    wordpressUrl: null
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/themes/restaurant/html/restaurant-detail.html",
						controller: 'restaurantdetailCtrl'
                    }
                }
            })
           // End $stateProvider

        //Use $urlRouterProvider.otherwise(Url);
        $urlRouterProvider.otherwise(window.globalVariable.startPage.url);

    });
