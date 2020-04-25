
document.addEventListener('DOMContentLoaded', function(){

	//For Hello username!
	if(localStorage.username === undefined){
		document.querySelector('#nameForm').onsubmit = function(){
			localStorage.username = document.querySelector('#username').value;
			alert(`Hello ${localStorage.username}!`);
		};
	}
	else {
		document.querySelector('#nameForm').remove();
		document.querySelector('#usernameSpace').innerHTML += "<h2> Hello "+ localStorage.username + "</h2>";
		document.querySelector('#afterLogin').style.display = 'initial';
	}

	//After username Socket connection!
	// Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    socket.emit('userCreated',{'username': localStorage.username});


    //Creating a channel stream
    var channels = ["Alpha","Beta","Gamma"];
    var channelName = "";
    socket.on('connect',()=>{

    	//Displaying Available Channel list
    	function displayChannelList(){
    		document.querySelector("#channelList").innerHTML="";
	    	const li = document.createElement('li');
	    	for (var i = 0; i < channels.length; i++){
	    		li.innerHTML = channels[i];
	    		document.querySelector("#channelList").append(li);
	    		document.querySelector("#channelList").innerHTML+="<br>";
	    	}
    	}
    	displayChannelList();
    
	    //Create channel
	    document.querySelector('#createChannelForm').onsubmit = ()=>{
	    	channelName = document.querySelector('#createChannelInput').value;
	    	console.log(channelName);
	    	channels.push(channelName);
	    	displayChannelList();
	    	socket.emit('channelCreateRequest',{'channelName':channelName});
	    };
    
    });

    //On recieving channel list
    /*cket.on('channelListSent',data=>{
    	channels.concat(data["channelList"]);
    });*/

    //After Channel is created connecting user
    socket.on('channelCreated',data =>{
		document.querySelector('#createChannelDIV').innerHTML+="<h1>CHANNEL CREATED ! </h1>";
		displayChannelList();
	});
    //If the channel already exists
	socket.on('channelExists',data =>{
		document.querySelector('#createChannelDIV').innerHTML+="<h1>CHANNEL Already Exists ! </h1>";
		displayChannelList();


	});	
    
});