/**
 * Created by 肖云龙 on 2017/3/14.
 */
var render2D = function () {
    map.dragging.enable();

    var svg = d3.select(map.getPanes().overlayPane)
        .append("svg")
        .classed("rainarea", true)
        .attr("style", "overflow: visible;");
    var g = svg.append("g").attr("class", "leaflet-zoom-hide");

    var bounds = map.getBounds();
    var topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
    var bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());

    svg.attr("width", bottomRight.x - topLeft.x)
        .attr("height", bottomRight.y - topLeft.y)
        .style("left", topLeft.x + "px")
        .style("top", topLeft.y + "px");

    g.attr("transform", "translate(" + -topLeft.x + "," + -topLeft.y + ")");

    svg.selectAll("path").remove();
    for (var i = 0; i < rdw_real_rainarea.length; i++) {
        var path = "";
        for (var j = 0; j < rdw_real_rainarea[i]['data'].length; j++) {
            var latiude = rdw_real_rainarea[i]['data'][j][1];
            var longitude = rdw_real_rainarea[i]['data'][j][0];
            var center = map.latLngToLayerPoint(new L.LatLng(latiude, longitude));
            if (j == 0)
                path += 'M ' + center.x + ' ' + center.y + ' ';
            else
                path += 'L ' + center.x + ' ' + center.y + ' ';

        }
        path += 'Z';
        if (path != 'Z') {
            g.append("path")
                .attr('id', rdw_real_rainarea[i]['identity'])
                .attr('d', path)
                .attr('stroke', "rgb(59,126,219)")
                .attr('stroke-width', 1)
                .attr('fill', "rgb(59,126,219)")
                .attr('opacity', 0.8)
                .on("click", function () {
                    rdw_identity = $(this).attr("id");
                });
        }
    }
};
