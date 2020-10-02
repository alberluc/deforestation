/**
 * Created by Lucien on 02/12/2017.
 */


var Location = function (params) {
    this.querylocations = params.querylocations;
    this.locationsEl = document.querySelectorAll("[" + this.querylocations +"]")
    this.locationsLength = params.locationsLength;
    this.classNameItem = params.classNameItem;
    this.classNameItemActive = params.classNameItemActive;
};

Location.prototype.init = function () {
    this.initLocations();
};

Location.prototype.initLocations = function () {
  for(var i = 0; i < this.locationsEl.length; i++){
    this.build(this.locationsEl[i], this.locationsEl[i].getAttribute(this.querylocations))
  }
};

Location.prototype.build = function (el, index) {
    for(var i = 1; i <= this.locationsLength; i++){
        var locationItemEl = document.createElement("div");
        locationItemEl.innerHTML = "0" + i;
        locationItemEl.classList.add(this.classNameItem);
        if(i === parseInt(index)){
            locationItemEl.classList.add(this.classNameItemActive);
        }
        el.appendChild(locationItemEl);
    }
};

