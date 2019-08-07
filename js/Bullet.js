//STUB!

/*Bullet = (function(win, doc) { //@todo how does this work into the game file?

	function Bullet() {
		this.image = "images/bullet-vertical.png"
		this.x = 0;
		this.y = 0;
	}

	Bullet.prototype = {

	};

	return Bullet;

}(window, document));*/

class Bullet {
    constructor(image, x,y) {
        this.image ="images/bullet2.png"//"images/bullet-vertical.png"
        this.x = 0
        this.y = 0
    }
}
module.exports = Bullet