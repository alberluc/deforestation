var LEGEND_HIDE_RATIO = 40;
var LEGEND_SHOW_RATIO = 35;
var CLASS_ITEM_ACTIVE = "c-item-active";

var Cursor = function (params) {
    this.el = params.el;
    this.startOrigin = params.startOrigin;
    this.positionItems = [];
    this.circleCoords = [];
    this.buttonPositionIndex = 0;
    this.parentEl = params.parent;
    this.items = params.items;
    this.legendEl = params.legend;
    this.arrayItemsEl = [];
    this.client = {
        click: false,
        x: 0,
        y: 0
    };
};

Cursor.prototype.init = function () {
    this.build();
    this.setCircleCoords();
    this.initPositions();
    this.setLegend(this.items[0]);
    this.buildItemsLegend();
    this.setCurrentActiveItem(this.arrayItemsEl, 0, CLASS_ITEM_ACTIVE);
    this.moveLegendItem(0, LEGEND_SHOW_RATIO);

    this.buttonEl.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
    document.addEventListener("mousemove", this.onButtonMove.bind(this));
    this.el.addEventListener("mouseenter", this.enterInCursorZone.bind(this));
    this.stopPropagationEl.addEventListener("mouseleave", this.enterInCursorZone.bind(this));
    this.stopPropagationEl.addEventListener("mousemove", this.onStopPropagationMove.bind(this));

    for(var i = 0; i < this.arrayItemsEl.length; i++){
        this.arrayItemsEl[i].addEventListener("mouseenter", this.onItemMouseEnter.bind(this, i));
        this.arrayItemsEl[i].addEventListener("mouseout", this.onItemMouseOut.bind(this, i));
    }
};

Cursor.prototype.build = function () {
    this.buildItems();
    this.buildButton();
    if(typeof this.legendEl === "undefined"){ this.buildLegend(); }
    this.buildParcours();
    this.buildStopPropagation();
};

Cursor.prototype.buildButton = function () {
    this.buttonEl = document.createElement("div");
    this.buttonEl.classList.add("cursor_button");
    this.itemsEl.appendChild(this.buttonEl);
};

Cursor.prototype.buildItems = function () {
    this.itemsEl = document.createElement("div");
    this.itemsEl.classList.add("cursor_items");
    for(var i = 0; i < this.items.length; i++){
        var itemEl = document.createElement("div");
        itemEl.classList.add("cursor_item");
        itemEl.addEventListener("click", this.onItemClick.bind(this, i));
        this.itemsEl.appendChild(itemEl);
        this.arrayItemsEl.push(itemEl);
    }
    this.el.appendChild(this.itemsEl);
};

Cursor.prototype.buildLegend = function () {
    this.legendEl = document.createElement("div");
    this.legendEl.classList.add("cursor_legend");
    this.el.appendChild(this.legendEl);
};

Cursor.prototype.buildStopPropagation = function () {
    this.stopPropagationEl = document.createElement("div");
    this.stopPropagationEl.classList.add("cursor_stopPropagation");
    //this.el.appendChild(this.stopPropagationEl);
};

Cursor.prototype.buildParcours = function () {
    this.parcoursEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.parcoursEl.classList.add("cursor_parcours");
    this.parcoursEl.setAttributeNS(null, "width", this.el.offsetWidth);
    this.parcoursEl.setAttributeNS(null, "height", this.el.offsetHeight);
    var r = this.itemsEl.offsetWidth /2;
    this.parcoursTotalSize = 2 * r * Math.PI;
    this.parcoursEl.innerHTML = "<circle stroke-dasharray='" + this.parcoursTotalSize + "' stroke-dashoffset='" + this.parcoursTotalSize + "' cx='"+this.el.offsetWidth/2+"' cy='"+this.el.offsetHeight/2+"' r='"+r+"'></circle>";
    this.el.appendChild(this.parcoursEl);
};

Cursor.prototype.initPositions = function () {
    this.initPositionItems();
    this.initPositionCursor();
};

Cursor.prototype.initPositionItems = function () {
    var itemsEl = this.itemsEl.querySelectorAll(".cursor_item");
    var angle = 360 / this.items.length;
    for(var i = 0; i < itemsEl.length; i++){
        var X = (this.itemsEl.offsetWidth / 2) * Math.cos((i * angle * Math.PI / 180) - this.startOrigin);
        var Y = (this.itemsEl.offsetHeight / 2) * Math.sin((i * angle * Math.PI / 180) - this.startOrigin);
        this.positionItems[i * angle] = {x: X, y: Y, index: i};
        itemsEl[i].style.transform = "translate3d(" + this.circleCoords[i * angle].x + "px," + this.circleCoords[i * angle].y + "px, 0)"
    }
};

