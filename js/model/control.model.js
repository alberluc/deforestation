/**
 * Created by Lucien on 22/11/2017.
 */

var Control = function (params) {
    this.parentEl = params.parentEl;
    this.x = params.positionX;
    this.y = params.positionY;
    this.events = params.events;
    this.index = params.index;
    this.text = params.text;
    this.el = this.buildElement();
    this.clientCursor = {x: 0, y: 0};
    this.clientDocument = {x: 0, y: 0};
    this.distApproach = 150;
    this.TimelineAnimation = null;
    this.animating = false;
    this.backButtonAnimating = false;
    this.zoom = "1.15";

    this.el.addEventListener("mousemove", this.onMouseMoveCursor.bind(this));
    document.addEventListener("mousemove", this.onMouseMoveDocument.bind(this));
};

Control.prototype.buildElement = function () {
    var el = document.createElement("div");
    el.classList.add("c-zoneAction");
    this.parentEl.appendChild(el);
    setTimeout(function () {
        el.style.transition = "transform 1s, border-color 1s";
    }, 10);
    return el;
};

Control.prototype.init = function () {
    this.initPosition();
    this.initEvents();
    this.buildNumberElement();
    this.buildTitle();
    this.buildZoneHover();
    this.buildBackButton();
};

Control.prototype.initPosition = function () {
    if(this.x === 0 && this.y === -1){
        this.el.style.left = "50%";
        this.el.style.top = "calc(0% - " + this.el.offsetHeight /2 + "px)";
        this.el.style.transform = "translate(-50%, -0%)";
        this.el.style.transform = "translate3d(-50%, -0%, 0)";
        this.transformPosition = {
            x: -50,
            y: -0
        };
        this.el.classList.add("c-top");
    }
    if(this.x === 0 && this.y === 1){
        this.el.style.left = "50%";
        this.el.style.top = "calc(100% + " + this.el.offsetHeight /2 + "px)";
        this.el.style.transform = "translate3d(-50%, -100%, 0)";
        this.transformPosition = {
            x: -50,
            y: -100
        };
        this.el.classList.add("c-bottom");
    }
    if(this.x === -1 && this.y === 0){
        this.el.style.left = "calc(0% - " + this.el.offsetWidth /2 + "px)";
        this.el.style.top = "50%";
        this.el.style.transform = "translate(-0%, -50%)";
        this.el.style.transform = "translate3d(-0%, -50%, 0)";
        this.transformPosition = {
            x: -0,
            y: -50
        };
        this.el.classList.add("c-left");
    }
    if(this.x === 1 && this.y === 0){
        this.el.style.left = "calc(100% + " + this.el.offsetWidth /2 + "px)";
        this.el.style.top = "50%";
        this.el.style.transform = "translate(-100%, -50%)";
        this.el.style.transform = "translate3d(-100%, -50%, 0)";
        this.transformPosition = {
            x: -100,
            y: -50
        };
        this.el.classList.add("c-right");
    }
};

Control.prototype.initEvents = function () {
    this.el.addEventListener("click", this.onClick.bind(this));
};

Control.prototype.buildNumberElement = function () {
    this.numberEl = document.createElement("div");
    this.numberEl.classList.add("c-numberIndex");
    this.numberEl.innerText = this.index;
    this.positionToCursor(this.numberEl, 40);
    this.el.appendChild(this.numberEl);
};

Control.prototype.buildTitle = function () {
    this.titleEl = document.createElement("div");
    this.titleEl.classList.add("c-title");
    this.titleEl.innerText = this.text;
    this.positionToCursor(this.titleEl, 10);
    this.el.appendChild(this.titleEl);
};

Control.prototype.buildZoneHover = function () {
    this.zoneHoverEl = document.createElement("div");
    this.zoneHoverEl.classList.add("c-zoneHover");
    this.el.appendChild(this.zoneHoverEl);
};

Control.prototype.onClick = function () {
    var direction = this.getDirection(this.clientCursor, this.el);
    if(direction !== null) {
        this.events.dispatchEvent(new CustomEvent("zoneClick", {
            detail: {
                direction: {
                    x: -direction.x,
                    y: -direction.y
                },
                control: this
            }
        }));
    }
};

Control.prototype.onMouseMoveCursor = function (e) {
    this.clientCursor.x = e.clientX;
    this.clientCursor.y = e.clientY;
};

Control.prototype.onMouseMoveDocument = function (e) {
    this.clientDocument.x = e.clientX;
    this.clientDocument.y = e.clientY;
    this.handleApproach();
};

