/**
 * Created by 肖云龙 on 2017/1/4.
 */
var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib}),
    map = new L.Map("map", {center: [39.08675, -95.8595], zoom: 4, zoomControl: false});
osm.addTo(map);
drawnItems = L.featureGroup().addTo(map);

map.addControl(new L.Control.Draw({
    edit: {
        featureGroup: drawnItems,
        poly: {
            allowIntersection: false
        }
    },
    draw: {
        polygon: false,
        polyline: false,
        marker: false,
        circle: false
    }
}));

map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;
    drawnItems.addLayer(layer);
});

map.on("zoomend", function () {
    d3.select("#map").selectAll(".rainarea").remove();
    d3.select("#map").selectAll(".continuous").remove();
    if (rdw_fcst_con_rainarea.length != 0)
        render3D();
    if (rdw_real_rainarea.length != 0)
        render2D();
});
map.on("zoomstart", function () {
    d3.select("#map").selectAll(".numbers").remove();
});
map.on("zoom", function () {
    rdw_drag_location = [];
});

map.on("dragend", function () {
    d3.select("#map").selectAll(".rainarea").remove();
    d3.select("#map").selectAll(".continuous").remove();
    d3.select("#map").selectAll(".numbers").remove();
    if (rdw_fcst_con_rainarea.length != 0)
        render3D();
    if (rdw_real_rainarea.length != 0)
        render2D();
});
