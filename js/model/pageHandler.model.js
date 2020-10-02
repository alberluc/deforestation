var PAGE_LEFT = {
    INDEX: 1,
    CLASS_CONTROL: "c-left",
    DIRECTION : {
        x: 1,
        y: 0
    }
};

var PAGE_RIGHT = {
    INDEX: 4,
    CLASS_CONTROL: "c-right",
    DIRECTION : {
        x: -1,
        y: 0
    }
};

var PAGE_TOP = {
    INDEX: 2,
    CLASS_CONTROL: "c-top",
    DIRECTION : {
        x: 0,
        y: 1
    }
};

var PAGE_BOTTOM = {
    INDEX: 3,
    CLASS_CONTROL: "c-bottom",
    DIRECTION : {
        x: 0,
        y: -1
    }
};

var CLASS_CONTROL_INDICATION = "c-indication";

var HandlerPage = function (homeParams) {
    this.titleEl = homeParams.titleEl;
    this.containerEl = homeParams.containerEl;
    this.subtitleEl = homeParams.subtitleEl;
    this.pageDatas = [];
    this.lastDirection = {x: 0, y: 0};
    this.titleTextEl = null;
};

HandlerPage.prototype.init = function () {
    this.loadHomeDatas();
    this.setIndicationControl(PAGE_LEFT.CLASS_CONTROL);

    document.addEventListener("pagePreShowed", this.onPagePreShowed.bind(this));
    document.addEventListener("pageShowed", this.onPageShowed.bind(this));
};

HandlerPage.prototype.onPagePreShowed = function (e) {
    var direction = e.detail.direction;
    var cumulateDirection = e.detail.cumulateDirection;
    if(cumulateDirection.x !== 0 || cumulateDirection.y !== 0) {
        if (direction.x === PAGE_LEFT.DIRECTION.x &&
            direction.y === PAGE_LEFT.DIRECTION.y) {
            this.setPage(PAGE_LEFT.INDEX);
            this.setIndicationControl(PAGE_TOP.CLASS_CONTROL);
        }
        if (direction.x === PAGE_BOTTOM.DIRECTION.x &&
            direction.y === PAGE_BOTTOM.DIRECTION.y) {
            this.setPage(PAGE_BOTTOM.INDEX);
            this.setIndicationControl(PAGE_RIGHT.CLASS_CONTROL);
        }
        if (direction.x === PAGE_TOP.DIRECTION.x &&
            direction.y === PAGE_TOP.DIRECTION.y) {
            this.setPage(PAGE_TOP.INDEX);
            this.setIndicationControl(PAGE_BOTTOM.CLASS_CONTROL);
        }
        if (direction.x === PAGE_RIGHT.DIRECTION.x &&
            direction.y === PAGE_RIGHT.DIRECTION.y) {
            this.setPage(PAGE_RIGHT.INDEX);
        }
    }
};

HandlerPage.prototype.onPageShowed = function (e) {
    var control = e.detail.control;
    if(control.el.classList.contains(PAGE_LEFT.CLASS_CONTROL)){
        this.animatePage(1);
    }
    else if(control.el.classList.contains(PAGE_TOP.CLASS_CONTROL)){
        this.animatePage(2);
    }
    else if(control.el.classList.contains(PAGE_BOTTOM.CLASS_CONTROL)){
        this.animatePage(3);
    }
    else if(control.el.classList.contains(PAGE_RIGHT.CLASS_CONTROL)){
        this.animatePage(4);
    }
};

HandlerPage.prototype.loadHomeDatas = function () {
    var req = new XMLHttpRequest();
    req.open("GET", "datas/home.json");
    req.addEventListener("readystatechange", this.datasLoadChangeState.bind(this, req));
    req.send();
};

HandlerPage.prototype.datasLoadChangeState = function (req) {
    if(req.readyState === 4){
        if(req.status === 200){
            this.datasLoaded(JSON.parse(req.responseText));
        }
        else{
            console.log(req);
        }
    }
};

HandlerPage.prototype.datasLoaded = function (datas) {
    this.pageDatas = datas;
    this.setPage(0);
    this.animatePage(0);
    var event = new CustomEvent("pageLoaded");
    document.dispatchEvent(event);
};

HandlerPage.prototype.setPage = function (index) {
    if(typeof this.pageDatas[index] !== "undefined") {
        this.resetPage(this.pageDatas[index].particules);
        this.subtitleEl.innerHTML = this.pageDatas[index].subtitle;
        this.containerEl.style.backgroundImage = "url(" + this.pageDatas[index].background + ")";
        for (var i = 0; i < this.pageDatas[index].parallax.length; i++) {
            var parallaxEl = document.createElement("img");
            parallaxEl.setAttribute("src", this.pageDatas[index].parallax[i].src);
            parallaxEl.setAttribute("data-parallax", this.pageDatas[index].parallax[i].x + "|" + this.pageDatas[i].parallax[i].y + "|" + this.pageDatas[i].parallax[i].transform + "|" + this.pageDatas[i].parallax[i].translate);
            parallaxEl.classList.add(this.pageDatas[index].parallax[i].class, "hp_parallax", "parallax");
            this.containerEl.appendChild(parallaxEl);
        }
        this.titleTextEl = document.createElement("span");
        TweenMax.set(this.titleEl, { opacity: 0 });
        this.titleTextEl.classList.add("pc_title-top", "pc_title_content");
        this.titleTextEl.innerHTML = this.pageDatas[index].title;
    }
};

HandlerPage.prototype.animatePage = function (index) {
    if(typeof this.pageDatas[index] !== "undefined") {
        this.startAnimate(this.titleTextEl, this.pageDatas[index]);
    }
}

HandlerPage.prototype.resetPage = function (particulesShow) {
    var parallax = document.querySelectorAll(".hp_parallax");
    for(var i = 0; i < parallax.length; i++){
        parallax[i].parentElement.removeChild(parallax[i]);
    }
    var canvasParticules = document.querySelector(".particules_container canvas");
    if(typeof particulesShow !== "undefined" && particulesShow === true){
        canvasParticules.style.display = "block";
    }
    else{
        canvasParticules.style.display = "none";
    }
};

HandlerPage.prototype.startAnimate = function (el, page) {
    var titleEl = document.querySelector(".pc_title");
    var animTitle = new AnimationLetterAppear({
        el: el,
        animationLetterDuration: 1.5,
        distanceAppear: 5,
        separatorsWordEnabled: page.separatorEnabled
    });
    animTitle.init();
    titleEl.innerHTML = "";
    titleEl.appendChild(animTitle.el);
    setTimeout((function () {
        animTitle.animate();
        TweenMax.set(this.titleEl, { opacity: 1 });
    }).bind(this), 100);
};

HandlerPage.prototype.setIndicationControl = function (className) {
    var controlsEl = document.querySelectorAll(".c-zoneAction");
    var controlIndication = document.querySelector("." + className);
    for(var i = 0; i < controlsEl.length; i++){
        controlsEl[i].classList.remove(CLASS_CONTROL_INDICATION);
    }
    controlIndication.classList.add(CLASS_CONTROL_INDICATION);
};