Cursor.prototype.initPositionCursor = function () {
    this.buttonEl.style.transform = "translate3d(" + this.positionItems[0].x + "px, " + this.positionItems[0].y + "px, 0)";
};

Cursor.prototype.setCurrentActiveItem = function (listElement, index, classNameActive) {
    for(var i = 0; i < listElement.length; i++){
        if(i === index){
            listElement[i].classList.add(classNameActive);
        }
        else{
            listElement[i].classList.remove(classNameActive);
        }
    }
};

Cursor.prototype.setLegend = function (text) {
    this.legendEl.innerText = text;
};

Cursor.prototype.buildItemsLegend = function () {
    for(var i = 0; i < this.arrayItemsEl.length; i++){
        this.arrayItemsEl[i].legendEl = document.createElement("span");
        this.arrayItemsEl[i].legendEl.classList.add("cursor_items_legend");
        this.arrayItemsEl[i].legendEl.innerHTML = this.items[i];
        this.arrayItemsEl[i].appendChild(this.arrayItemsEl[i].legendEl);
        this.moveLegendItem(i, LEGEND_HIDE_RATIO);
    }
};

Cursor.prototype.getLegendDist = function (itemPosition, ratio) {
    var dist = {
      x: Math.round(itemPosition.x) / (this.el.offsetWidth / 2) * ratio,
      y: Math.round(itemPosition.y) / (this.el.offsetHeight / 2) * ratio
    };
    return dist;
};

Cursor.prototype.onMouseDown = function () {
    if(!this.client.click) {
        this.client.click = true;
        document.body.style.cursor = "move";
        this.client.xAtClick = this.client.x;
        this.client.yAtClick = this.client.y;
        for (var i = 0; i < this.arrayItemsEl.length; i++) {
            this.moveLegendItem(i, LEGEND_SHOW_RATIO);
        }
    }
};

Cursor.prototype.onMouseUp = function () {
    if(this.client.click){
        this.client.click = false;
        document.body.style.cursor = "initial";
        var closestItemPosition = this.getClosestItemPosition();
        var nextPositionIndex;
        for(var k in this.positionItems){
            if(this.positionItems[k].index === closestItemPosition.index){
                nextPositionIndex = k;
            }
        }
        this.changePositionButton(parseInt(this.buttonPositionIndex), parseInt(nextPositionIndex), closestItemPosition.inverse, this.items[closestItemPosition.index]);
        for(var i = 0; i < this.arrayItemsEl.length; i++){
            this.moveLegendItem(i, LEGEND_HIDE_RATIO);
        }
    }
};

Cursor.prototype.onButtonMove = function (e) {
    var circleXCenter = this.el.getBoundingClientRect().left + (this.el.offsetWidth / 2);
    var circleYCenter = this.el.getBoundingClientRect().top + (this.el.offsetHeight / 2);
    this.client.x = e.clientX - circleXCenter;
    this.client.y = e.clientY - circleYCenter;
    if(this.client.click){
        var dist = null;
        this.client.index = 0;
        for(var i = 0; i < this.circleCoords.length; i++){
            var distX = Math.abs(this.client.x - this.circleCoords[i].x);
            var distY = Math.abs(this.client.y - this.circleCoords[i].y);
            var tmpdist = distX + distY;
            if(tmpdist <= dist || dist === null){
                dist = tmpdist;
                this.client.index = i;
                this.client.distx = distX;
                this.client.disty = distY;
            }
        }
        this.moveButton(this.circleCoords[this.client.index].x, this.circleCoords[this.client.index].y, this.client.index);
        this.buttonPositionIndex = this.client.index;
        this.setClosetActiveElement();
    }
};

Cursor.prototype.moveButton = function (x, y, index) {
    this.buttonEl.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
    var sizeParcours = this.parcoursTotalSize * index / this.circleCoords.length;
    this.changeSizeParcours(sizeParcours);
};

Cursor.prototype.onStopPropagationMove = function (e) {
    e.stopPropagation();
};

Cursor.prototype.setCircleCoords = function (e) {
    for(var i = 0; i <= 360; i++){
        this.circleCoords[i] = {
            x: (this.itemsEl.offsetWidth / 2) * Math.cos((i * Math.PI / 180) - this.startOrigin),
            y: (this.itemsEl.offsetWidth / 2) * Math.sin((i * Math.PI / 180) - this.startOrigin)
        };
    }
};

Cursor.prototype.getClosestItemPosition = function() {
    var arr = [];
    var k;
    for(k in this.positionItems){
        arr.push(k);
    }
    arr.push(360);
    var closest = this.calcClosest(arr, parseInt(this.client.index));
    var cpt = 0;
    if(closest.value === 360){
        closest.value = 0;
        closest.index = 0;
        closest.inverse = true;
    }
    else{
        for(k in this.positionItems){
            if(k === closest.value){
                closest.index = cpt;
            }
            cpt ++;
        }
        closest.inverse = false;
    }
    return closest;
};

