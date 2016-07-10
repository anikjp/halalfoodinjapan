angular.module('starter.factory', [])
.factory('Userfactory', function(){
    var user =
        {
            active: ''
        };

    return {
        getActive: function () {
            return user.active;
        },
        setActive: function (active) {
            user.active = active;
        }
    };
});
