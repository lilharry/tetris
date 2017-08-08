
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



I_BLOCK = function() { 
	this.type=1, 
	this.x=[-1, 0, 1, 2],
	this.y=[0, 0, 0, 0]}
J_BLOCK = function() { 
	this.type=2, 
	this.x=[-1, 0, 1, -1],
	this.y=[0, 0, 0, -1]}
L_BLOCK = function() { 
	this.type=3, 
	this.x=[-1, 0, 1, 1],
	this.y=[0, 0, 0, -1]}
O_BLOCK = function() { 
	this.type=4, 
	this.x=[0, 0, 1, 1],
	this.y=[-1, 0, -1, 0]}
S_BLOCK = function(){ 
	this.type=5, 
	this.x=[-1, 0, 0, 1],
	this.y=[0, 0, -1, -1]}
T_BLOCK = function() { 
	this.type=6, 
	this.x=[-1, 0, 1, 0],
	this.y=[0, 0, 0, -1]}
Z_BLOCK = function() { 
	this.type=7, 
	this.x=[-1, 0, 1, 0],
	this.y=[-1, -1, 0, 0]}

Player = function(param){
	var self = {
	id : param.id,
	grid : initGrid(),
	curr : 1,
	usedHold : 0,
	currPiece : new I_BLOCK(),
	xorigin: 5,
	yorigin: 2,
	testPiece : new I_BLOCK(),
	holdPiece : new I_BLOCK(),
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
			case 0: self.currPiece = new I_BLOCK(); self.testPiece = new I_BLOCK(); break;
			case 1: self.currPiece = new J_BLOCK(); self.testPiece = new J_BLOCK(); break;
			case 2: self.currPiece = new L_BLOCK(); self.testPiece = new L_BLOCK(); break; 
			case 3: self.currPiece = new O_BLOCK(); self.testPiece = new O_BLOCK(); break;
			case 4: self.currPiece = new S_BLOCK(); self.testPiece = new S_BLOCK(); break; 
			case 5: self.currPiece = new T_BLOCK(); self.testPiece = new T_BLOCK(); break;
			case 6: self.currPiece = new Z_BLOCK(); self.testPiece = new Z_BLOCK(); break;
		}
		switch (self.pieceQueue[self.curr-1]){
			case 0: self.holdPiece = new I_BLOCK(); break;
			case 1: self.holdPiece = new J_BLOCK(); break;
			case 2: self.holdPiece = new L_BLOCK(); break;
			case 3: self.holdPiece = new O_BLOCK(); break;
			case 4: self.holdPiece = new S_BLOCK(); break;
			case 5: self.holdPiece = new T_BLOCK(); break;
			case 6: self.holdPiece = new Z_BLOCK(); break;
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
			case 0: if(self.isDie(new I_BLOCK(),self.grid)) return 0; self.currPiece = new I_BLOCK(); self.testPiece = new I_BLOCK(); break;
			case 1: if(self.isDie(new J_BLOCK(),self.grid)) return 0; self.currPiece = new J_BLOCK(); self.testPiece = new J_BLOCK(); break;
			case 2: if(self.isDie(new L_BLOCK(),self.grid)) return 0; self.currPiece = new L_BLOCK(); self.testPiece = new L_BLOCK(); break;
			case 3: if(self.isDie(new O_BLOCK(),self.grid)) return 0; self.currPiece = new O_BLOCK(); self.testPiece = new O_BLOCK(); break;
			case 4: if(self.isDie(new S_BLOCK(),self.grid)) return 0; self.currPiece = new S_BLOCK(); self.testPiece = new S_BLOCK(); break;
			case 5: if(self.isDie(new T_BLOCK(),self.grid)) return 0; self.currPiece = new T_BLOCK(); self.testPiece = new T_BLOCK(); break;
			case 6: if(self.isDie(new Z_BLOCK(),self.grid)) return 0; self.currPiece = new Z_BLOCK(); self.testPiece = new Z_BLOCK(); break;
		}
		return 1;
	}
	self.copyPiece=function(piece1,piece2){
		piece1.type = piece2.type;
		piece1.x = piece2.x;
		piece1.y = piece2.y;
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
	  //self.removeFromBoard();
	  for(var i=0;i<4;i++){
	    var x = self.currPiece.x[i] + self.xorigin + xdisplacement;
	    var y = self.currPiece.y[i] + self.yorigin + ydisplacement;
	    if(x < 0 || x > 9 || y < 0 || y > 21 || self.grid[x][y]) {
	      //self.copyPiece(self.testPiece,self.currPiece);
	      //self.updateBoard();
	      return 1;
	    }
	  }
	  //self.copyPiece(self.testPiece,self.currPiece);
	  //self.updateBoard();
	  return 0;
	}

	self.try=function(action){ //{0:+rotate,1:-rotate,2:leftmove,3:rightmove,4:down}
		var ret = 0;
	  switch(action){
	  case 0:
	    self.testPiece = self.rotate(self.testPiece,1);
	    if (!(self.collidesAt(0,0)))return 1;
	    else{return 0;}
	 
	  case 1:
	  	self.removeFromBoard();
	  	self.rotate(self.currPiece,-1);
	  	if (!(self.collidesAt(0,0))) {
	  		ret=1;
	  	}
	  	else{
	  		self.rotate(self.currPiece,1);
	  	}
	  	//console.log(self.testPiece, self.currPiece);;
	    //self.testPiece = self.rotate(self.testPiece,-1);
	    //console.log(self.testPiece, self.currPiece);
	    //if (!(self.collidesAt(0,0))) return 1;
	  
	  case 2:
	  	self.removeFromBoard();
	    if (!(self.collidesAt(-1,0))) ret=1;

	  case 3:
	  	self.removeFromBoard();
	    if (!(self.collidesAt(1,0))) ret=1;

	  case 4:
	  	self.removeFromBoard();
	    if(!(self.collidesAt(0,1))) ret=1;
	  }
	  self.updateBoard();
	  return ret;
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
	  //if (piece == O_BLOCK) return piece;
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
	    if (self.pressingRight && self.try(3)){
	    	console.log("right");
			self.removeFromBoard();
			self.xorigin+=1; 
			self.updateBoard();
			console.log("right");
	    }
	    if (self.pressingDown && self.try(4)){
	    	console.log("down");
			self.removeFromBoard();
			self.yorigin+=1; 
			self.updateBoard();
	    }
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
		self.copyPiece(self.testPiece,self.currPiece);
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
	
	console.log(self);
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