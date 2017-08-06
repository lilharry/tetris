
var initPack = {player:[]};
var removePack = {player:[]};


getFrameUpdateData = function(){
	var pack = {
		initPack:{
			player:initPack.player,

		},
		removePack:{
			player:removePack.player,
		},
		updatePack:{
			player:Player.update(),
		}
	};
	initPack.player = [];
	removePack.player = [];
	return pack;
}


Player = function(param){
	var self = {};
	self.number = "" + Math.floor(10 * Math.random());
	self.username = param.username;
	self.canvasDataURL = 0;
	self.pressingRight = false;
	self.pressingLeft = false;
	self.pressingUp = false;
	self.pressingDown = false;
	

	self.update = function(canvasDataURL){
		self.canvasDataURL = canvasDataURL; 
	}
	self.getInitPack = function(){
		return {
			name:self.name,
		};		
	}
	self.getUpdatePack = function(){
		return {
			name:self.name,
		}	
	}
	
	Player.list[self.id] = self;
	initPack.player.push(self.getInitPack());
	return self;
}
Player.list = {};
Player.onConnect = function(socket,username){
	var player = Player({
		username:username,
		id:socket.id,
		socket:socket,
	});
	socket.on('keyPress',function(data){
		if(data.inputId === 'left')
			player.pressingLeft = data.state;
		else if(data.inputId === 'right')
			player.pressingRight = data.state;
		else if(data.inputId === 'up')
			player.pressingUp = data.state;
		else if(data.inputId === 'down')				 //harddrop, softdrop, save
			player.pressingDown = data.state;
	});
/*	socket.on('sendMsgToServer',function(data){
		for(var i in SOCKET_LIST){
			SOCKET_LIST[i].emit('addToChat',player.username + ': ' + data);
		}
	});
	
	socket.on('sendPmToServer',function(data){ //data:{username,message}
		var recipientSocket = null;
		for(var i in Player.list)
			if(Player.list[i].username === data.username)
				recipientSocket = SOCKET_LIST[i];
		if(recipientSocket === null){
			socket.emit('addToChat','The player ' + data.username + ' is not online.');
		} else {
			recipientSocket.emit('addToChat','From ' + player.username + ':' + data.message);
			socket.emit('addToChat','To ' + data.username + ':' + data.message);
		}
	});
	*/
	socket.emit('init',{
		selfId:socket.id,
		player:Player.getAllInitPack(),
		//queue:queue.getAllInitPack(),
	})
}
Player.getAllInitPack = function(){
	var players = [];
	for(var i in Player.list)
		players.push(Player.list[i].getInitPack());
	return players;
}

Player.onDisconnect = function(socket){
	delete Player.list[socket.id];
	removePack.player.push(socket.id);
}
Player.update = function(){
	var pack = [];
	for(var i in Player.list){
		var player = Player.list[i];
		player.update();
		pack.push(player.getUpdatePack());		
	}
	return pack;
}