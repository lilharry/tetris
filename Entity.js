
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

var initGrid = function(){
	numrows = 22;
	numcols = 10;
	var arr = [];
   	for (var i = 0; i < numcols; ++i){
      var columns = [];
      for (var j = 0; j < numrows; ++j){
         columns[j] = 0;
      }
      arr[i] = columns;
    }
    return arr;
}



var I_BLOCK = {type:1, 
			x:[-1, 0, 1, 2],
			y:[0, 0, 0, 0]};
var J_BLOCK = {type:2, 
			x:[-1, 0, 1, -1],
			y:[0, 0, 0, -1]};
var L_BLOCK = {type:3, 
			x:[-1, 0, 1, 1],
			y:[0, 0, 0, -1]};
var O_BLOCK = {type:4, 
			x:[0, 0, 1, 1],
			y:[-1, 0, -1, 0]};
var S_BLOCK = {type:5, 
			x:[-1, 0, 0, 1],
			y:[0, 0, -1, -1]};
var T_BLOCK = {type:6, 
			x:[-1, 0, 1, 0],
			y:[0, 0, 0, -1]};
var Z_BLOCK = {type:7, 
			x:[-1, 0, 1, 0],
			y:[-1, -1, 0, 0]}

Player = function(param){
	var self = {
	id : param.id,
	grid : initGrid(),
	curr : 1,
	usedHold : 0,
	currPiece : I_BLOCK,
	xorigin: 5,
	yorigin: 2,
	testPiece : I_BLOCK,
	holdPiece : I_BLOCK,
	pieceQueue : [1,2,3,4,5,6,7],
	username : param.username,
	dropDownTime : 0,
	pressingRight : false,
	pressingLeft : false,
	pressingUp : false,
	pressingDown : false,
	}
	//console.log(self);
	
	self.printGrid = function(){
	  var str = ""
	  for(var i=0; i<22; i++){
	    for(var j=0; j<10; j++){
	      str=self.grid[j][i]+",";
	    }
	    console.log(str)
	  }
	}
	self.removeFromBoard = function(){
		for (var i=0;i<4;i++){
			var x=self.xorigin + self.currPiece.x[i];
		    var y=self.yorigin + self.currPiece.y[i];
		    self.grid[x][y]=0;
		 }
	}
	self.updateBoard = function(){
		for (var i=0;i<4;i++){
		    var x=self.xorigin + self.currPiece.x[i];
		    var y=self.yorigin + self.currPiece.y[i];
		    self.grid[x][y]=self.currPiece.type;
		  }
	}
	self.initCurrPiece = function(){
		self.pieceQueue.sort(function(a, b){return 0.5 - Math.random()});
		self.curr = 1;
		switch (self.pieceQueue[self.curr]){
			case 0: self.currPiece = I_BLOCK; self.testPiece = self.currPiece; break;
			case 1: self.currPiece = J_BLOCK; self.testPiece = self.currPiece; break;
			case 2: self.currPiece = L_BLOCK; self.testPiece = self.currPiece; break; 
			case 3: self.currPiece = O_BLOCK; self.testPiece = self.currPiece; break;
			case 4: self.currPiece = S_BLOCK; self.testPiece = self.currPiece; break; 
			case 5: self.currPiece = T_BLOCK; self.testPiece = self.currPiece; break;
			case 6: self.currPiece = Z_BLOCK; self.testPiece = self.currPiece; break;
		}
		switch (self.pieceQueue[self.curr-1]){
			case 0: self.holdPiece = I_BLOCK; break;
			case 1: self.holdPiece = J_BLOCK; break;
			case 2: self.holdPiece = L_BLOCK; break;
			case 3: self.holdPiece = O_BLOCK; break;
			case 4: self.holdPiece = S_BLOCK; break;
			case 5: self.holdPiece = T_BLOCK; break;
			case 6: self.holdPiece = Z_BLOCK; break;
		}
	}
	self.nextPiece=function(){
		console.log("next");
		if (self.curr==7){  
			self.pieceQueue.sort(function(a, b){return 0.5 - Math.random()});
			self.curr = 0;
		}
		self.curr+=1;
		self.usedHold=0;
		self.updateBoard();
		self.xorigin = 5;
		self.yorigin = 2;
		switch (self.pieceQueue[self.curr]){
			case 0: if(self.isDie(I_BLOCK,self.grid)) return 0; self.currPiece = I_BLOCK; self.testPiece = self.currPiece; break;
			case 1: if(self.isDie(J_BLOCK,self.grid)) return 0; self.currPiece = J_BLOCK; self.testPiece = self.currPiece; break;
			case 2: if(self.isDie(L_BLOCK,self.grid)) return 0; self.currPiece = L_BLOCK; self.testPiece = self.currPiece; break;
			case 3: if(self.isDie(O_BLOCK,self.grid)) return 0; self.currPiece = O_BLOCK; self.testPiece = self.currPiece; break;
			case 4: if(self.isDie(S_BLOCK,self.grid)) return 0; self.currPiece = S_BLOCK; self.testPiece = self.currPiece; break;
			case 5: if(self.isDie(T_BLOCK,self.grid)) return 0; self.currPiece = T_BLOCK; self.testPiece = self.currPiece; break;
			case 6: if(self.isDie(Z_BLOCK,self.grid)) return 0; self.currPiece = Z_BLOCK; self.testPiece = self.currPiece; break;
		}
		return 1;
	}

	self.hold=function(){
	  var temp;
	  self.removeFromBoard();
	  temp = self.holdPiece;
	  self.holdPiece = self.currPiece;
	  self.currPiece = temp;
	  self.updateBoard();
	}

	self.collidesAt=function(xdisplacement,ydisplacement){
	  self.removeFromBoard();
	  for(var i=0;i<4;i++){
	    var x = self.testPiece.x[i] + self.xorigin + xdisplacement;
	    var y = self.testPiece.y[i] + self.yorigin + ydisplacement;
	    if(x < 0 || x > 9 || y < 0 || y > 21 || self.grid[x][y]) {
	    	self.testPiece = self.currPiece
	      self.updateBoard();
	      return 1;
	    }
	  }
	  //self.testPiece = self.currPiece
	  //self.updateBoard();
	  return 0;
	}

	self.try=function(action){ //{0:+rotate,1:-rotate,2:leftmove,3:rightmove,4:down}
	  switch(action){
	  case 0:
	    self.testPiece = self.rotate(self.testPiece,1);
	    if (!(self.collidesAt(0,0)))return 1;
	    else{return 0;}
	 
	  case 1:
	  	console.log(self.testPiece, self.currPiece);;
	    self.testPiece = self.rotate(self.testPiece,-1);
	    console.log(self.testPiece, self.currPiece);
	    if (!(self.collidesAt(0,0))) return 1;
	    else{return 0;}
	  
	  case 2:
	    if (!(self.collidesAt(-1,0))){ return 1;}
	    else{return 0;}

	  case 3:
	    if (!(self.collidesAt(1,0))) return 1;
	    else{return 0;}

	  case 4:
	    if(!(self.collidesAt(0,1))) return 1;
	    else{return 0;}
	  }
	}
	self.deleteRow=function(row){
	  for (var j = row-1; j > 2; j--) {
	    for (var i = 0; i < 10; i++) {
	      self.grid[i][j+1] = self.grid[i][j];
	    }
	  }
	}

	self.isDie=function(piece,grid){
		for(i=0;i<4;i++){
		    var x = piece.x[i] + self.xorigin;
		    var y = piece.y[i] + self.yorigin;
		    if(x < 0 || x > 9 || y < 0 || y > 21 || grid[x][y]) return 1;
		  }
	  return 0;
	}

	self.rotate=function(piece, i){
	  if (piece == O_BLOCK) return piece;
	  var j; 
	  if (i>0){  //clockwise rotation
	    for (j=0; j<4;j++){
	      var newX = piece.y[j];
	      var newY = piece.x[j] * (-1);
	      piece.x[j] = newX;
	      piece.y[j] = newY;
	    }
	  }
	  if (i<0){  //counterclockwise rotation
	    for (j=0; j<4;j++){
	      var newX = piece.y[j] * (-1);
	      var newY = piece.x[j];
	      piece.x[j] = newX;
	      piece.y[j] = newY;
	    }
	  }
	  return piece;
	}

	self.clearRows=function(){
	  var score = 0;
	  for (var j=21;j>2;j--){
	    var gap=0;
	    for (var i=0;i<10;i++){
	      if(!self.grid[i][j]){
			gap=1;
			break;
	      }
	    }
	    if(!gap){
	      deleteRow(j);
	      score++;
	      j++;
	    }
	  }
	  return pow(2,score-1);
	}

	self.keyPressed = function(){
		if(self.pressingUp && self.try(1)){
			console.log("up");
			//self.removeFromBoard();
			//self.currPiece = self.rotate(self.currPiece,-1);
			//self.updateBoard();
		}
	    if (self.pressingLeft && self.try(2)){
			console.log("left");
			self.removeFromBoard();
			self.xorigin-=1; 
			self.updateBoard();
	    }
	    return;
	    if (self.pressingRight && self.try(3)){
	    	console.log("right");
			self.removeFromBoard();
			self.xorigin+=1; 
			self.updateBoard();
			console.log("right");
	    }
	    return;
	    if (self.pressingDown && self.try(4)){
	    	console.log("down");
			self.removeFromBoard();
			self.yorigin+=1; 
			self.updateBoard();
	    }
	    return;
	    /*
	    while (try(4)){
		self.removeFromBoard();
		self.currPiece = dropDown(self.currPiece);
	      }
	      if (nextPiece()){
		P1_SCORE+= clearRows();
	      }
	      updateBoard();
	      break;
	      */
	}
	self.update = function(){
		self.testPiece = self.currPiece;
		if (self.dropDownTime <= 0){
			self.dropDownTime = 1;
			setTimeout(function(){
				//console.log(self.testPiece,self.currPiece);
				if (self.try(4)){
					self.removeFromBoard();
					self.yorigin++;
					self.updateBoard();
				}
				else{
					if(self.nextPiece()){
						self.updateBoard();
					}/*
					else{
						socket.emit("gameover",{
							player:self.id,
						})*/
					}				
				self.dropDownTime = 0;	},800);  //.8s drop down time
		}
	}
	self.getInitPack = function(){
		return {
			id:self.id,
			name:self.username,
			canvasDataURL:self.canvasDataURL,
			grid : self.grid,
			currPiece : self.currPiece,
			holdPiece : self.holdPiece,
			pieceQueue : [],
		};		
	}
	self.getUpdatePack = function(){
		return {
			id:self.id,
			name:self.username,
			canvasDataURL:self.canvasDataURL,
			grid : self.grid,
			currPiece : self.currPiece,
			holdPiece : self.holdPiece,
			pieceQueue : [],
		}	
	}
	
	self.initCurrPiece();
	self.updateBoard();
	console.log(self.grid);
	//printGrid();
	Player.list[self.id] = self;
	initPack.player.push(self.getInitPack());
	//console.log(Player.list[self.id]);
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
		//console.log("press");
		if(data.inputId === 'left')
			player.pressingLeft = data.state; 
		else if(data.inputId === 'right')
			player.pressingRight = data.state;
		else if(data.inputId === 'up')
			player.pressingUp = data.state;
		else if(data.inputId === 'down')				 //harddrop, softdrop, save
			player.pressingDown = data.state;
		player.keyPressed();
	});
	socket.on('selfPack',function(data){
		player.canvasDataURL = data.playerDataURL;
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
	//console.log(player,player.getInitPack());
	socket.emit('init',{
		selfId:socket.id,
		player:Player.getAllInitPack(),
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