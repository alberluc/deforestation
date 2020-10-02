if(document.readyState !== "loading"){
    run();
}
else{
    document.addEventListener("DOMContentLoaded", run);
}

function run() {

    var linkSourcesEl = document.querySelectorAll(".bibliographie_section_sources_link a");
    for(var i = 0; i < linkSourcesEl.length; i++){
        linkSourcesEl[i].setAttribute("href", linkSourcesEl[i].innerText);
        linkSourcesEl[i].setAttribute("target", "_blank");
    }

    var multiPie = new MultiPies({
        el: document.querySelector(".state_charts"),
        axesKey: "Legende"
    });

    d3.json("datas/charts/state.json", function (datas) {
        multiPie.init(datas);
    });

    var pie = new Pie({
        queryEl: ".causes_charts",
        width: 330,
        height: 330,
        rayon: 150,
        legendsEl: document.querySelectorAll(".causes_cursor_item")
    });

    d3.json("datas/charts/causes.json", function (datas) {
        pie.init(datas);
    });

    var chartsEl = document.querySelectorAll("[data-chart]");
    for(var i = 0; i < chartsEl.length; i++) {
        var chart = new Chart(chartsEl[i]);
        chart.init();
    }

    var shuttersEl = document.querySelectorAll(".pb_section");
    for(var i = 0; i < shuttersEl.length; i++){
        var shutter = new Shutter({
            el: shuttersEl[i].querySelector(".shutter"),
            containerEl: shuttersEl[i],
            contentEl: shuttersEl[i].querySelector(".pb_section_main")
        });
        shutter.init();
    }

    var location = new Location({
        querylocations: "data-location",
        locationsLength: 4,
        classNameItem: "l-item",
        classNameItemActive: "l-item-active"
    });
    location.init();

    var particules = new Particules({
        parentEl: document.querySelector(".particules_container"),
        colors: ["0x75A440", "0x4AC40E", "0xC48D0E", "0x7D9870"],
        numberOfParticules: 200,
        particuleSize: 1.3
    });
    particules.init();
    particules.anim();

    var naivgation = new Navigation({
        parentEl : document.querySelector(".site_main"),
        centerPageEl : document.querySelector(".page_center"),
        positionsPages : [
            [0, document.querySelector(".page_top"), 0],
            [document.querySelector(".page_left"), document.querySelector(".page_center"), document.querySelector(".page_right")],
            [0, document.querySelector(".page_bottom"), 0]
        ],
        transitionDuration: 1000
    });
    naivgation.init();

    var state_cursor = new Cursor({
        el: document.querySelector(".state_cursor"),
        parent: document.querySelector(".page_state-left"),
        legend: document.createElement("div"),
        items: ["1977", "1988", "1993", "1998", "2003", "2008", "2013", "2015"],
        startOrigin: Math.PI / 2
    });
    state_cursor.init();

    var pageHandler = new HandlerPage({
        titleEl: document.querySelector(".pc_title"),
        containerEl: document.querySelector(".page_center"),
        subtitleEl: document.querySelector(".pc_subTitle")
    });
    pageHandler.init();

    window.onload = function () {
        var loaderEl = document.getElementById("loader");
        loaderEl.classList.add("loader-hidden");
        /*var parallaxItems = new Parallax({
            query: "data-parallax"
        });
        parallaxItems.init();*/
    }

}