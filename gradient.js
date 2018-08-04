function Colour() {
	this.val = function(hex) {
		return hex.replace(/^.{0}(.)$/g, "0$1");
	};
	this.randHex = function() {
		return this.val(Math.floor(Math.random()*256).toString(16));
	};
	
	if(arguments.length === 1) {
		this.hex = arguments[0];
		if(this.hex.length !== 7) {
			this.hex = this.hex.replace(/#(.)(.)(.)/g, "#$1$1$2$2$3$3");
		}
		this.r = parseInt(this.hex.substring(1,3), 16);
		this.g = parseInt(this.hex.substring(3,5), 16);
		this.b = parseInt(this.hex.substring(5,7), 16);
	} else {
		this.r = Math.floor(arguments[0]);
		this.g = Math.floor(arguments[1]);
		this.b = Math.floor(arguments[2]);
		this.hex = "#" + this.val(this.r.toString(16)) + this.val(this.g.toString(16)) + this.val(this.b.toString(16));
	}
}
Colour.prototype.randomise = function() {
	return "#" + this.randHex() + this.randHex() + this.randHex();
};

(function(){
	var textGradient = angular
		.module('textGradient',[])
		.controller('HostController',HostController)
		.directive('splitArray',ArraySplitDirective);
	
	HostController.$inject = ['$scope'];
	function HostController($scope){
		
		var host = this;
		host.start = "#";
		host.end = "#";
		host.input = "Competition Name";
		host.preview = [];
		host.output = "";
		
		host.process = function() {
			var letters = [];
			host.output = "";
			
			var start = new Colour(host.start);
			var end = new Colour(host.end);
			
			var r = start.r;
			var g = start.g;
			var b = start.b;
			
			var delta_r = end.r - start.r;
			var delta_g = end.g - start.g;
			var delta_b = end.b - start.b;
			
			var change_r_per = delta_r / (host.input.length);
			var change_g_per = delta_g / (host.input.length);
			var change_b_per = delta_b / (host.input.length);
			
			for(let l = 0; l < host.input.length; l++) {
				letters[l] = ({letter: host.input.substring(l, l+1), colour: new Colour(r,g,b).hex});
				r += change_r_per;
				g += change_g_per;
				b += change_b_per;
				host.output += "[color=" + letters[l].colour +"]" + letters[l].letter + "[/color]";
			}
			host.preview = letters;
		};
		
		host.randomise = function() {
			host.start = new Colour(host.start).randomise();
			host.end = new Colour(host.end).randomise();
			host.process();
		};
		
		host.randomise();
		
		function randHex() {
			return Math.floor(Math.random()*256).toString(16);
		}
	}
	
	// TODO fix
	function ArraySplitDirective() {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attr, ngModel) {
				function fromUser(text) {
					return text.split("\n");
				}
				function toUser(array) {
					return array.join("\n");
				}
				ngModel.$parsers.push(fromUser);
				ngModel.$formatters.push(toUser);
			}
		};
	}
})();