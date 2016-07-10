angular.module('starter.filters', [])

.filter('rawHtml', ['$sce', function($sce){
  return function(val) {
    return $sce.trustAsHtml(val);
  };
}])

.filter('dateFormat1', function($filter){
 return function(input)
 {
  if(input == null){ return ""; } 
 
  var _date = $filter('date')(new Date(input), 'MMM dd');
 
  return _date.toUpperCase();

 };
})
.filter('KelvinToCelsius', function() {
  return function(input) {
    input = input | "";
    var output = parseFloat(input);
    return (output - 273.15).toPrecision(3);
  }
})

.filter('KelvinToFahrenheit', function() {
  return function(input) {
    input = input | "";
    var output = parseFloat(input);
    return (output * 9 / 5 - 459.67).toPrecision(4);
  }
})
.filter('customRound', function(){
    return function(input, mode) {
      if( !isNaN(mode) && mode > 0) {
        return '' + Math.round(input*mode) / mode;
      } else {
        return '' + Math.round(input);
    }
  }
});// End Filter numberSuffix.;