Control.prototype.handleApproach = function () {
    if(!this.el.classList.contains("c-active")) {
        if (this.verifyApproach(this.clientDocument, this.el) && this.TimelineAnimation === null) {
            this.animating = true;
            this.setTransformApproach(this.el, this.distApproach, 10);
            this.startAnimationApproach();
        }
        else if (this.TimelineAnimation !== null && !this.verifyApproach(this.clientDocument, this.el) && !this.animating) {
            this.el.style.transform = "translate(" + this.transformPosition.x + "%, " + this.transformPosition.y + "%)";
            this.el.style.transform = "translate3d(" + this.transformPosition.x + "%, " + this.transformPosition.y + "%, 0)";
            this.reverseAnimationApproach();
            this.TimelineAnimation = null;
            this.el.classList.remove("c-clientHover");
        }
    }
    else{
        if (!this.backButtonAnimating && this.verifyApproach(this.clientDocument, this.el)) {
            this.backButtonAnimating = true;
            this.moveBackButton();
        }
        else if(this.backButtonAnimating && !this.verifyApproach(this.clientDocument, this.el)){
            this.backButtonAnimating = false;
            TweenMax.to(this.backButtonEl, 0.3, {x: 0, y: 0});
        }
    }
};

Control.prototype.getDirection = function (point, el) {
    var elementOrigin = {
        x: el.getBoundingClientRect().left,
        y: el.getBoundingClientRect().top
    };
    if(point.x < (elementOrigin.x + el.offsetWidth / 2) && point.y < (elementOrigin.y + el.offsetHeight / 2)){
        if(el.classList.contains("c-bottom") && !el.classList.contains("c-active")){ return {x: 0, y: 1}; }
        if(el.classList.contains("c-top") && el.classList.contains("c-active")){ return {x: 0, y: 1}; }
        if(el.classList.contains("c-left") && el.classList.contains("c-active")){ return {x: 1, y: 0}; }
        if(el.classList.contains("c-right") && !el.classList.contains("c-active")){ return {x: 1, y: 0}; }
    }
    if(point.x < (elementOrigin.x + el.offsetWidth / 2) && point.y > (elementOrigin.y + el.offsetHeight / 2)){
        if(el.classList.contains("c-bottom") && el.classList.contains("c-active")){ return {x: 0, y: -1}; }
        if(el.classList.contains("c-top") && !el.classList.contains("c-active")){ return {x: 0, y: -1}; }
        if(el.classList.contains("c-left") && el.classList.contains("c-active")){ return {x: 1, y: 0}; }
        if(el.classList.contains("c-right") && !el.classList.contains("c-active")){ return {x: 1, y: 0}; }
    }
    if(point.x > (elementOrigin.x + el.offsetWidth / 2) && point.y < (elementOrigin.y + el.offsetHeight / 2)){
        if(el.classList.contains("c-bottom") && !el.classList.contains("c-active")){ return {x: 0, y: 1}; }
        if(el.classList.contains("c-top") && el.classList.contains("c-active")){ return {x: 0, y: 1}; }
        if(el.classList.contains("c-left") && !el.classList.contains("c-active")){ return {x: -1, y: 0}; }
        if(el.classList.contains("c-right") && el.classList.contains("c-active")){ return {x: -1, y: 0}; }
    }
    if(point.x > (elementOrigin.x + el.offsetWidth / 2) && point.y > (elementOrigin.y + el.offsetHeight / 2)){
        if(el.classList.contains("c-bottom") && el.classList.contains("c-active")){ return {x: 0, y: -1}; }
        if(el.classList.contains("c-top") && !el.classList.contains("c-active")){ return {x: 0, y: -1}; }
        if(el.classList.contains("c-left") && !el.classList.contains("c-active")){ return {x: -1, y: 0}; }
        if(el.classList.contains("c-right") && el.classList.contains("c-active")){ return {x: -1, y: 0}; }
    }
    return null;
};

Control.prototype.verifyApproach = function (point, el) {
    var elementOrigin = {
        x: el.getBoundingClientRect().left,
        y: el.getBoundingClientRect().top
    };
    if(point.x > elementOrigin.x - this.distApproach &&
        point.y > elementOrigin.y - this.distApproach &&
        point.x < (elementOrigin.x + el.offsetWidth) + this.distApproach &&
        point.y < (elementOrigin.y + el.offsetHeight) + this.distApproach
    ){
        return true;
    }
    return false;
};

