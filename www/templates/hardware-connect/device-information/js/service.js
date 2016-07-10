appServices.service('namaz_schedule_service', function ($rootScope ,$http, $q, WORDPRESS_API_URL, AuthService){
  // Using Namaz Schedule API

  this.getNamazSchedule = function(){
       var deferred = $q.defer();
       var now = new Date();
      var url="http://muslimsalat.com/";
      var state="";
          state=(state!="")?state:"jp";
          state=state+"/";
      var type="";
          type=(type!="")?type:"daily";
          type=type+".json";

      var time=(time!="")?time:"daily";
          time=time+".json";
      var method=(method!="")?method:"5";

          if(date!=""){
          var curr_date = now.getDate();
          var curr_month = now.getMonth();
           curr_month++;
           var curr_year = now.getFullYear();
           var date= curr_date + "-" + curr_month + "-" + curr_year;
          }

        url=url+state+type;

        console.log(url);
      $http.get(url, {
        params: {
            date:date,
            method:method,
            key: "a32b8dad6f6922edc9279c6081572dd2"
        }
      })
     .success(function(NamazSchedule) {
       if(NamazSchedule.status_valid){
         var fajr = NamazSchedule.items[0].fajr.split(':');
         fajr=parseInt(fajr[0] + fajr[1]);
         var dhuhr = NamazSchedule.items[0].dhuhr.split(':');
         dhuhr=parseInt(dhuhr[0] + dhuhr[1]);
         var asr = NamazSchedule.items[0].asr.split(':');
         asr=parseInt((parseInt(asr[0])+12).toString() + asr[1]);
         var maghrib = NamazSchedule.items[0].maghrib.split(':');
         maghrib=parseInt((parseInt(maghrib[0])+12).toString() + maghrib[1]);
         var isha = NamazSchedule.items[0].isha.split(':');
         isha=parseInt((parseInt(isha[0])+12).toString() + isha[1]);
        }

        var recent_time = parseInt(now.getHours().toString() + now.getMinutes().toString());
       if(((recent_time>isha)&&(recent_time<2400)||((recent_time<fajr)&&(recent_time>0)))){
         upcomming_namaz_time=NamazSchedule.items[0].fajr;
         upcomming_namaz_name="Fajr (فجر) Namaz: ";
       }else if ((recent_time>fajr)&&(recent_time<dhuhr)) {
         upcomming_namaz_name="Zhuhr (ظهر) Namaz:";
         upcomming_namaz_time=NamazSchedule.items[0].dhuhr;
       }else if ((recent_time>dhuhr)&&(recent_time<asr)) {
         upcomming_namaz_name="Asr (عصر) Namaz:";
         upcomming_namaz_time=NamazSchedule.items[0].asr;
       }else if ((recent_time>asr)&&(recent_time<maghrib)) {
         upcomming_namaz_name="Maghrib (مغرب) Namaz:";
         upcomming_namaz_time=NamazSchedule.items[0].maghrib;
       }else if ((recent_time>maghrib)&&(recent_time<isha)) {
         upcomming_namaz_name="Isha (عشاء) Namaz:";
         upcomming_namaz_time=NamazSchedule.items[0].isha;
         }
       NamazSchedule.qibla_direction_img="http://muslimsalat.com/qibla_compass/150/"+NamazSchedule.qibla_direction+".png";
       NamazSchedule.upcomming_namaz_name=upcomming_namaz_name;
       NamazSchedule.upcomming_namaz_time=upcomming_namaz_time;

       var url="http://api.aladhan.com/gToH";
       $http.get(url, {
     params: {
         date:date
     }
   })
  .success(function(response) {
    var day=response.data.hijri.day;
    var month1=response.data.hijri.month.en;
    var month2=response.data.hijri.month.ar;

  NamazSchedule.Hijri_date=day+" "+month1+" "+month2;
  NamazSchedule.Hijri_year=response.data.hijri.year;
    console.log(response);
    }).error(function(data) {
      deferred.reject(data);
    });;

       deferred.resolve(NamazSchedule);
     })
     .error(function(data) {
       deferred.reject(data);
     });

 return deferred.promise;
   };

});
