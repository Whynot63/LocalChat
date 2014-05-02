var path = location.href.replace('#', '');
var message = '';
var myMap;

ymaps.ready(init);

function init() {
    navigator.geolocation.getCurrentPosition(

    function (position) {
        longitude = position.coords.longitude;
        latitude = position.coords.latitude;
        var coords = [latitude, longitude];
        run_map(coords);
    }, function (error) {
        var errors = ['Вы не разрешили нам определять, где вы находитесь.\nВы нам не доверяте? :(',
                      'Мы не можем определить ваше местоположение.\nПопробуйте перезагрузить страницу.',
                      'При определении координат произошла ошибка. Истекло время ожидания.\nПопробуйте перезагрузить страницу.'];
        alert(errors[error.code - 1]);
    }, {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 1000
    });
}

function run_map(coords) {
    myMap = new ymaps.Map('map', {
        center: coords, 
        zoom: 15,
        controls: ['fullscreenControl', 'geolocationControl', 'typeSelector', 'zoomControl']
    }); 

    myMap.behaviors.disable(["dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"]);

    chatpoint = new ymaps.GeoObjectCollection({}, {});
    myMap.geoObjects.add(chatpoint);
    printChat();

    var balloon = null;

    myMap.events.add('dblclick', function (e) {
        cht_latitude = e.get('coords')[0].toPrecision(6);
        cht_longitude = e.get('coords')[1].toPrecision(6);
        balloon = myMap.balloon.open([cht_latitude, cht_longitude],
            ["<ul class='pricing-table'>",
                "<li class='title'>Создание нового чата</li>",
                "<li class='bullet-item'>", 
                    "<input type='text' onkeydown='checkKeyNewChat(", cht_latitude, ",", cht_longitude, ", event);' name='chat_name' id='chat_name' placeholder = 'Название беседы'>",
                "</li>",
                "<li class='bullet-item'>",
                    "<textarea onkeydown='checkKeyNewChat(", cht_latitude, ",", cht_longitude, ", event);' name='message' style='width:352px' id='message' class='input' placeholder='Ваше сообщение'>",
                    "</textarea>",
                "</li>",
                "<li class='cta-button'>",
                    "<a href='#' class='button' onclick='checkIfEmpty(", cht_latitude, ",", cht_longitude, ");'>Опубликовать</a>",
                "</li>",
            "</ul>"].join(''), {closeButton : false});
    });

    myMap.events.add('click', function (e) {
        if (myMap.balloon.isOpen()) {
            myMap.balloon.close();
        }
    });

    myMap.events.add('balloonclose', function () {
        printChat();
    });

    myMap.geoObjects.events.add('click', function (e) {
        printMessages(chatpoint.indexOf(e.get('target')), 'dfd');
    });
}

function setChat(cht_latitude, cht_longitude) {
    chatpoint.add(new ymaps.Placemark([cht_latitude, cht_longitude], {
                    iconContent: $('#chat_name').val()}, 
                    {preset: 'islands#blueStretchyIcon', balloonCloseButton: false}
                    ));

    $.ajax({
        url: path + 'set_chatpoint',
        type: 'get',
        data: {
            'x': cht_latitude,
            'y': cht_longitude,
            'chat_name': $('#chat_name').val()
        }
    });
    setMessage(chatpoint.getLength() - 1, true);
    myMap.balloon.close();
    printChat();
}

function setMessage(chat_id, new_chat) {
    $.ajax({
        url: path + 'set_message',
        type: 'get',
        data: {
            'chat_id': chat_id,
            'message': $('#message').val(),
            'author': Cookies.get('username')
        },
        success: function() {
            if (!new_chat){
                printMessages(chat_id);
            }
        }
    });
}

function printChat() {
    $.ajax({
        url: path + 'print_chatpoint',
        type: 'get',
        success: function (data) {
            chatpoint.removeAll();
            for (cht = 0; cht < JSON.parse(data).length; cht++) {
                chatpoint.add(new ymaps.Placemark([JSON.parse(data)[cht]['fields'].x.replace(',', '.'), JSON.parse(data)[cht]['fields'].y.replace(',', '.')], {
                    iconContent: JSON.parse(data)[cht]['fields'].chat_name}, 
                    {preset: 'islands#blueStretchyIcon', balloonCloseButton: false
                }));
            }
        }
    });
}

function printMessages(chatpoint_id) {
      var messages = '';
      $.ajax({
          type: 'get',
          async: false,
          url: path + 'print_message',
          data: {'chat_id': chatpoint_id},
          success: function (data) {
              message = data;
          },
          error: function () {
              console.log('error');
          }
      });
    message = JSON.parse(message);
    messages = ["<ul class='pricing-table'>",
                "<li class='title'>", 
                chatpoint.get(chatpoint_id).properties.get('iconContent'),
                "</li>",
                "<div class='chat_container'>",
                "<div>"].join('');
    for (msg = 0; msg < message.length; msg++) {
        if (message[msg]['fields'].author == Cookies.get('username')){
            messages += "<li class='message_my bullet-item'>" + 
                            "<p class='message'>" + String(message[msg]['fields'].message) + "</p>" + 
                            "<br>" + 
                            "<p class='author'>" + String(message[msg]['fields'].author) + "</p>" + 
                        "</li>";
        } else {
            messages += "<li class='message_oth bullet-item'>" +
                            "<p class='message'>" + String(message[msg]['fields'].message) + "</p>" + 
                            "<br>" + 
                            "<p class='author'>" + String(message[msg]['fields'].author) + "</p>" + 
                        "</li>";    
        }
    }
    messages +=     ["</div>",
                    "</div>",
                    "</ul>",
                    "<div class='row'><div class='large-12 columns' style='padding-left: 0px;   padding-right: 0px;'>",
                    "<div class='row collapse'>",
                    "<div class='small-10 columns' style='height:40px;'>",
                    "<input type='text' id='message' onkeydown='onKeyDownInChat(", chatpoint_id, ", event);'>",
                    "</div>",
                    "<div class='small-2 columns'>", 
                    "<a href='#' class='large button postfix' style='margin-bottom: 0px;' onclick='checkIfEmptyInChat(", chatpoint_id, ");'>",
                    "<i class='fi-comment size-72'>",
                    "</a>",
                    "</div>",
                    "</div>",
                    "</div>"].join('');
    chatpoint.get(chatpoint_id).properties.set('balloonContentBody', messages);
}

function checkIfEmptyInChat (chatpoint_id) {
    if($('#message').val() == '') {
        alert('Сообщение не может быть пустой строкой');
    } else {
        setMessage(chatpoint_id);
    }
}

function onKeyDownInChat (chatpoint_id, e) {
    console.log(e.keyCode);
    if (e.keyCode == 13) {
        checkIfEmptyInChat(chatpoint_id);
    }
}

function checkKeyNewChat (cht_lat, cht_long, e) {
    console.log(e.keyCode);
    if (e.keyCode == 13) {
        checkIfEmpty(cht_lat, cht_long);
    }
}

function checkIfEmpty (cht_lat, cht_long) {
    if ($('#chat_name').val() == '') {
        alert('Имя чата не может быть пустой строкой');
    } else if ($('#message').val() == '') {
        alert('Сообщение не может быть пустым');
    } else {
        setChat(cht_lat, cht_long);
    }
}