Control.prototype.setTransformApproach = function (el, margin, dist) {
    var elementOrigin = {
        x: el.getBoundingClientRect().left,
        y: el.getBoundingClientRect().top
    };
    if(el.classList.contains("c-top")){
        this.el.style.transform = "translate(" + this.transformPosition.x + "%, calc(" + this.transformPosition.y + "% + " + dist + "px)) scale(" + this.zoom + ")";
        this.el.style.transform = "translate3d(" + this.transformPosition.x + "%, calc(" + this.transformPosition.y + "% + " + dist + "px)) scale(" + this.zoom + ")";
    }
    if(el.classList.contains("c-bottom")){
        this.el.style.transform = "translate(" + this.transformPosition.x + "%, calc(" + this.transformPosition.y + "% - " + dist + "px)) scale(" + this.zoom + ")";
        this.el.style.transform = "translate3d(" + this.transformPosition.x + "%, calc(" + this.transformPosition.y + "% - " + dist + "px)) scale(" + this.zoom + ")";
    }
    if(el.classList.contains("c-left")){
        this.el.style.transform = "translate(calc(" + this.transformPosition.x + "% + " + dist + "px), " + this.transformPosition.y + "%) scale(" + this.zoom + ")";
        this.el.style.transform = "translate3d(calc(" + this.transformPosition.x + "% + " + dist + "px), " + this.transformPosition.y + "%) scale(" + this.zoom + ")";
    }
    if(el.classList.contains("c-right")){
        this.el.style.transform = "translate(calc(" + this.transformPosition.x + "% - " + dist + "px), " + this.transformPosition.y + "%) scale(" + this.zoom + ")";
        this.el.style.transform = "translate3d(calc(" + this.transformPosition.x + "% - " + dist + "px), " + this.transformPosition.y + "%) scale(" + this.zoom + ")";
    }
    el.classList.add("c-clientHover");
};

Control.prototype.positionToCursor = function (el, margin) {
    if(this.el.classList.contains("c-bottom")){
        el.style.left = "50%";
        el.style.top = "-" + margin + "px";
        el.transition = {
            x: -50,
            y: 0
        };
        el.style.transform = "translate(-50%, 0)";
        el.style.transform = "translate3d(-50%, 0, 0)";
    }
    if(this.el.classList.contains("c-top")){
        el.style.left = "50%";
        el.style.bottom = "-" + margin + "px";
        el.transition = {
            x: -50,
            y: 0
        };
        el.style.transform = "translate(-50%, 0)";
        el.style.transform = "translate3d(-50%, 0, 0)";
    }
    if(this.el.classList.contains("c-left")){
        el.style.right = "-" + margin + "px";
        el.style.top = "50%";
        el.transition = {
            x: 0,
            y: -50
        };
        el.style.transform = "translate(0, -50%)";
        el.style.transform = "translate3d(0, -50%, 0)";
    }
    if(this.el.classList.contains("c-right")){
        el.style.left = "-" + margin + "px";
        el.style.top = "50%";
        el.transition = {
            x: 0,
            y: -50
        };
        el.style.transform = "translate(0, -50%)";
        el.style.transform = "translate3d(0, -50%, 0)";
    }
};

Control.prototype.moveBackButton = function() {
    if(this.el.classList.contains("c-top")){
        TweenMax.to(this.backButtonEl, 0.3, {y: -3, onComplete: (function () {
            TweenMax.to(this.backButtonEl, 0.3, {y: 3, repeat: -1, yoyo: true, ease: Power1.easeOut});
        }).bind(this)});
    }
    if(this.el.classList.contains("c-bottom")){
        TweenMax.to(this.backButtonEl, 0.3, {y: 3, onComplete: (function () {
            TweenMax.to(this.backButtonEl, 0.3, {y: -3, repeat: -1, yoyo: true, ease: Power1.easeOut});
        }).bind(this)});
    }
    if(this.el.classList.contains("c-left")){
        TweenMax.to(this.backButtonEl, 0.3, {x: -3, onComplete: (function () {
            TweenMax.to(this.backButtonEl, 0.3, {x: 3, repeat: -1, yoyo: true, ease: Power1.easeOut});
        }).bind(this)});
    }
    if(this.el.classList.contains("c-right")){
        TweenMax.to(this.backButtonEl, 0.3, {x: 3, onComplete: (function () {
            TweenMax.to(this.backButtonEl, 0.3, {x: -3, repeat: -1, yoyo: true, ease: Power1.easeOut});
        }).bind(this)});
    }
};

Control.prototype.startAnimationApproach = function () {
    this.TimelineAnimation = new TimelineMax({ onComplete: this.completeAnimationApproach.bind(this) });
    this.moveAnimationApproachNumber(30, 55);
    this.moveAnimationApproachTitle(0, this.TimelineAnimation, 1, "-=0.5");
    TweenMax.to(this.zoneHoverEl, 0.5, {opacity: 1});
};

