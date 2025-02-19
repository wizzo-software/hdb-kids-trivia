
import axios from 'axios'

const globalMixin = {
  data(){ return {
    timerTitleTimer: false
  }},
  computed: {
    isApp(){ 
      //return true;
      return (!this.isNull(window.cordova) && window.cordova != false); // true
    },
    isIOS(){
      return (this.isApp && this.getMobileOperatingSystem() == 'iOS');
      //return false;
    },
    
  },
    methods: {
      alert(msg)
      {
        this.$swal(msg);
      },
        
      toast(msg, icon ='success', customClass = 'my_toast') {
        return this.$swal.fire({
          icon,
          text: msg,
          toast: true,
          position: 'bottom-start',
          showConfirmButton: false,
          customClass:{
            container: customClass
          },
          timer: 3000 
        });
      },
      superToast(ico,msg,ask=false, timer=5000, showTimer=true){

        return new Promise((resolve, reject) => {
  
          this.$swal.fire({
  
            toast: true,
  
            html: msg,
  
            target: '#page',
  
            customClass: {
  
              container: 'toast-custom2'
  
            },
  
            timer: timer,
  
            timerProgressBar: showTimer,
  
            showConfirmButton: false,
  
            showCancelButton: ask,
  
            cancelButtonText: 'לבטל?',
  
            icon: ico ? 'success' : 'error',
  
            didOpen: (toast) => {
  
              toast.addEventListener('mouseenter', this.$swal.stopTimer)
  
              toast.addEventListener('mouseleave', this.$swal.resumeTimer)
  
            },
  
          }).then((res) => {
  
            if (res.dismiss == 'cancel') reject()
  
            else resolve()
  
          })
  
        });
  
      },
      set_user_token(str)
      {
        localStorage.setItem('user_token',str);
        /*
        var myDate = new Date();
        myDate.setMonth(myDate.getMonth() + 12);
        let cookieName = 'app_user';
        let cookieValue = (str == '' ? '0' : '1');
        document.cookie = cookieName +"=" + cookieValue + ";expires=" + myDate + ";domain=.7brachot.co.il;path=/";
        */
      },

      logout(){
        localStorage.removeItem('user_token');
        /*
        var myDate = new Date();
        myDate.setMonth(myDate.getMonth() + 12);
        let cookieName = 'app_user';
        let cookieValue = '0';
        document.cookie = cookieName +"=" + cookieValue + ";expires=" + myDate + ";domain=.7brachot.co.il;path=/";
  */
        this.$bus.$emit('reload', '/');

      },
        

      get_me(){
        return this.$store.state.user;
      },
      
      bg(pic){
        return 'background-image:url(' + pic + ')';
      },
      getMobileOperatingSystem() {
        var userAgent = navigator.userAgent.toLowerCase() || navigator.vendor || window.opera;
      
        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/ipad|iphone|ipod/.test(userAgent) && !window.MSStream) {
          return "iOS";
        }
        
        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
          return "Windows Phone";
        }
      
        if (/android/i.test(userAgent)) {
          return "Android";
        }
      
      
        return "unknown";
      },
      get_word(key){
        return this.$store.words[key];
      },
      format_number: function(x) {
        x = (x*1).toFixed(2);
        if (x == parseInt(x)) x= parseInt(x);
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      isNull: function (str)
      {
        if (str === true || str === false || str === 0) return false;
        
        return (str == '' || str == null || str == undefined);
      },
  
      get_client(id){
        let res = this.$store.state.clients.filter(row => row.id == id);
        if (res && res[0]) return res[0];
      },

      parse_date(str){
        
        let addZero = (num) => {
          if (num < 10) return '0' + num;
          else return num;
        }

        var d=new Date(str); return addZero(d.getDate()) + '/' + addZero(d.getMonth() + 1) + '/' + d.getFullYear().toString().substr(-2);
      },
  
      parse_datetime(str){

        let addZero = (num) => {
          if (num < 10) return '0' + num;
          else return num;
        }

        var d=new Date(str); 
        return addZero(d.getDate()) + '/' + addZero(d.getMonth() + 1) + '/' + d.getFullYear().toString().substr(-2) + ' ' + addZero(d.getHours()) + ':' + addZero(d.getMinutes());
      },
        

      parse_time(str){
        let addZero = (num) => {
          if (num < 10) return '0' + num;
          else return num;
        }

        var d=new Date(str); 

        return addZero(d.getHours()) + ':' + addZero(d.getMinutes());
      },
      
      shareURL(url, title = 'טיקט בסאנדיי'){

        if (this.isApp)
        {
          var options = {
          url: url,
          message: title,
          };
          var onSuccess = function() { };
          var onError = function() { };
          window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
        }
        else
        {
          this.$bus.$emit('share_url', url)
        }

      },

      toHHMM(str, ret = 'all') {
        var sec_num = parseInt(str, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);
    
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}

        switch(ret)
        {
          case 'all': { return hours+':'+minutes; }
          case 'hours': { return hours; }
          case 'minutes': { return minutes; }
        }

        
      },

      get_item(action, type, id){

        var promise = new Promise((resolve/*, reject*/) => {

          if (this.$store.state[type][id] != null)
          {
            resolve(this.$store.state[type][this.id]);
          }
          else
          {
            this.api({action: action, data: { id: id }, method:'get'}, (data) => {

              this.save_item_to_store(data.data)

              resolve(data.data);
            });
          }

        });
        return promise;
      },

      api(settings, func, failFunc){

        if (this.isNull(func)) func = function(){};
    
         var headers = {
           'Content-Type': 'application/json; charset=utf-8',
         };

         if(!this.isNull(localStorage.getItem('user_token'))) 
         { 
           headers.Authorization = localStorage.getItem('user_token');
         }
         headers.platform = (window.location.hostname == 'localhost' ? '' : window.location.hostname);
        //  headers.platform = 'wizzo.app.sunday.coffee'; // FOR TESTS ONLY!!

//       var requestOBJ;
         const cancelTokenSource = axios.CancelToken.source();

    
           if (settings.method == 'get')
           {
              let actionGet = settings.action;
              actionGet = actionGet + (actionGet.indexOf('?') === -1 ? '?' : '&');
              actionGet = actionGet + 'ts='  + (new Date()).getHours() + '_' + ((new Date()).getMinutes() < 30 ? '0' : '30');

              if (!this.isNull(settings.data))
              { 
              for (let i in settings.data) actionGet += '&' + i + '=' + settings.data[i];
              }

               axios.get(window.api_url + actionGet, { headers: headers, cancelToken: cancelTokenSource.token } ).then(response => {
                this.alert(response.data)
                if (response.data == 'error')
                {
                  this.set_user_token('');
                  this.$bus.$emit('reload', '/');
                }
                else if (response.data == 'PERMS')
                {
                  this.alert('אין לי הרשאה לעמוד הנוכחי');
                }
                else func(response.data);
             }, response => { 
             
               if (!this.isNull(failFunc)) failFunc(response);
               else func(false);
             });
        

// Cancel request
//cancelTokenSource.cancel();

           }
           else
           {
            axios.post(window.api_url + settings.action, settings.data, { headers: headers, cancelToken: cancelTokenSource.token })
            .then(response => { 
              if (response.data == 'error')
              {
                this.set_user_token('');
                this.$bus.$emit('reload', '/');
              }
              else if (response.data.data == 'PERMS')
              {
                this.alert('אין לי הרשאה לעמוד הנוכחי');
              }
              else func(response.data);
                 //console.log(response.body);
             }, response => { 
               if (!this.isNull(failFunc)) failFunc(response);
               //else func(false);
                 //console.error(response.body);
             });
         }
         
        return cancelTokenSource;
    
       },
  
  
      is_mobile: function(){ 
        const toMatch = [
          /Android/i,
          /webOS/i,
          /iPhone/i,
          /iPad/i,
          /iPod/i,
          /BlackBerry/i,
          /Windows Phone/i
      ];
  
      return toMatch.some((toMatchItem) => {
          return navigator.userAgent.match(toMatchItem);
      });
      
      },

      get_priority_name(id){
        for (let i in this.$store.priorities_list)
        {
          if (this.$store.priorities_list[i].id == id) return this.$store.priorities_list[i].name;
        }
  
        return '';
      },

      
      changePlatform(platformID){
        this.set_user_token(this.$store.state.platforms_list.filter(row => row.id == platformID)[0].token);
        this.$bus.$emit('reload', '/');
      },



        
      calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Earth's radius in meters
        const phi1 = (lat1 * Math.PI) / 180;
        const phi2 = (lat2 * Math.PI) / 180;
        const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
        const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

        const a =
          Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
          Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
      },

      getLocation() {
        return new Promise((resolve/*, reject*/) => {

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const userLatitude = position.coords.latitude;
              const userLongitude = position.coords.longitude;

              const distance = this.calculateDistance(
                userLatitude,
                userLongitude,
                this.$store.state.platform.office_location_lat,
                this.$store.state.platform.office_location_lon
              );

              if (distance <= this.$store.state.platform.office_location_range) {
                resolve(true); // User is within X meters of the target location
              } else {
                resolve(false); // User is NOT within X meters of the target location
              }
            }, (error) => {
              switch (error.code) {
                case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
                case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
                case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
                case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
              }
            }
          );
        } else {
          alert("Geolocation is not supported in this browser.");
        }
      });
    },

    
    afterLogin(){
      if (!this.isApp) return false;
      //if (!this.isIOS)
      //{
      var self = this;
      if (!this.isIOS)
      {
        window.cordova.plugins.firebase.messaging.requestPermission({forceShow: true}).then(function() {
    
            window.cordova.plugins.firebase.messaging.subscribe("main");
        
            window.cordova.plugins.firebase.messaging.getToken().then(function(token) {
       
              self.api({ 'action': 'users/set_push_token', data: {'token': token}}, function(){
 
              });
            });
        });
      }
      else{
        window.cordova.plugins.firebase.messaging.requestPermission({forceShow: true}).then(() => {
     
          window.cordova.plugins.firebase.messaging.subscribe("main");
        
            window.cordova.plugins.firebase.messaging.getToken().then(function(token) {
          
              self.api({ 'action': 'users/set_push_token', data: {'token': token}});
            });
          });
      }
      //}
    },

    playShift(){
      if (this.$store.state.platform.active_office_location){
        this.getLocation().then((res) => { alert(res);

          // fix pc location problem
          
          if (/*this.isApp && */!res){
            this.alert('ניתן להפעיל את השעון רק מתוך המשרד');
            return;
          }

          this.playShift_do();
        });

      }
      else this.playShift_do();
    },
      playShift_do(){
        this.api({ action: "tracking/save_shift"}, (data) => {

          this.$bus.$emit('tracking_updated');

          if (!data.data.status) {
            const ttl = data.data.ttl;
            // const start = data.data.started;
            // const end = data.data.ended;
            this.toast(
              "המשמרת הסתיימה בהצלחה! המשמרת ארכה כ: " +
              ttl.hours +
              ":" +
              ttl.minutes +
              ":" +
              ttl.seconds
            );

            this.$store.state.trackingTimer = false;
          }
          else
          {
              this.$store.state.trackingTimer = new Date(data.data.start_date);
          }
        });
      },
  
     }
    }

    export default globalMixin