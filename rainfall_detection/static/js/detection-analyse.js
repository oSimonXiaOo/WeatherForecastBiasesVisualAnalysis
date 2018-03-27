
var analyse = function (mode) {
    var path = $("#map").find("path").attr("d");
    d3.select("#map").select("canvas").remove();
    scatterChart.showLoading();
    parallelChart.showLoading();
    overviewChart.showLoading();
    if (path != null) {
        var data = path.split('L');
        var first = data[0].split('M')[1];
        var second = data[2];
        var west = Number(first.split(' ')[0]);
        var north = Number(first.split(' ')[1]);
        var east = Number(second.split(' ')[0]);
        var south = Number(second.split(' ')[1]);
        var northWest = map.layerPointToLatLng(L.point(west, north));
        var southEast = map.layerPointToLatLng(L.point(east, south));
        if (!rdw_identity) {
            $.getJSON('/ajax_analyse/', {
                'north': northWest.lat,
                'west': northWest.lng,
                'south': southEast.lat,
                'east': southEast.lng,
                'identity': rdw_identity,
                'mode': mode
            }, function (data) {
                rdw_heat = [];
                rdw_scatter = [];
                rdw_parallel = [];
                rdw_temporal = [];
                for (var i = 0; i < data[0].length; i++) {
                    var long = data[0][i][0];
                    var lat = data[0][i][1];
                    var h = data[0][i][2];
                    rdw_heat.push([lat, long, h.toString()]);
                }
                for (var i = 0; i < data[1].length; i++) {
                    rdw_scatter.push(data[1][i]);
                }
                for (var i = 0; i < data[2].length; i++) {
                    rdw_parallel.push(data[2][i]);
                }
                for (var i = 0; i < data[3].length; i++) {
                    rdw_temporal.push(data[3][i]);
                }
                L.heatLayer(rdw_heat, {radius: 20}).addTo(map);
                showOverview(rdw_temporal);
                showScatter(rdw_scatter);
                var contrast_opintion = newOption(rdw_parallel, []);
                parallelChart.setOption(contrast_opintion);
                scatterChart.hideLoading();
                parallelChart.hideLoading();
                overviewChart.hideLoading();
                $('#img-cluster').attr("src","../static/data/plot_new.png");
            });
        }
        else {
            scatterChart.showLoading();
            $.getJSON('/ajax_analyse/', {
                'identity': rdw_identity,
                'mode': mode
            }, function (data) {
                rdw_parallel = [];
                rdw_scatter = [];
                for (var i = 0; i < data[0].length; i++) {
                    rdw_scatter.push(data[0][i]);
                }
                for (var i = 0; i < data[1].length; i++) {
                    rdw_parallel.push(data[1][i]);
                }
                for (var i = 0; i < data[2].length; i++) {
                    rdw_temporal.push(data[2][i]);
                }
                var contrast_opintion = newOption(rdw_parallel, []);
                parallelChart.setOption(contrast_opintion);
                showScatter(rdw_scatter);
                showOverview(rdw_temporal);
                scatterChart.hideLoading();
                parallelChart.hideLoading();
                overviewChart.hideLoading();
                $('#img-cluster').attr("src","../static/data/plot_new.png");
            });
        }
    }
    else {
        $.getJSON('/ajax_init/', {'mode': mode}, function (data) {
            rdw_heat = [];
            rdw_scatter = [];
            rdw_parallel = [];
            rdw_temporal = [[124, 129, 151, 142, 144, 138, 113, 108, 145, 163, 148, 154],
                [25, 13, 9, 20, 20, 30, 23, 23, 25, 34, 30, 26],
                [3, 1, 8, 5, 9, 8, 5, 10, 25, 11, 4, 3]];
            for (var i = 0; i < data[0].length; i++) {
                var long = data[0][i][0];
                var lat = data[0][i][1];
                var h = data[0][i][2];
                rdw_heat.push([lat, long, h.toString()]);
            }
            L.heatLayer(rdw_heat, {radius: 20}).addTo(map);

            if (data[1].length != 0) {
                for (var i = 0; i < data[1].length; i++) {
                    rdw_scatter.push(data[1][i]);
                }

                showScatter(rdw_scatter);
                scatterChart.hideLoading();
                parallelChart.hideLoading();
                overviewChart.hideLoading();
            }
            else {
                alert("No 25mm Forecast Rainarea In The Area!");
                scatterChart.hideLoading();
                parallelChart.hideLoading();
                overviewChart.hideLoading();
            }
            for (var i = 0; i < data[2].length; i++) {
                rdw_parallel.push(data[2][i]);
            }
            var contrast_opintion = newOption(rdw_parallel, []);
            parallelChart.setOption(contrast_opintion);
            showOverview(rdw_temporal);
            scatterChart.hideLoading();
            parallelChart.hideLoading();
            overviewChart.hideLoading();
            $('#img-cluster').attr("src","../static/data/plot_old.png");
        });
    }
};