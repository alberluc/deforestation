/**
 * Created by Lucien on 07/12/2017.
 */

var Pie = function (params) {
    this.el = document.querySelector(params.queryEl);
    this.queryEl = params.queryEl;
    this.datas = null;
    this.width = params.width;
    this.height = params.height;
    this.rayon = params.rayon;
    this.legendsEl = params.legendsEl;
    this.Legends = [];
};

Pie.prototype.init = function (datas) {
    this.datas = datas;
    this.Legends = this.setLegends(this.legendsEl);
    this.buildPie(this.datas);
    this.buildLegend();
    this.setActive(0);

    for(var i = 0; i < this.Legends.length; i++){
        this.Legends[i].el.addEventListener("mouseenter", this.onItemMouseEnter.bind(this, i));
    }
};

Pie.prototype.buildPie = function (datas) {
    var svg = d3.select(this.queryEl)
        .append("svg")
        .data([datas])
        .attr("width", this.width)
        .attr("height", this.height)
            .append("g")
            .attr("transform", "translate(" + this.rayon + "," + this.rayon + ")");
    var arc = d3.arc()
        .innerRadius(this.rayon - 10)
        .outerRadius(this.rayon);
    var pie = d3.pie()
        .value((function(d, i) { return this.datas[i].value; }).bind(this));
    var arcs = svg.selectAll("g.slice")
        .data(pie)
        .enter()
        .append("g")
            .attr("class", "slice")
            .attr("transform", "translate("+ (this.width - (this.rayon * 2)) / 2 +", "+ (this.height - (this.rayon * 2)) / 2 +")")
            .attr("data-initTransform", "translate("+ (this.width - (this.rayon * 2)) / 2 +", "+ (this.height - (this.rayon * 2)) / 2 +")");
    arcs.append("path")
        .attr("fill", function(d, i) { return d.data.color; } )
        .attr("d", arc)
};

Pie.prototype.onItemMouseEnter = function (index) {
  this.setActive(index);
};

Pie.prototype.setLegends = function (legendsEl) {
    var Legends = [];
    for(var i = 0; i < legendsEl.length; i++){
        Legends.push({
            el: legendsEl[i],
            imgEl: legendsEl[i].querySelector(".causes_cursor_img"),
            titleEl: legendsEl[i].querySelector(".causes_cursor_item_title"),
            contentEl: legendsEl[i].querySelector(".causes_cursor_item_content")
        });
    }
    return Legends;
};

Pie.prototype.buildLegend = function () {
    this.legendEl = document.createElement("div");
    this.legendEl.classList.add("causes_chart_legend");
    this.el.appendChild(this.legendEl);
};

Pie.prototype.setActive = function (index) {
    var arcsPath = this.el.querySelectorAll(".slice path");
    for(var i = 0; i < this.Legends.length; i++){
        this.Legends[i].el.classList.remove("causes_chart_item-active");
        arcsPath[i].style.transform = "";
    }
    this.Legends[index].el.classList.add("causes_chart_item-active");
    arcsPath[index].style.transform = "scale(1.05)";
    this.legendEl.innerHTML = this.datas[index].label;
};