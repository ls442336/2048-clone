var app2048 = {
	elemTilesContainer: null,
	array_map: null,
	timestamp: null,
	loaded: false,
	garbage: document.createElement("div"),
	init: function(){
		var self = this;

		// basic config
		self.loaded = true;

		// get tiles container dom element
		self.elemTilesContainer = document.getElementsByClassName("tiles")[0];

		// initialize reference matrix
		self.array_map = [[null, null, null, null],
					 [null, null, null, null],
					 [null, null, null, null],
					 [null, null, null, null]];

		// set initial timestamp of animation guide
		self.timestamp = new Date().getTime();

		// add two tiles
		self.addNewTile();
		self.addNewTile();
	},
	addNewTile: function(){
		var self = this;
		var emptySlots = [];
		var numEmptySlots = 0;
		var slotPosition = null;
		var tileNamePosition = null;

		for(var i = 0; i < 4; i++){
			for(var j = 0; j < 4; j++){
				if(self.array_map[i][j] == null){
					emptySlots.push([i, j]);
				}
			}
		}

		numEmptySlots = emptySlots.length;

		if(numEmptySlots == 1)
			slotPosition = emptySlots[0];
		else
			slotPosition = emptySlots[Math.floor(Math.random() * numEmptySlots)];

		tileNamePosition = "tile-position-" + (slotPosition[0] + 1) + "-" + (slotPosition[1] + 1);

		var domNewTile = document.createElement("div");
		domNewTile.innerText = 2;
		domNewTile.classList.add("tile");
		domNewTile.classList.add("tile-new");
		domNewTile.classList.add("tile-2");
		domNewTile.classList.add(tileNamePosition);
		self.elemTilesContainer.appendChild(domNewTile);

		self.array_map[slotPosition[0]][slotPosition[1]] = domNewTile;
	},
	keyHandle: function(e){
		var self = this;

		if(e.keyCode == 38){ // up
			self.moveTiles("up");
		}else if(e.keyCode == 39){ // right
			self.moveTiles("right");
		}else if(e.keyCode == 40){ // down
			self.moveTiles("down");
		}else if(e.keyCode == 37){ // left
			self.moveTiles("left");
		}

	},
	emergeNewTile: function(a, b, n){
		var self = this;
		var tileNamePosition = null;
		var domNewTile = null;

		tileNamePosition = "tile-position-" + (a + 1) + "-" + (b + 1);

		var domNewTile = document.createElement("div");
		domNewTile.innerText = n;
		domNewTile.classList.add("tile");
		domNewTile.classList.add("tile-merge");
		domNewTile.classList.add("tile-"+n);
		domNewTile.classList.add(tileNamePosition);
		self.elemTilesContainer.appendChild(domNewTile);
		self.array_map[a][b] = domNewTile;
	},
	moveTo: function(a, b, c, d){
		var self = this;
		var fromPositionName = null;
		var toPositionName = null;
		var times = null;

		fromPositionName = "tile-position-" + (a + 1) + "-" + (b + 1);
		toPositionName = "tile-position-" + (c + 1) + "-" + (d + 1);
		self.array_map[a][b].classList.remove(fromPositionName);
		self.array_map[a][b].classList.add(toPositionName);

		if(self.array_map[c][d] != null){
			times = parseInt(self.array_map[a][b].innerText);
			times = times * 2;

			if(times == 2048){
				return false;
			}

			var m = self.array_map[a][b];
			var l = self.array_map[c][d];
			var x = c;
			var y = d;
			self.array_map[c][d] = "garbage";
				self.emergeNewTile(c, d, times);
			self.array_map[a][b].addEventListener("transitionend", function() {
				self.elemTilesContainer.removeChild(m);
				self.elemTilesContainer.removeChild(l);
			}, false);

			self.array_map[a][b] = null;
		}else{
			self.array_map[c][d] = self.array_map[a][b];
			self.array_map[a][b] = null;
		}
	},
	moveTiles: function(dir){
		var self = this;
		var xss = null;
		var aux = 0;
		var pos = [null, null];
		var movedAtLeastOne = false;
		var moved = false;

		if(dir == "up"){
			for(var i = 1; i < 4; i++){
				for(var j = 0; j < 4; j++){
					if(self.array_map[i][j] != null){
						xss = self.array_map[i][j];
					
						aux = i;
						moved = false;
						while(aux - 1 >= 0){
							if(self.array_map[aux - 1][j] == null){
								pos[0] = aux - 1;
								pos[1] = j;
								moved = true;
								movedAtLeastOne = true;
							}else if(parseInt(self.array_map[aux - 1][j].innerText) == parseInt(xss.innerText)){
								pos[0] = aux - 1;
								pos[1] = j;
								moved = true;
								movedAtLeastOne = true;
								break;
							}else break;
							aux = aux - 1;
						}
						if(moved){
							self.moveTo(i, j, pos[0], pos[1]);
						}
					}
				}
			}
		}else if(dir == "down"){
				for(var i = 2; i >= 0; i--){
					for(var j = 0; j < 4; j++){
						if(self.array_map[i][j] != null){
							xss = self.array_map[i][j];
						
							aux = i;
							moved = false;
							while(aux + 1 <= 3){
								if(self.array_map[aux + 1][j] == null){
									pos[0] = aux + 1;
									pos[1] = j;
									moved = true;
									movedAtLeastOne = true;
								}else if(parseInt(self.array_map[aux + 1][j].innerText) == parseInt(xss.innerText)){
									pos[0] = aux + 1;
									pos[1] = j;
									moved = true;
									movedAtLeastOne = true;
									break;
								}else break;
								aux = aux + 1;
							}
							if(moved){
								self.moveTo(i, j, pos[0], pos[1]);
							}
						}
					}
				}
		}else if(dir == "left"){
				for(var i = 0; i < 4; i++){
					for(var j = 1; j < 4; j++){
						if(self.array_map[i][j] != null){
							xss = self.array_map[i][j];
						
							aux = j;
							moved = false;
							while(aux - 1 >= 0){
								if(self.array_map[i][aux - 1] == null){
									pos[0] = i;
									pos[1] = aux - 1;
									moved = true;
									movedAtLeastOne = true;
								}else if(parseInt(self.array_map[i][aux - 1].innerText) == parseInt(xss.innerText)){
									pos[0] = i;
									pos[1] = aux - 1;
									moved = true;
									movedAtLeastOne = true;
									break;
								}else break;
								aux = aux - 1;
							}
							if(moved){
								self.moveTo(i, j, pos[0], pos[1]);
							}
						}
					}
				}
			}else if(dir == "right"){
				for(var i = 0; i < 4; i++){
					for(var j = 3; j >= 0; j--){
						if(self.array_map[i][j] != null){
							xss = self.array_map[i][j];
						
							aux = j;
							moved = false;
							pos[0] = i;
							pos[1] = j;
							while(aux + 1 <= 3){
								if(self.array_map[i][aux + 1] == null){
									pos[0] = i;
									pos[1] = aux + 1;
									moved = true;
									movedAtLeastOne = true;
								}else if(parseInt(self.array_map[i][aux + 1].innerText) == parseInt(xss.innerText)){
									pos[0] = i;
									pos[1] = aux + 1;
									moved = true;
									movedAtLeastOne = true;
									break;
								}else{
									break;
								}
								aux = aux + 1;
							}
							if(moved){
								self.moveTo(i, j, pos[0], pos[1]);
							}
						}
					}
				}
			}

		if(movedAtLeastOne){
			self.addNewTile();
		}
	}
};

window.addEventListener("load", function(){
	app2048.init();
}, false);

window.addEventListener("keydown", function(e){
	var keyCode = e.keyCode;
	if(keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40){
		e.preventDefault();
	}
	if(!app2048.loaded)
		return false;
	app2048.keyHandle(e);
}, false);
