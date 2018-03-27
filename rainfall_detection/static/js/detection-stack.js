
var render3D = function () {
    d3.select("#map").selectAll(".rainarea").remove();
    d3.select("#map").selectAll(".numbers").remove();
    d3.select("#map").selectAll(".continuous").remove();
    d3.select("#map").selectAll(".legend").remove();

    map.dragging.enable();

    var div = d3.select("#map").append('div').classed("info legend", true).attr('style', 'overflow: visible; transform-origin: bottom center;');
    div.html('<i style="background:rgb(59,126,219)"></i>Forecast Rainarea<br><br><i style="background:rgb(221,83,30)"></i>Actual Rainarea<br>');


    var north_min = 50000;
    var south_max = -50000;
    var west_min = 50000;
    var east_max = -50000;

    var identity = parseInt(rdw_fcst_con_rainarea[0]['identity']);

    for (var i = 0; i < rdw_fcst_con_rainarea.length; i++) {
        for (var j = 0; j < rdw_fcst_con_rainarea[i]['data'].length; j++) {
            var lati = Number(rdw_fcst_con_rainarea[i]['data'][j][1]);
            var long = Number(rdw_fcst_con_rainarea[i]['data'][j][0]);
            var cen = map.latLngToLayerPoint(new L.LatLng(lati, long));
            north_min = (north_min > cen.y) ? cen.y : north_min;
            south_max = (south_max < cen.y) ? cen.y : south_max;
            west_min = (west_min > cen.x) ? cen.x : west_min;
            east_max = (east_max < cen.x) ? cen.x : east_max;
        }
    }

    for (var i = 0; i < rdw_anal_con_rainarea.length; i++) {
        for (var j = 0; j < rdw_anal_con_rainarea[i]['data'].length; j++) {
            var lati = Number(rdw_anal_con_rainarea[i]['data'][j][1]);
            var long = Number(rdw_anal_con_rainarea[i]['data'][j][0]);
            var cen = map.latLngToLayerPoint(new L.LatLng(lati, long));
            north_min = (north_min > cen.y) ? cen.y : north_min;
            south_max = (south_max < cen.y) ? cen.y : south_max;
            west_min = (west_min > cen.x) ? cen.x : west_min;
            east_max = (east_max < cen.x) ? cen.x : east_max;
        }
    }
    var width = east_max - west_min;
    var height = south_max - north_min;
    for (var i = 0; i < rdw_fcst_con_rainarea.length; i++) {
        var distance = parseInt(rdw_fcst_con_rainarea[i]['identity']) - identity;
        var con_div = d3.select(map.getPanes().overlayPane)
            .append("div")
            .classed("numbers", true)
            .attr('style', 'position:absolute;overflow: visible; transform:translate3d(' + east_max + 'px,' + south_max + 'px,' + (50 * distance) + 'px);');
        con_div.html(distance);
        var con_svg = d3.select(map.getPanes().overlayPane)
            .append("svg")
            .classed("continuous", true)
            .attr('style', 'overflow: visible; transform:translateZ(' + (50 * distance) + 'px);')
            .attr('id', 'continuous-' + (50 * distance));
        var con_g = con_svg.append("g").attr("class", "leaflet-zoom-hide");
        con_div.attr("width", 20)
            .attr("height", 20);
        con_svg.attr("width", (width + 20))
            .attr("height", (height + 20))
            .style("left", west_min + "px")
            .style("top", north_min + "px");

        con_g.append("path").attr('d', function () {
            var p = 'M ' + 0 + ' ' + 0 + ' L ' + width + ' ' + 0 + ' L ' + width + ' ' + height + ' L ' + 0 + ' ' + height + ' Z';
            return p;
        }).attr('stroke', "black").attr('stroke-width', 3).attr('fill', "none");

        con_g.append("rect").attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height)
            .attr('fill', "black")
            .attr('opacity', 0.1);
        var con_rect = con_g.append("rect").attr('x', width)
            .attr('y', height)
            .attr('width', 20)
            .attr('height', 20)
            .attr('fill', "black")
            .attr('opacity', 0.2);

        var path = "";
        for (var j = 0; j < rdw_fcst_con_rainarea[i]['data'].length; j++) {
            var latitude = rdw_fcst_con_rainarea[i]['data'][j][1];
            var longitude = rdw_fcst_con_rainarea[i]['data'][j][0];
            var center = map.latLngToLayerPoint(new L.LatLng(latitude, longitude));
            if (j == 0)
                path += 'M ' + (center.x - west_min) + ' ' + (center.y - north_min) + ' ';
            else
                path += 'L ' + (center.x - west_min) + ' ' + (center.y - north_min) + ' ';
        }
        path += 'Z';
        if (path != 'Z') {
            con_g.append("path")
                .attr('d', path)
                .attr('stroke', "rgb(59,126,219)")
                .attr('stroke-width', 1)
                .attr('fill', "rgb(59,126,219)")
                .attr('opacity', 0.8);
        }
        for (var k = 0; k < rdw_anal_con_rainarea.length; k++) {
            if (rdw_anal_con_rainarea[k]['identity'] == rdw_fcst_con_rainarea[i]['identity']) {
                var p = "";
                for (var j = 0; j < rdw_anal_con_rainarea[k]['data'].length; j++) {
                    var anal_latitude = rdw_anal_con_rainarea[k]['data'][j][1];
                    var anal_longitude = rdw_anal_con_rainarea[k]['data'][j][0];
                    var anal_center = map.latLngToLayerPoint(new L.LatLng(anal_latitude, anal_longitude));
                    if (j == 0)
                        p += 'M ' + (anal_center.x - west_min) + ' ' + (anal_center.y - north_min) + ' ';
                    else
                        p += 'L ' + (anal_center.x - west_min) + ' ' + (anal_center.y - north_min) + ' ';
                }
                p += 'Z';
                if (p != 'Z') {
                    con_g.append("path")
                        .attr('d', p)
                        .attr('stroke', "rgb(221,83,30)")
                        .attr('stroke-width', 1)
                        .attr('fill', "rgb(221,83,30)")
                        .attr('opacity', 0.8);
                }
            }
        }

    }
    con_rect.on("mouseover", function () {
        map.dragging.disable();
        con_svg.call(onDragDrop(dragmove, dropHandler));
    });

    if (rdw_drag_location.length != 0) {
        var miss = [];
        var scale = 1;
        d3.selectAll('.continuous').each(function () {
            var mis = parseInt(d3.select(this).attr("id").split('-')[1]);
            scale = mis / 50;
            miss.push(scale);
        });

        var continuous = d3.selectAll('.continuous').data(miss);
        continuous.style("left", function (d) {
            var left = (east_max + (rdw_drag_location[0] - east_max + (scale * 50)) * d / scale) - width;
            return left;
        });
        continuous.style("top", function (d) {
            var top = (south_max + (rdw_drag_location[1] - south_max + (scale * 100)) * d / scale) - height;
            return top;
        });
        var numbers = d3.select('#map').selectAll('.numbers').data(miss);
        numbers.style("transform", function (d) {
            var left = (east_max + (rdw_drag_location[0] - east_max + scale * 50) * d / scale);
            var top = (south_max + (rdw_drag_location[1] - south_max + scale * 100) * d / scale);
            return 'translate3d(' + left + 'px,' + top + 'px,' + (50 * d) + 'px)';
        });
    }
    function onDragDrop(dragHandler, dropHandler) {
        map.dragging.disable();
        var drag = d3.behavior.drag();

        drag.on("drag", dragHandler)
            .on("dragend", dropHandler);
        return drag;
    }

    function dropHandler() {
        map.dragging.enable();
        d3.select(this).on(".drag", null);
    }

    function dragmove() {
        var miss = [];
        var scale = 1;
        d3.selectAll('.continuous').each(function () {
            var mis = parseInt(d3.select(this).attr("id").split('-')[1]);
            scale = mis / 50;
            miss.push(scale);
        });

        var continuous = d3.selectAll('.continuous').data(miss);
        continuous.style("left", function (d) {
            var left = (east_max + (d3.event.x - east_max + (scale * 50)) * d / scale) - width;
            return left;
        });
        continuous.style("top", function (d) {
            var top = (south_max + (d3.event.y - south_max + (scale * 100)) * d / scale) - height;
            return top;
        });
        var numbers = d3.select('#map').selectAll('.numbers').data(miss);
        numbers.style("transform", function (d) {
            var left = (east_max + (d3.event.x - east_max + scale * 50) * d / scale);
            var top = (south_max + (d3.event.y - south_max + scale * 100) * d / scale);
            return 'translate3d(' + left + 'px,' + top + 'px,' + (50 * d) + 'px)';
        });
        rdw_drag_location = [d3.event.x, d3.event.y];
    }
};