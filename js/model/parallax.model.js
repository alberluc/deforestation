/**
 * Created by Lucien on 23/11/2017.
 */


var Parallax = function (params) {
    this.query = params.query;
    this.items = [];
    this.distanceParallax = {};
};

Parallax.prototype.init = function () {
    this.items = this.initItems(this.query);
    for(var i = 0; i < this.items.length; i++){
        this.animateItem(this.items[i], 0, 0);
    }
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
};

Parallax.prototype.initItems = function (query) {
    var elements = document.querySelectorAll("[" + query + "]");
    var arrayItems = [];
    for(var i = 0; i < elements.length; i++){
        arrayItems.push({
            el: elements[i],
            x: elements[i].getAttribute(this.query).split("|")[0],
            y: elements[i].getAttribute(this.query).split("|")[1],
            transform: elements[i].getAttribute(this.query).split("|")[2],
            translate: elements[i].getAttribute(this.query).split("|")[3]
        });
    }
    return arrayItems;
};

Parallax.prototype.onMouseMove = function (e) {
    var distX = (window.innerWidth / 2) - e.clientX;
    var distY = (window.innerHeight / 2) - e.clientY;
    for(var i = 0; i < this.items.length; i++){
        this.animateItem(this.items[i], distX, distY);
    }
};

Parallax.prototype.animateItem = function (Item, distX, distY) {
    var translateDirections = Item.translate.split(":");
    if(translateDirections.length > 0){
        var dir = [];
        for(var i = 0; i < translateDirections.length; i++){
            dir[translateDirections[i].split(",")[0]] = translateDirections[i].split(",")[1];
        }
        if(typeof dir["x"] !== "undefined" && typeof dir["y"] !== "undefined"){
            Item.el.style.transform = "translate3d(calc(" + dir["x"] + " + " + distX * parseFloat(Item.x) + "px), calc(" + distY * parseFloat(Item.y) + "px + " + dir["y"] + "), 0) " + Item.transform;
        }
        else if(typeof dir["x"] !== "undefined"){
            Item.el.style.transform = "translate3d(calc(" + dir["x"] + " + " + distX * parseFloat(Item.x) + "px), " + distY * parseFloat(Item.y) + "px, 0) " + Item.transform;

        }
        else if(typeof dir["y"] !== "undefined"){
            Item.el.style.transform = "translate3d(" + distX * parseFloat(Item.x) + "px, calc(" + distY * parseFloat(Item.y) + "px + " + dir["y"] + "), 0) " + Item.transform;

        }
        else{
            Item.el.style.transform = "translate3d(" + distX * parseFloat(Item.x) + "px, " + distY * parseFloat(Item.y) + "px, 0) " + Item.transform;
        }
    }
    else{
        Item.el.style.transform = "translate3d(" + distX * parseFloat(Item.x) + "px, " + distY * parseFloat(Item.y) + "px, 0) " + Item.transform;
    }
};