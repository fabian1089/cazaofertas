/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
		
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
		
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        var pushNotification = window.plugins.pushNotification;  //alert('antes del push');
        if (device.platform == 'android' || device.platform == 'Android') {
            //alert("Register called");
            //tu Project ID aca!!
           // pushNotification.register(this.successHandler, this.errorHandler,{"senderID":"PROJECT_ID","ecb":"app.onNotificationGCM"});
		   pushNotification.register(this.successHandler, this.errorHandler,{"senderID":"894721639393","ecb":"app.onNotificationGCM"});
        }
        else {
           // alert("Register called");
            pushNotification.register(this.successHandler,this.errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"app.onNotificationAPN"});
        }
    },
    // result contains any message sent from the plugin call
    successHandler: function(result) {
        //alert('Callback Success! Result = '+result)
    },
    errorHandler:function(error) {
        alert(error);
    },
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    console.log("Regid " + e.regid);
                   // alert('registration id = '+e.regid);
                    //Cuando se registre le pasamos el regid al input
                   document.getElementById('regId').value = e.regid;
				   window.localStorage.getItem("gcm_id",e.regid);
                }
            break;
 
            case 'message':
              // NOTIFICACION!!!
             // alert('message = '+e.message+' msgcnt = '+e.msgcnt+' Prueba: '+e.codigo_oferta);
			  
			 var id_usuario=window.localStorage.getItem("consecutivoUsuario");
	          var latitud=window.localStorage.getItem('latitud');
			  var longitud=window.localStorage.getItem('longitud');
              var codigo_oferta= e.message.split('cod:');
			  
			  // alert('message = '+e.message+' msgcnt = '+e.msgcnt+codigo_oferta[1]);
			  
				$.ajax({
			  	url: "http://www.cazaofertasapp.com/ofertaPorId.php?pass=fghkdfh432hhjg&codigo_oferta="+codigo_oferta[1]+"&latitud="+latitud+"&longitud="+longitud+"&id_usuario="+id_usuario,
				contentType: "application/json",
				//data:datos,	
				type:'GET',
				dataType:'JSON',
			  	success: function( response ) {	
				
				var cont=0;
					var id_tienda=response[cont]['id_tienda'];
					var id_oferta=response[cont]['id_oferta'];
					var titulo=response[cont]['titulo'];
					var nombre=response[cont]['nombre'];
					var descOferta=response[cont]['descOferta'];
					var direccion=response[cont]['direccion'];
					var tiendaDesc=response[cont]['tiendaDesc'];
					var latitud=response[cont]['latitud'];
					var longitud=response[cont]['longitud'];
					var distancia=response[cont]['distancia'];
					
					var cantidad=response[cont]['cantidad'];
					var limite=response[cont]['limite'];
					var disponibles=response[cont]['disponibles'];
					var fotos=response[cont]['fotos'];
					var aplico=response[cont]['aplico'];
					var fotos_tienda=response[cont]['fotos_tienda'];
					var telefonos=response[cont]['telefonos'];
					var formato_oferta=response[cont]['formato_oferta'];
					var formato_tienda=response[cont]['formato_tienda'];
					var nombre_foto=response[cont]['nombre_foto'];
					var website=response[cont]['website'];
					
					mostrarDetalles(id_tienda,id_oferta,titulo,nombre,descOferta,direccion,tiendaDesc,latitud,longitud,distancia, cantidad,limite,disponibles, fotos, aplico, fotos_tienda,telefonos, formato_oferta, formato_tienda, nombre_foto,website);
				
				//falta: cantidad,limite,disponibles, fotos, aplico, fotos_tienda,telefonos, formato_oferta, formato_tienda, nombre_foto,website
					
				
				},
				timeout: 6000,  // Timeout after 6 seconds
				error: function(jqXHR, textStatus, errorThrown) {
				alert('No se pudo realizar la acción. Por favor verifique su conexión a internet');
					//console.log("Error, textStatus: " + textStatus + " errorThrown: "+ errorThrown);
					$.mobile.loading( "hide" );
				}
			}); 
			  
            break;
 
            case 'error':
              alert('GCM error = '+e.msg);
            break;
 
            default:
              alert('An unknown GCM event has occurred');
              break;
        }
    },
    onNotificationAPN: function(event) {
        var pushNotification = window.plugins.pushNotification;
        alert("Running in JS - onNotificationAPN - Received a notification! " + event.alert);
        
        if (event.alert) {
            navigator.notification.alert(event.alert);
        }
        if (event.badge) {
            pushNotification.setApplicationIconBadgeNumber(this.successHandler, this.errorHandler, event.badge);
        }
        if (event.sound) {
            var snd = new Media(event.sound);
            snd.play();
        }
    }
};
