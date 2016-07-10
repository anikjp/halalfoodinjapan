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

});

appServices.service('namaz_schedule_service', function ($rootScope ,$http, $q, WORDPRESS_API_URL, AuthService){
  // Using Namaz Schedule API

 this.getNamazSchedule = function(){
      var deferred = $q.defer();
$http.get("http://muslimsalat.com/jp/daily.json?key=a32b8dad6f6922edc9279c6081572dd2")
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });

return deferred.promise;
  };


});

appServices.service('positionService',['$http',function($http){


    // Retrieve position by IP
    this.getPosition = function () {
      return $http({
        method: 'GET',
        url: 'http://ip-api.com/json'
      }).then( function(response) {
          if((response.data.countryCode!="JP")||(response=="null"))
          {
        var result = {};
		result.position = {
          lat : 36.00,
          lon : 138.00,
          city : "Tokyo",
          countryCode : "JP",
          all : response.data
        };
          }else{
        var result = {};
		result.position = {
          lat : response.data.lat,
          lon : response.data.lon,
          city : response.data.city,
          countryCode : response.data.countryCode,
          all : response.data
        };
    }
        return result;
      }, function(response) {
        var result;
        result.error = "positionService Error";
        return result;
      });

    };
  }]);

appServices.service('weatherService',['$http',function($http){

  // Retrieve Weather from OWM
  //14738607f889caca6f5c620a4699233d
  this.getWeather = function(latitude,longitude, countryCode, units) {
	var api="06d45a853a7b0beeeb3d1fbde62487aa";
    return $http({
      method: 'GET',
      url: 'http://api.openweathermap.org/data/2.5/weather',
      params: {
        lat: latitude,
        lon: longitude,
        units:units,
		    APPID:api
      }
    }).then(function($data) {
      // Calculate if night or day
      var time ;
      if( Date.now() >= $data.data.sys.sunrise*1000 && Date.now() <= $data.data.sys.sunset*1000)
        time = 'day';
      else
        time = 'night';
        img = "http://openweathermap.org/img/w/"+$data.data.weather[0].icon+".png";
      return {
        weather: {
        temperature : $data.data.main.temp,
        pressure: $data.data.main.pressure,
        humidity: $data.data.main.humidity,
        image:img,
        windDir: $data.data.wind.deg,
        windSpeed: $data.data.wind.speed,
        description: $data.data.weather[0].description,
        },

        status: {
          time: time,
          id: $data.data.weather[0].id
        },
        fulldata:{
            data:$data.data
        }
      };
    }, function($data) {
      return {
        error: "weatherService Error"
      };
    });
  }
}])
;
