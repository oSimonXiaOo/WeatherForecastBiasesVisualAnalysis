/**
 * Created by 肖云龙 on 2017/2/21.
 */
var rdw_identity = 0;
var rdw_heat = []; //热力值数据
var rdw_scatter = []; //散点值
var rdw_parallel = [];//平行坐标数据
var rdw_temporal = [];//时序视图数据

var rdw_real_rainarea = []; //真实雨区数据
var rdw_fcst_con_rainarea = []; //预测连续雨区数据
var rdw_anal_con_rainarea = []; //实际连续雨区数据
var rdw_drag_location = []; //拖拽位置数据

var overviewChart = echarts.init(document.getElementById('time-overview'));
var scatterChart = echarts.init(document.getElementById('scatter'));
var parallelChart = echarts.init(document.getElementById('parallel'));

$(document).ready(function () {
    //init
    analyse(0);
    map.dragging.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    //event
    overviewChart.on('datazoom', function (params) {
        var patition_scatter = [];
        var patition_parallel = [];
        if (rdw_scatter.length > 0) {
            for (var i = 0; i < rdw_scatter.length; i++) {
                var dates = rdw_scatter[i][2];
                var value = parseInt(parseInt(dates) % 10000 / 100) / 12 * 100;
                if (params.start <= value && params.end >= value) {
                    patition_scatter.push(rdw_scatter[i]);
                    patition_parallel.push(rdw_parallel[i]);
                }
            }
            showScatter(patition_scatter);
            var contrast_opintion = newOption(patition_parallel, []);
            parallelChart.setOption(contrast_opintion);
        }
    });
    overviewChart.on('restore', function () {
        var contrast_opintion = newOption(rdw_parallel, []);
        parallelChart.setOption(contrast_opintion);
        showScatter(rdw_scatter);
        showOverview(rdw_temporal);
    });
    scatterChart.on('brushSelected', function (params) {
        var brushComponent = params.batch[0];
        var dataIndices = brushComponent.selected[0].dataIndex;
        var identities = [];
        var rdw_scatter_choose = [];
        if (dataIndices.length > 0) {
            for (var i = 0; i < dataIndices.length; i++) {
                var dataIndex = dataIndices[i];
                rdw_scatter_choose.push(rdw_parallel[dataIndex]);
                identities.push(rdw_scatter[dataIndex][2]);
            }
            var contrast_opintion = newOption(rdw_parallel, rdw_scatter_choose);
            parallelChart.setOption(contrast_opintion);
            var str = identities.join(" ");
            var temporal = [];
            $.getJSON('/ajax_con_day/', {'identities': str}, function (data) {
                for (var i = 0; i < data.length; i++) {
                    temporal.push(data[i]);
                }
                showOverview(temporal);
            });
        }
        else {
            var contrast_opintion = newOption(rdw_parallel, []);
            parallelChart.setOption(contrast_opintion);
            showOverview(rdw_temporal);

        }
    });
    scatterChart.on('click', function (params) {
        if (params.data[2] != null) {
            d3.select("#map").select("canvas").remove();
            rotate3D();
            rdw_real_rainarea = [];
            rdw_drag_location = [];
            var rdw_scatter_choose = [];
            var rdw_scatter_other = [];
            for (var i = 0; i < rdw_scatter.length; i++) {
                if(params.data[2] == rdw_scatter[i][2])
                    rdw_scatter_choose.push(rdw_parallel[i]);
                else
                    rdw_scatter_other.push(rdw_parallel[i]);
            }
            var contrast_opintion = newOption(rdw_scatter_other, rdw_scatter_choose);
            parallelChart.setOption(contrast_opintion);
            $.getJSON('/ajax_con_rain/', {'identity': params.data[2]}, function (data) {
                rdw_fcst_con_rainarea = [];
                rdw_anal_con_rainarea = [];
                //返回值 data 在这里是一个列表
                for (var j = 0; j < data[0].length; j++) {
                    rdw_fcst_con_rainarea.push(data[0][j]);
                }
                for (var i = 0; i < data[1].length; i++) {
                    rdw_anal_con_rainarea.push(data[1][i]);
                }
                render3D();
            });
        }
    });
    $('#home').click(function () {
        window.location.reload();
    });
    $('#search').click(function () {
        d3.select("#map").select("canvas").remove();
        d3.select("#map").select("path").remove();
        var date = $("#date").val();
        init();
        rotate2D();
        clear();
        $.getJSON('/ajax_rain/', {'date': date}, function (data) {
            if (data.length != 0) {
                for (var i = 0; i < data.length; i++) {
                    rdw_real_rainarea.push(data[i]);
                }
                render2D();
            }
            else
                alert("No 25mm Forecast Rainarea In The Day!");
        })
    });
    $('#reset').click(function () {
        map.setView([39.08675, -95.8595], 4);
        map.dragging.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        init();
        rotate2D();
        clear();
        $('#dropdownMenu').html('PCA<span class="caret"></span>');
        d3.select("#map").select("canvas").remove();
        analyse(0);
    });
    $('#PCA').click(function () {
        analyse(0);
        $('#dropdownMenu').html('PCA<span class="caret"></span>');
    });
    $('#TSNE').click(function () {
        analyse(1);
        $('#dropdownMenu').html('TSNE<span class="caret"></span>');
    });
    $('#ISOMAP').click(function () {
        analyse(2);
        $('#dropdownMenu').html('ISOMAP<span class="caret"></span>');
    });
    $('#RTE').click(function () {
        analyse(3);
        $('#dropdownMenu').html('RTE<span class="caret"></span>');
    });
    $('#SE').click(function () {
        analyse(4);
        $('#dropdownMenu').html('SE<span class="caret"></span>');
    });
});
//function
var init = function () {
    rdw_identity = 0;
    rdw_real_rainarea = [];
    rdw_anal_con_rainarea = [];
    rdw_fcst_con_rainarea = [];
    rdw_drag_location = [];
};
var clear = function () {
    d3.select("#map").selectAll(".rainarea").remove();
    d3.select("#map").selectAll(".continuous").remove();
    d3.select("#map").selectAll(".numbers").remove();

};
var rotate2D = function () {
    $('.leaflet-container').css('background', '');
    $('.leaflet-control').css('display', '');
    $('*').css('transform-style', '');
    $('.stage').removeClass('perspective');
    $('.tilter').removeClass('tiltmap');
    $('.marker').removeClass('bottomaxis');
    $('.legend').css('transform', 'rotateX(0deg)');
};
var rotate3D = function () {
    $('.leaflet-container').css('background', 'none');
    $('.leaflet-control').css('display', 'none');
    $('.stage *').css('transform-style', 'preserve-3d');
    $('.stage').addClass('perspective');
    $('.tilter').addClass('tiltmap');
    $('.marker').addClass('bottomaxis');
    $('.legend').css('transform', 'rotateX(-60deg)');
};