Cursor.prototype.calcClosest = function(arr, target) {
    if (!(arr) || arr.length === 0)
        return null;
    if (arr.length === 1)
        return {value: arr[0], index: 0};
    for (var i=1; i<arr.length; i++) {

        if (arr[i] > target) {
            var p = arr[i-1];
            var c = arr[i];
            return {value: Math.abs( p-target ) < Math.abs( c-target ) ? p : c, index: i};
        }
    }
    return {value: arr[arr.length-1], index: arr.length-1};
};

Cursor.prototype.enterInCursorZone = function() {
    if(this.client.click){
        this.buttonAnimation = true;
    }
};

Cursor.prototype.buttonMoveAnimation = function (from, to, inversed) {
    var dist = Math.abs(to - from);
    var time = 0.2;
    var interval;
    if(inversed){
        if(from > to){
            interval = setInterval((function () {
                from++;
                if(from === 359 || from === 360){
                    clearInterval(interval);
                }
                this.moveButton(Math.round(this.circleCoords[from].x), Math.round(this.circleCoords[from].y), from);
            }).bind(this), time);
        }
    }
    else{
        if(from > to){
            interval = setInterval((function () {
                from--;
                if(from === to){
                    clearInterval(interval);
                }
                this.moveButton(Math.round(this.circleCoords[from].x), Math.round(this.circleCoords[from].y), from);
            }).bind(this), time);
        }
        else if(from < to){
            interval = setInterval((function () {
                from++;
                if(from === to){
                    clearInterval(interval);
                }
                this.moveButton(Math.round(this.circleCoords[from].x), Math.round(this.circleCoords[from].y), from);
            }).bind(this), time);
        }
    }

    setTimeout((function () {
        var activeEl = this.el.querySelector("." + CLASS_ITEM_ACTIVE);
        document.dispatchEvent(new CustomEvent("cursorChange", { detail : {
            item : activeEl.innerText
        }}));
        this.buttonAnimation = false;
        for(var i = 0; i < this.arrayItemsEl.length; i++){
            this.moveLegendItem(i, LEGEND_HIDE_RATIO);
        }
    }).bind(this), time * dist);
};

Cursor.prototype.changePositionButton = function (lastPosIndex, nextPosIndex, inverse, text) {
    this.buttonMoveAnimation(lastPosIndex, nextPosIndex, inverse, text);
    this.setLegend(text);
};

Cursor.prototype.onItemClick = function (index, e) {
    var angle = 360 / this.items.length;
    var circlePositionIndex = index * angle;
    this.changePositionButton(this.buttonPositionIndex, circlePositionIndex, false, this.items[index]);
    this.buttonPositionIndex = this.client.index = circlePositionIndex;
    this.setCurrentActiveItem(this.arrayItemsEl, index, CLASS_ITEM_ACTIVE);
    this.moveLegendItem(index, LEGEND_SHOW_RATIO);
};

Cursor.prototype.changeSizeParcours = function (size) {
    var circle = this.parcoursEl.querySelector("circle");
    circle.setAttributeNS(null, "stroke-dashoffset", this.parcoursTotalSize - size);
};

Cursor.prototype.onItemMouseEnter = function (index) {
    this.setCurrentActiveItem(this.arrayItemsEl, index, CLASS_ITEM_ACTIVE);
    this.moveLegendItem(index, LEGEND_SHOW_RATIO);
};

Cursor.prototype.onItemMouseOut = function (index) {
    this.setClosetActiveElement();
    this.moveLegendItem(index, LEGEND_HIDE_RATIO);
};

Cursor.prototype.setClosetActiveElement = function () {
    var closetItem = this.getClosestItemPosition();
    this.setCurrentActiveItem(this.arrayItemsEl, closetItem.index, CLASS_ITEM_ACTIVE);
};

Cursor.prototype.moveLegendItem = function (index, ratio) {
    var dist = this.getLegendDist(this.positionItems[Object.keys(this.positionItems)[index]], ratio);
    if(ratio === LEGEND_SHOW_RATIO || this.arrayItemsEl[index].classList.contains(CLASS_ITEM_ACTIVE)){
        this.arrayItemsEl[index].legendEl.style.opacity = "1";
        this.arrayItemsEl[index].legendEl.style.transform = "translate3d(calc(-50% + " + dist.x + "px), calc(-50% + " + dist.y + "px), 0)";
    }
    else if(ratio === LEGEND_HIDE_RATIO){
        this.arrayItemsEl[index].legendEl.style.opacity  = "0";
        this.arrayItemsEl[index].legendEl.style.transform = "translate3d(calc(-50% + " + dist.x + "px), calc(-50% + " + dist.y + "px), 0)";
    }
};