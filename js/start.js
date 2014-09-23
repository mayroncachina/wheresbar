var pushNotification;

document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//
function onDeviceReady() {
   //initPushwoosh();

}

function initPushwoosh() {
    var pushNotification = window.plugins.pushNotification;
    pushNotification.onDeviceReady();

    pushNotification.registerDevice({ alert:true, badge:true, pw_appid:"AEE04-46B30", appname:"Wheresbar", projectid: "870510407514", appid : "AEE04-46B30" },
        function(status) {
            var pushToken = status;
            console.warn('push token: ' + pushToken);
        },
        function(status) {
            navigator.notification.alert(JSON.stringify(['failed to register ', status]));
        }
    );

    document.addEventListener('push-notification', function(event) {
        var title = event.notification.title;
            var userData = event.notification.userdata;

        if(typeof(userData) != "undefined") {
            console.warn('user data: ' + JSON.stringify(userData));
        }
        alert('mudar para pagina do bar');
        navigator.notification.alert(title);
    });
}

 $(document).delegate("#home", "pageinit", function(event) {

    $(".iscroll-wrapper", this).bind( {
    "iscroll_onpulldown" : onPullDown,
    "iscroll_onpulldownpulled" : onPullulled
    });

    function onPullDown(){
        reloadList();
    }
    function onPullulled(){
        setTimeout(function(){
            //$(".iscroll-pulldown").toggle()
            $(".iscroll-wrapper").resizeWrapper()
        }, 2000);
        
    }

});

function formattedDate(date) {
    var d = new Date(date || Date.now()),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('/');
}

function reloadList(){

var url = "http://wheresbar.com.br:8080/webservices/bares/";
console.log(url)
  $.ajax({
      url: url,
      type: 'GET',
      error : function (data){
              
              console.log(data);
      },
      success: function (data) {

        linha = "";
        for (var i = 0; i < data.length; i++) {

          linha += '<li>';
          linha += '  <a href="#" onclick="setLinkLoja('+data[i][4]+')">';
          linha += '    <img src="http://wheresbar.com.br:8080/static/'+data[i][0]+'" width="70" style="left: 8px;top: 4px;">';
          linha += '    <h2>'+data[i][1]+'</h2>';
          linha += '    <p>'+data[i][2]+'</p></a>';
          linha += '    <span class="ui-li-count">'+data[i][3]+'</span>';
          linha += '  </a>';
          linha += ' </li>';
          

        };
      $(".ui-listview").html(linha);
      $('.ui-listview').listview('refresh');

      }
  });
}
$(document).on('pageinit', '#home', function(){ 
  reloadList()
});

function getBar(id){
  $.mobile.loading('show')
  var url = "http://www.wheresbar.com.br:8080/webservices/bar/"+id;
  $.ajax({
      url: url,
      dataType: "json",
      type: 'GET',
      error : function (data){
              
               console.log(data)
      },
      success: function (data) {

          console.log(data[0].fields.imagem)
          $(".barName").html(data[0].fields.nome)
          $(".barBairro").html(data[0].fields.bairro)
          $(".barImage").html("<img src='http://wheresbar.com.br:8080/static/"+data[0].fields.imagem+"' width='100' />");

          $(".barDescricao").html(data[0].fields.descricao)

          var about = "Endereço : "+ data[0].fields.endereco;
          about += "<br/>Telefone : "+ data[0].fields.telefones;
          about += "<br/>Atendimento : "+ data[0].fields.atendimento;
          $(".about").html(about)

          $(".serv").html(data[0].fields.servicos);
          $("#gmaps").attr("href","geo:"+data[0].fields.mapa);
          $.mobile.loading('hide');
          getFotosByBar(id);
      }
  });
}


