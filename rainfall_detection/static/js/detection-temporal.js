/**
 * Created by 肖云龙 on 2017/2/24.
 */

var showOverview = function (data) {
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        toolbox: {
            feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true}
            }
        },
        legend: {
            center: 0,
            data: ['1 days', '2 days', 'over 3 days']
        },
        grid: {
            left: '2%',
            right: '2%',
            height: '80%',
            width: '95%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }],
        yAxis: [{
            type: 'value'
        }],
        dataZoom: [{
            startValue: 'Jan',
            endValue: 'Dec'
        }, {
            type: 'inside'
        }],
        series: [{
            name: '1 days',
            type: 'bar',
            stack: 'series',
            data: data[0]
        }, {
            name: '2 days',
            type: 'bar',
            stack: 'series',
            data: data[1]
        }, {
            name: 'over 3 days',
            type: 'bar',
            stack: 'series',
            data: data[2]
        }]
    };
    overviewChart.setOption(option);
};