Control.prototype.reverseAnimationApproach = function () {
    var Timeline = new TimelineMax();
    this.moveAnimationApproachTitle(60, Timeline, 0);
    Timeline.to(this.numberEl, 0.5, {
        x: this.numberEl.transition.x + "%",
        y: this.numberEl.transition.y + "%"
    }, "-=0.5");
    Timeline.set(this.titleEl, {
        x: this.numberEl.transition.x + "%",
        y: this.numberEl.transition.y + "%"
    });
    TweenMax.to(this.zoneHoverEl, 0.5, {opacity: 0});
};

Control.prototype.moveAnimationApproachNumber = function (distNumberDispear, distNumberAppear) {
    if(this.el.classList.contains("c-bottom")){
        this.TimelineAnimation.to(this.numberEl, 0.5, {
            x: this.numberEl.transition.x + "%",
            y: -distNumberDispear,
            opacity: 0
        });
        this.TimelineAnimation.set(this.numberEl, {
            x: this.numberEl.transition.x + "%",
            y: distNumberAppear + 30
        });
        this.TimelineAnimation.to(this.numberEl, 0.5, {
            x: this.numberEl.transition.x + "%",
            y: distNumberAppear,
            opacity: 1
        });
    }
    if(this.el.classList.contains("c-top")){
        this.TimelineAnimation.to(this.numberEl, 0.5, {
            x: this.numberEl.transition.x + "%",
            y: distNumberDispear,
            opacity: 0
        });
        this.TimelineAnimation.set(this.numberEl, {
            x: this.numberEl.transition.x + "%",
            y: -distNumberAppear - 30
        });
        this.TimelineAnimation.to(this.numberEl, 0.5, {
            x: this.numberEl.transition.x + "%",
            y: -distNumberAppear,
            opacity: 1
        });
    }
    if(this.el.classList.contains("c-left")){
        this.TimelineAnimation.to(this.numberEl, 0.5, {
            x: distNumberDispear,
            y: this.numberEl.transition.y + "%",
            opacity: 0
        });
        this.TimelineAnimation.set(this.numberEl, {
            x: -distNumberAppear - 30,
            y: this.numberEl.transition.y + "%"
        });
        this.TimelineAnimation.to(this.numberEl, 0.5, {
            x: -distNumberAppear,
            y: this.numberEl.transition.y + "%",
            opacity: 1
        });
    }
    if(this.el.classList.contains("c-right")){
        this.TimelineAnimation.to(this.numberEl, 0.5, {
            x: -distNumberDispear,
            y: this.numberEl.transition.y + "%",
            opacity: 0
        });
        this.TimelineAnimation.set(this.numberEl, {
            x: distNumberAppear + 30,
            y: this.numberEl.transition.y + "%"
        });
        this.TimelineAnimation.to(this.numberEl, 0.5, {
            x: distNumberAppear,
            y: this.numberEl.transition.y + "%",
            opacity: 1
        });
    }
};

Control.prototype.moveAnimationApproachTitle = function (distTitleAppear, Timeline, opacity, delay) {
    if(this.el.classList.contains("c-bottom")){
        Timeline.to(this.titleEl, 0.5, {
            x: this.titleEl.transition.x + "%",
            y: - distTitleAppear - this.titleEl.offsetHeight,
            opacity: opacity
        }, delay);
    }
    if(this.el.classList.contains("c-top")){
        Timeline.to(this.titleEl, 0.5, {
            x: this.titleEl.transition.x + "%",
            y: distTitleAppear + this.titleEl.offsetHeight,
            opacity: opacity
        }, delay);
    }
    if(this.el.classList.contains("c-left")){
        Timeline.to(this.titleEl, 0.5, {
            x: distTitleAppear + this.titleEl.offsetWidth,
            y: this.titleEl.transition.y + "%",
            opacity: opacity
        }, delay);
    }
    if(this.el.classList.contains("c-right")){
        Timeline.to(this.titleEl, 0.5, {
            x: - distTitleAppear - this.titleEl.offsetWidth,
            y: this.titleEl.transition.y + "%",
            opacity: opacity
        }, delay);
    }
};

Control.prototype.completeAnimationApproach = function () {
    this.animating = false;
    this.handleApproach();
};

Control.prototype.buildBackButton = function () {
    this.backButtonEl = document.createElement("div");
    this.backButtonEl.classList.add("c-back");
    this.backButtonEl.style.opacity = "0";
    this.el.appendChild(this.backButtonEl);
};

Control.prototype.initActiveState = function () {
    this.setTransformApproach(this.el, 0, -10);
    this.backButtonEl.style.opacity = "1";
};

Control.prototype.destroyActiveState = function () {
    this.backButtonEl.style.opacity = "0";
};