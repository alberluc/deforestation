var MultiPies = function (params) {
    this.el = params.el;
    this.Pies = [];
    this._Pies = [];
    this.axesKey = params.axesKey;
    this.piesDatas = [];
    this.intervals = [];
    this.numberOfPies = 0;
    this.totalPieRadius = 1.5 * Math.PI;
    this.width = this.el.offsetWidth;
    this.legends = [];
};

MultiPies.prototype.init = function (datas) {
    this.datas = this.initDatasPies(datas);
    this.buildPies();
    this.buildLegends();
    this.showPies("1977");

    document.addEventListener("cursorChange", this.onCursorChange.bind(this));
};

MultiPies.prototype.buildPies = function () {
    for(var i = 0; i < this.numberOfPies; i++){
        this.Pies[i] = this.buildPie(this.piesDatas[Object.keys(this.piesDatas)[i]], i);
    }
};

MultiPies.prototype.buildPie = function (data, index, hidden) {
    hidden = hidden || false;
    var size = 150 - (index * 40);
    var width = 5;
    var Pie = this.setPie(index, data);
    Pie.arc = d3.arc()
        .innerRadius(size - width)
        .outerRadius(size)
        .startAngle(0);
    var svg = d3.select(".state_charts")
        .append("svg")
        .classed("mc-chart", true)
        .attr("width", this.width)
        .attr("height", this.width);
    Pie.group = svg.append("g").attr("transform", "translate(" + this.width / 2 + "," + this.width / 2 + ")scale(-1, 1)");
    Pie.path = Pie.group.append("path")
        .datum({endAngle: 0})
        .attr("d", Pie.arc);
    Pie.value = Pie.group.append("text")
        .classed("chart-value", true)
        .attr("id", "chart-value" + Pie.index)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#75892b");
    if(hidden){
        Pie.path.style("fill", "rgba(0,0,0,0)");
    }
    else{
        Pie.path.style("fill", "#75892b");
    }
    return Pie;
};

MultiPies.prototype.setPie = function (index, data) {
    return {
        index: index,
        angle: 0
    };
};

MultiPies.prototype.initDatasPies = function (datas) {
    var datasByLegends = [];
    for (var key in datas){
        for(var legend in datas[key]){
            datasByLegends[legend] = datasByLegends[legend] || [];
            datasByLegends[legend].push(datas[key][legend]);
        }
    }
    for(var legend in datasByLegends){
        this.legends.push(legend);
        datasByLegends[legend].sort(function (a, b) {
            if(a > b) return 1;
            else if(a < b) return -1;
            else return 0;
        });
        this.intervals[legend] = [];
        this.intervals[legend] = this.getMinAndMax(datasByLegends[legend]);
        this.numberOfPies++;
    }
    return datas;
};

MultiPies.prototype.buildLegends = function () {
    this.legendsEl = document.createElement("div");
    this.legendsEl.classList.add("state_chart_legends");
    for(var i in this.legends) {
        var el = document.createElement("span");
        el.classList.add("state_chart_legend");
        el.innerHTML = this.legends[i] + "<span class='state_chart_unit'>km²</span>";
        this.legendsEl.appendChild(el);
    }
    this.el.appendChild(this.legendsEl);
};

MultiPies.prototype.getMinAndMax = function (data) {
    var arr = [];
    for(var i = 0; i < data.length; i++) {
        if (data[i].indexOf("%") !== -1) {
            data[i] = data[i].replace("%", "");
        }
        data[i] = data[i].replace(" ", "").replace(",", ".");
        var number = parseFloat(data[i]);
        if(typeof arr["min"] === "undefined"){
            arr["min"] = number;
        }
        if(typeof arr["max"] === "undefined"){
            arr["max"] = number;
        }
        if(number < arr["min"]){
            arr["min"] = number;
        }
        if(number > arr["max"]){
            arr["max"] = number;
        }
    }
    return arr;
};

MultiPies.prototype.showPies = function (showItem) {
    for(var i = 0; i < this.Pies.length; i++){
        var data = this.datas[showItem];
        var text = data[Object.keys(data)[i]];
        var percent = this.getAngle(text, Object.keys(data)[i]);
        this.Pies[i].path
            .transition()
            .duration(750)
            .attrTween("d", this.pieAnimate(percent, this.totalPieRadius * percent, text, this.Pies[i]));
    }
};

MultiPies.prototype.pieAnimate = function(percent, angle, text, Pie) {
    TweenMax.set(this.el.querySelector("#chart-value" + Pie.index), {opacity: 0});
    TweenMax.to(this.el.querySelector("#chart-value" + Pie.index), 0.5, {opacity: 1, delay: 0.75});
    Pie.value.text(text);

    return (function(d) {
        var interpolate = d3.interpolate(d.endAngle, angle);
        return (function(t) {
            d.endAngle = interpolate(t);
            var path = Pie.arc(d);
            var coords = path.split("L")[1].split("A")[0];
            Pie.x = coords.split(",")[0];
            Pie.y = coords.split(",")[1];
            var dist = this.getDistanceLegend(percent, Pie);
            Pie.value.attr('transform', 'translate(' + dist.x + ', ' + dist.y + ')scale(-1, 1)');
            this.lastPie = Pie;
            return path;
        }).bind(this);
    }).bind(this);
};

MultiPies.prototype.getDistanceLegend = function (percent, Pie) {
    var width = Pie.value.node().getComputedTextLength() - 10 , height = 10;

    var x , y;
    if(percent > 0 && percent < 1 / 4){
        x = -width;
        y = 0;
    }
    else if(percent > 1 / 4 && percent < (1 / 4) * 2){
        x = 0;
        y = -height;
    }
    else if(percent > 1 / 4 && percent < (1 / 4) * 3){
        x = width;
        y = 0;
    }
    else{
        x = 0;
        y = height;
    }
    return {
        x: parseFloat(Pie.x) - x,
        y: parseFloat(Pie.y) - y
    };
};

MultiPies.prototype.onCursorChange = function (e) {
    this.showPies(e.detail.item);
};

MultiPies.prototype.getAngle = function (value, legend) {
    var min = this.intervals[legend]["min"];
    var max = this.intervals[legend]["max"];
    if(value.indexOf("%") !== -1){
        value = value.replace("%", "");
    }
    value = value.replace(" ", "").replace(",", ".");
    var percentage = (parseFloat(value) - min) / (max - min);
    if(percentage === 0) percentage = 0.1;
    return percentage;
};