

var showScatter = function (data) {

    var option = {
        animation: false,
        legend: {
            right: 10,
            data: ['rainarea']
        },
        grid: [
            {x: '5%', y: '10%', width: '90%', height: '85%'}
        ],
        xAxis: {
            splitLine: {
                lineStyle: {
                    type: 'solid'
                }
            }
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    type: 'solid'
                }
            },
            scale: true
        },
        toolbox: {
            left: 15
        },
        brush: {
            toolbox: ['rect', 'polygon', 'keep', 'clear'],
            xAxisIndex: 0,
            outOfBrush: {
                color: '#abc'
            },
            brushStyle: {
                borderWidth: 2,
                color: 'rgba(0,0,0,0.2)',
                borderColor: 'rgba(0,0,0,0.5)',
            },
            seriesIndex: [0, 1],
            throttleType: 'debounce',
            throttleDelay: 300,
            geoIndex: 0
        },
        series: [{
            name: 'rainarea',
            data: data,
            type: 'scatter',
            // symbolSize: function (data) {
            //     return data[2] / 5;
            // },
            label: {
                emphasis: {
                    show: true,
                    formatter: function (param) {
                        var year = parseInt(parseInt(param.data[2]) / 10000);
                        var month = parseInt(parseInt(param.data[2]) % 10000 / 100);
                        var day = parseInt(parseInt(param.data[2]) % 100);
                        var date = String(year) + '-' + String(month) + '-' + String(day);
                        return date;
                    },
                    position: 'top'
                }
            },
            itemStyle: {
                normal: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(120, 36, 50, 0.5)',
                    shadowOffsetY: 5,
                    color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                        offset: 0,
                        color: 'rgb(251, 118, 123)'
                    }, {
                        offset: 1,
                        color: 'rgb(204, 46, 72)'
                    }])
                }
            }
        }]
    };
    scatterChart.setOption(option);
};