function getFotosByBar(id_bar){
  
  $.mobile.loading('show')
  $.mobile.changePage( "#tela-bar", { transition: "slide"});
  var url = "http://www.wheresbar.com.br:8080/webservices/fotos/"+id_bar;
  $.ajax({
      url: url,
      dataType: "json",
      type: 'GET',
      error : function (data){
              
               console.log(data)
      },
      success: function (data) {

          var url = "http://www.wheresbar.com.br:8080/webservices/fotos/"+id_bar;
          console.log(url)
          $.ajax({
            url: url,
            dataType: "json",
            type: 'GET',
            error : function (data){
              console.log(data)
            },

            success: function (data) {
              var fotos = "<div class='ui-grid-c'>";
              for (var i = 0; i < data.length; i++) {
                //console.log(data[i].fields)
                //fotos += "<li><img src='http://www.wheresbar.com.br:8080/static/"+data[i].fields.imagem+"'/></li>";
                if(i>7){
                  break;
                }
                switch (i){
                    case 0:
                    //<a href='#popupPhotoLandscape' data-rel='popup' data-position-to='window' class='ui-btn ui-corner-all ui-shadow ui-btn-inline'>Photo landscape</a>
                      fotos += "<div class='ui-block-a'><div class='ui-bar ui-bar-a content-img' ><img class = 'foto-bar myphotos' rel='group1' src='http://www.wheresbar.com.br:8080/static/"+data[i].fields.imagem+"'  data-glisse-big='http://www.wheresbar.com.br:8080/static/"+data[i].fields.imagem+"'/></div></div>";
                    break;
                    case 1:
                      fotos += "<div class='ui-block-b'><div class='ui-bar ui-bar-a content-img' ><img class = 'foto-bar myphotos' rel='group1' src='http://www.wheresbar.com.br:8080/static/"+data[i].fields.imagem+"'  data-glisse-big='http://www.wheresbar.com.br:8080/static/"+data[i].fields.imagem+"'/></div></div>";
                      break;
                    case 2:
                      fotos += "<div class='ui-block-c'><div class='ui-bar ui-bar-a content-img' ><img class = 'foto-bar myphotos' rel='group1' src='http://www.wheresbar.com.br:8080/static/"+data[i].fields.imagem+"'  data-glisse-big='http://www.wheresbar.com.br:8080/static/"+data[i].fields.imagem+"'/></div></div>";
                      break;
                    case 3:
                      fotos += "<div class='ui-block-d'><div class='ui-bar ui-bar-a content-img' ><img class = 'foto-bar myphotos' rel='group1' src='http://www.wheresbar.com.br:8080/static/"+data[i].fields.imagem+"'  data-glisse-big='http://www.wheresbar.com.br:8080/static/"+data[i].fields.imagem+"'/></div></div>";
                      break;
                    case 4:
                      fotos += "<div class='ui-block-a'><div class='ui-bar ui-bar-a content-img' ><img class = 'foto-bar myphotos' rel='group1' src='http://www.wheresbar.com.br:8080/static/"+data[i].fields.imagem+"'  data-glisse-big='http://www.wheresbar.com.br:8080/static/"+data[i].fields.imagem+"'/></div></div>";
                      break;
                    case 5:
                      fotos += "<div class='ui-block-b'><div class='ui-bar ui-bar-a content-img' ><img class = 'foto-bar myphotos' rel='group1' src='http://www.wheresbar.com.br:8080/static/"+data[i].fields.imagem+"'  data-glisse-big='http://www.wheresbar.com.br:8080/static/"+data[i].fields.imagem+"'/></div></div>";
                      break;
                      case 6:
                      fotos += "<div class='ui-block-c'><div class='ui-bar ui-bar-a content-img' ><img class = 'foto-bar myphotos' rel='group1' src='http://www.wheresbar.com.br:8080/static/"+data[i].fields.imagem+"'  data-glisse-big='http://www.wheresbar.com.br:8080/static/"+data[i].fields.imagem+"'/></div></div>";
                      break;
                    case 7:
                      fotos += "<div class='ui-block-d'><div class='ui-bar ui-bar-a content-img' ><img class = 'foto-bar myphotos' rel='group1' src='http://www.wheresbar.com.br:8080/static/"+data[i].fields.imagem+"'  data-glisse-big='http://www.wheresbar.com.br:8080/static/"+data[i].fields.imagem+"'/></div></div>";
                      break;
                }
              };
              fotos += "</div>";
              //fotos += "</ul>";
              $(".photos").html(fotos)
            //  setTimeout(function(){ 
                $(".foto-bar").css("height","inherit");
                $(".content-img").css("height","60px");
                $(".ui-bar-a").css("border-style","none");
                $(function () {
                 $('.myphotos').glisse({speed: 500, changeSpeed: 550, effect:'fade', fullscreen: false}); 
                 });
               // $(".lista-img").css("padding","0px");
             // },2000) 
              $.mobile.loading('hide');
            }
          });
      }
  });
}

function setLinkLoja(id){
  votacao(0);
 localStorage.setItem('linkLoja', id);
 console.log(localStorage.getItem('linkLoja'));
 getBar(id);
 $.mobile.changePage( "#bar", { transition: "slide"});
}

function votacao(id){
  switch (id){
    case 0:
      $("#estrela-1").css("color","gray");
      $("#estrela-2").css("color","gray");
      $("#estrela-3").css("color","gray");
      $("#estrela-4").css("color","gray");
      $("#estrela-5").css("color","gray");
    break;
    case 1:
      $("#estrela-1").css("color","gold");
      $("#estrela-2").css("color","gray");
      $("#estrela-3").css("color","gray");
      $("#estrela-4").css("color","gray");
      $("#estrela-5").css("color","gray");
    break;
    case 2:
      $("#estrela-1").css("color","gold");
      $("#estrela-2").css("color","gold");
      $("#estrela-3").css("color","gray");
      $("#estrela-4").css("color","gray");
      $("#estrela-5").css("color","gray");
    break;
    case 3:
      $("#estrela-1").css("color","gold");
      $("#estrela-2").css("color","gold");
      $("#estrela-3").css("color","gold");
      $("#estrela-4").css("color","gray");
      $("#estrela-5").css("color","gray");
    break;
    case 4:
      $("#estrela-1").css("color","gold");
      $("#estrela-2").css("color","gold");
      $("#estrela-3").css("color","gold");
      $("#estrela-4").css("color","gold");
      $("#estrela-5").css("color","gray");
    break;
    case 5:
      $("#estrela-1").css("color","gold");
      $("#estrela-2").css("color","gold");
      $("#estrela-3").css("color","gold");
      $("#estrela-4").css("color","gold");
      $("#estrela-5").css("color","gold");
    break;
  }
}