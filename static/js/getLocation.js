navigator.geolocation.getCurrentPosition(
 
    function (position) {
        alert("Координаты: " + position.coords.longitude + ", " + position.coords.latitude);
    },
    
    function (error) {
        alert("При определении координат произошла ошибка. Ее код: " + error.code);
    },
    
    {
        enableHighAccuracy : false,    
        timeout : 10000,
        maximumAge : 1000 
    }
);

function extend (child, parent) {
    var c = function () {};
    c.prototype = parent.prototype;
    c.prototype.constructor = parent;
    return child.prototype = new c();
};