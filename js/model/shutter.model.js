/**
 * Created by Lucien on 03/12/2017.
 */


var Shutter = function (params) {
    this.el = params.el;
    this.containerEl = params.containerEl;
    this.contentEl = params.contentEl;
    this.buttonOpenEl = null;
    this.buttonCloseEl = null;
};


Shutter.prototype.init = function () {
    this.buildButtonOpen();
    this.buildButtonClose();

    this.buttonOpenEl.addEventListener("click", this.onButtonOpenClick.bind(this));
    this.buttonCloseEl.addEventListener("click", this.onButtonCloseClick.bind(this));
};

Shutter.prototype.buildButtonOpen = function () {
    this.buttonOpenEl = document.createElement("div");
    this.buttonOpenEl.classList.add("s-button");
    this.buttonOpenEl.classList.add("s-button-open");
    this.el.appendChild(this.buttonOpenEl);
};

Shutter.prototype.buildButtonClose = function () {
    this.buttonCloseEl = document.createElement("div");
    this.buttonCloseEl.classList.add("s-button");
    this.buttonCloseEl.classList.add("s-button-close");
    this.contentEl.appendChild(this.buttonCloseEl);
};

Shutter.prototype.onButtonOpenClick = function () {
    this.containerEl.classList.add("shutter-active");
};

Shutter.prototype.onButtonCloseClick = function () {
    this.containerEl.classList.remove("shutter-active");
};