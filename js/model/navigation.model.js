var Navigation = function (params) {
    this.parentEl = params.parentEl;
    this.centerPageEl = params.centerPageEl;
    this.transitionDuration = params.transitionDuration || 1000;
    this.positionsPages = params.positionsPages;
    this.Pages = {};
    this.cumulateDirection = {x: 0, y: 0};
    this.events = document.createElement("div");
    this.Controls = [];
    this.changingPage = false;

    this.disableScroll();
};

Navigation.prototype.init = function () {
    this.initOrigin();
    this.initPages();
    this.initControls();
    this.initEvents();
};

Navigation.prototype.initOrigin = function () {
    for(var i = 0; i < this.positionsPages.length; i++){
        for(var k = 0; k < this.positionsPages[i].length; k++){
            if(this.positionsPages[i][k] === this.centerPageEl){
                this.origin = {x: i, y: k};
            }
        }
    }
};

Navigation.prototype.initPages = function () {
    var i = 0;
    var k = 0;
    for(i; i < this.positionsPages.length; i++){
        for(k = 0; k < this.positionsPages[i].length; k++){
            if(typeof this.positionsPages[i][k] !== "undefined" && this.positionsPages[i][k] !== 0){
                this.Pages[i + "" + k] = {
                    x: k - this.origin.x,
                    y: i - this.origin.y,
                    el: this.positionsPages[i][k],
                    Controls: []
                };
                this.buildPage(this.Pages[i + "" + k]);
            }
        }
    }
    this.lengthX = k;
    this.lengthY = i;
};

Navigation.prototype.buildPage = function (Page) {
    Page.el.style.transform = "translate3d(" + Page.x * 100 + "%, " + Page.y * 100 + "%, 0)";
    setTimeout((function () {
        Page.el.style.transition = "transform " + this.transitionDuration + "ms";
    }).bind(this), 1);
};

Navigation.prototype.moveByDirection = function (direction) {
    this.cumulateDirection.x = this.cumulateDirection.x + direction.x;
    this.cumulateDirection.y = this.cumulateDirection.y + direction.y;
    for(var i in this.Pages){
        if(this.Pages.hasOwnProperty(i)) {
            var x = (this.Pages[i].x * 100) + (this.cumulateDirection.x * 100);
            var y = (this.Pages[i].y * 100) + (this.cumulateDirection.y * 100);
            this.Pages[i].el.style.transform = "translate3d(" + x + "%," + y + "%, 0)";
        }
    }
};

Navigation.prototype.disableScroll = function () {
    window.addEventListener("DOMMouseScroll", this.preventDefaultScroll, false);
    window.onmousewheel = document.onmousewheel = this.preventDefaultScroll;
    window.onwheel = this.preventDefaultScroll;
    window.ontouchmove = this.preventDefaultScroll;
    window.onkeydown = this.preventDefaultScrollKeys.bind(this);
};

Navigation.prototype.preventDefaultScroll = function(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
};

Navigation.prototype.preventDefaultScrollKeys = function(e) {
    var keys = {37: 1, 38: 1, 39: 1, 40: 1};
    if (keys[e.keyCode]) {
        this.preventDefault(e);
        return false;
    }
};

Navigation.prototype.initControls = function() {
    this.controlsIntoPages = [];
    var k;
    var i;
    for(k = this.origin.x; k > this.origin.x - this.lengthX / 2; k--){
        for(i = this.origin.y; i > this.origin.y - this.lengthY / 2; i--){
            this.initControl(k, i);
        }
    }
    for(k = this.origin.x; k < this.origin.x + this.lengthX / 2; k++){
        for(i = this.origin.y; i < this.origin.y + this.lengthY / 2; i++){
            this.initControl(k, i);
        }
    }
};

