var Chart = function (el) {
    this.el = el;
    this.type = el.getAttribute("data-chart");
    this.total = this.getItem(el.getAttribute("data-total"));
    this.itemsString = el.getAttribute("data-items").split(",");
    this.viewPortReference = el.getAttribute("data-viewport") || "height";
    this.size = this.viewPortReference === "width" ? this.el.offsetWidth : this.el.offsetHeight;
    this.totalEl = null;
    this.valuesEl = [];
};

Chart.prototype.init = function () {
    this.items = this.getItemsInteger();
    switch (this.type){
        case "pie-lite":
            this.initPieChart();
            break;
        case "bar":
            this.initBarChart();
            break;
    }
};

Chart.prototype.getItemsInteger = function () {
    var newItemsArray = [];
    for(var i = 0; i < this.itemsString.length; i++){
        var item = this.getItem(this.itemsString[i]);
        if(item.value.indexOf("%") !== -1){
            var percentageNumber = parseFloat(item.value.replace("%", ""));
            item.integer = percentageNumber * this.total.integer / 100;
        }
        newItemsArray.push(item);
    }
    newItemsArray.sort(function(a,b) {return (a.integer > b.integer) ? 1 : ((b.integer > a.integer) ? -1 : 0);} );
    return newItemsArray;
};

Chart.prototype.initPieChart = function () {
    this.buildPieChart();
};

Chart.prototype.initBarChart = function () {
    this.buildBarChart();
};

Chart.prototype.buildPieChart = function () {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("width", "100%");
    this.svg.setAttribute("height", "100%");
    this.svg.setAttribute("viewBox", "0 0 " + this.size + " " + this.size);
    this.svg.classList.add("chart-item");
    var arc = this.createArc(this.total);
    this.svg.appendChild(arc);
    for(var i = 0; i < this.items.length; i++){
        var arc = this.createArc(this.items[i]);
        this.svg.appendChild(arc);
    }
    this.el.appendChild(this.svg);
};

Chart.prototype.buildBarChart = function () {
    this.totalEl = document.createElement("div");
    this.totalEl.classList.add("chart_bar_total");
    this.totalEl.style.width = "100%";
    this.totalEl.style.backgroundColor = this.total.color;
    this.totalEl.style.color = this.total.color;
    this.totalEl.innerHTML = "<span class='chart_bar_value_text'>" + this.total.value + "</span>";
    this.valuesContainerEl = document.createElement("div");
    this.valuesContainerEl.classList.add("chart_bar_values_container");
    for(var i = 0; i < this.items.length; i++){
        var valueEl = document.createElement("div");
        valueEl.classList.add("chart_bar_value");
        var percentage = (parseFloat(this.items[i].integer) * 100) / parseFloat(this.total.integer);
        valueEl.style.width = percentage + "%";
        valueEl.style.backgroundColor = this.items[i].color;
        valueEl.style.color = this.items[i].color;
        valueEl.innerHTML = "<span class='chart_bar_value_text'>" + this.items[i].value + "</span>";
        this.valuesContainerEl.appendChild(valueEl);
        this.valuesEl.push(valueEl);
    }
    this.el.appendChild(this.valuesContainerEl);
    this.el.appendChild(this.totalEl);
};

Chart.prototype.getItem = function (itemString) {
    var property = itemString.split("|");
    return {
        value: property[0],
        color: property[1],
        integer: property[0]
    };
};

Chart.prototype.createArc = function (Item) {
    var r = this.size / 2 - 5;
    var size = 2 * r * Math.PI;
    var arc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    arc.setAttribute("cx", this.size / 2);
    arc.setAttribute("cy", this.size / 2);
    arc.setAttribute("r", this.size / 2 - 5);
    arc.setAttribute("stroke-dasharray", size);
    //arc.setAttribute("stroke-dashoffset", Item.integer * size / this.total.integer);
    arc.setAttribute("stroke-dashoffset", ((this.total.integer - Item.integer) * size) / this.total.integer);
    arc.setAttribute("fill", "rgba(0,0,0,0)");
    arc.setAttribute("stroke", Item.color);
    arc.setAttribute("stroke-width", 5);
    return arc;
};