Navigation.prototype.initControl = function (k, i) {
    var control;
    if(typeof this.positionsPages[i][k] !== "undefined" && this.positionsPages[i][k] !== 0){
        if(
            typeof this.Pages[(i + -1) + "" + (k)] !== "undefined" &&
            typeof this.controlsIntoPages[i + "" + k + "" + (i + -1) + "" + (k)] === "undefined" &&
            typeof this.controlsIntoPages[(i + -1) + "" + (k) + "" + i + "" + k] === "undefined"
        ){
            control = new Control({
                parentEl: this.Pages[i + "" + k].el,
                positionX: 0,
                positionY: -1,
                events: this.events,
                index: "02",
                text: "Les habitants"
            });
            control.init();
            this.controlsIntoPages[i + "" + k + "" + (i + -1) + "" + (k)] = true;
            this.controlsIntoPages[(i + -1) + "" + (k) + "" + i + "" + k] = true;
            this.Controls.push(control);
        }
        if(
            typeof this.Pages[(i + 1) + "" + (k)] !== "undefined" &&
            typeof this.controlsIntoPages[i + "" + k + "" + (i + 1) + "" + (k)] === "undefined" &&
            typeof this.controlsIntoPages[(i + 1) + "" + (k) + "" + i + "" + k] === "undefined"
        ){
            control = new Control({
                parentEl: this.Pages[i + "" + k].el,
                positionX: 0,
                positionY: 1,
                events: this.events,
                index: "03",
                text: "Le désastre"
            });
            control.init();
            this.controlsIntoPages[i + "" + k + "" + (i + 1) + "" + (k)] = true;
            this.controlsIntoPages[(i + 1) + "" + (k) + "" + i + "" + k] = true;
            this.Controls.push(control);
        }
        if(
            typeof this.Pages[(i) + "" + (k - 1)] !== "undefined" &&
            typeof this.controlsIntoPages[i + "" + k + "" + (i) + "" + (k - 1)] === "undefined" &&
            typeof this.controlsIntoPages[(i) + "" + (k - 1) + "" + i + "" + k] === "undefined"
        ){
            control = new Control({
                parentEl: this.Pages[i + "" + k].el,
                positionX: -1,
                positionY: 0,
                events: this.events,
                index: "01",
                text: "La forêt"
            });
            control.init();
            this.controlsIntoPages[i + "" + k + "" + (i) + "" + (k - 1)] = true;
            this.controlsIntoPages[(i) + "" + (k - 1) + "" + i + "" + k] = true;
            this.Controls.push(control);
        }
        if(
            typeof this.Pages[(i) + "" + (k + 1)] !== "undefined" &&
            typeof this.controlsIntoPages[i + "" + k + "" + (i) + "" + (k + 1)] === "undefined" &&
            typeof this.controlsIntoPages[(i) + "" + (k + 1) + "" + i + "" + k] === "undefined"
        ){
            control = new Control({
                parentEl: this.Pages[i + "" + k].el,
                positionX: 1,
                positionY: 0,
                events: this.events,
                index: "04",
                text: "Causes"
            });
            control.init();
            this.controlsIntoPages[i + "" + k + "" + (i) + "" + (k + 1)] = true;
            this.controlsIntoPages[(i) + "" + (k + 1) + "" + i + "" + k] = true;
            this.Controls.push(control);
        }
    }
};

Navigation.prototype.initEvents = function () {
    this.events.addEventListener("zoneClick",(function (e) {
        var control = e.detail.control;
        var direction = e.detail.direction;
        if(!this.changingPage) {
            this.moveByDirection(direction);
            if(control.el.classList.contains("c-active")){
                control.destroyActiveState();
                control.el.classList.remove("c-active");
                control.el.classList.add("c-visited");
                this.changingPage = false;
                this.changingPage = false;
                setTimeout((function () {
                    var event = new CustomEvent("pageShowed", { detail : {
                        control: control
                    }});
                    document.dispatchEvent(event);
                }).bind(this), this.transitionDuration);
            }
            else{
                control.initActiveState();
                control.el.classList.add("c-active");
                setTimeout((function () {
                    var event = new CustomEvent("pagePreShowed", { detail : {
                        direction : direction,
                        cumulateDirection: this.cumulateDirection
                    }});
                    document.dispatchEvent(event);
                }).bind(this), this.transitionDuration);
            }
            this.changingPage = true;
            setTimeout((function () {
                this.changingPage = false;
            }).bind(this), this.transitionDuration);
        }
    }).bind(this));
};