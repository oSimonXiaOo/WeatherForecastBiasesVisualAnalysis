var newOption = function (rdw_other, rdw_choose) {
    var schema = [
        {name: 'rainfall', index: 1, text: '降雨量'},
        {name: 'rainarea', index: 2, text: '降雨面积'},
        {name: 'longitude', index: 3, text: '质心经度'},
        {name: 'latitude', index: 4, text: '质心纬度'},
        {name: 'rainfall bias', index: 5, text: '雨量偏差'},
        {name: 'rainarea bias', index: 6, text: '面积偏差'},
        {name: 'longitude bias', index: 7, text: '经度偏差'},
        {name: 'latitude bias', index: 8, text: '纬度偏差'}
    ];

    var option = {
        animation: false,
        parallelAxis: [
            {dim: 0, name: schema[0].text, min: 25, max: 100},
            {dim: 1, name: schema[1].text, min: 0, max: 1000},
            {dim: 2, name: schema[2].text, min: -125.625, max: -66.094},
            {dim: 3, name: schema[3].text, min: 25.0436, max: 53.1299},
            {dim: 4, name: schema[4].text, min: -75, max: 75},
            {dim: 5, name: schema[5].text, min: -750, max: 750},
            {dim: 6, name: schema[6].text, min: -5, max: 5},
            {dim: 7, name: schema[7].text, min: -5, max: 5}
        ],
        parallel: {
            bottom: '10%',
            left: '3%',
            height: '75%',
            width: '95%',
            parallelAxisDefault: {
                type: 'value',
                name: 'Visualization',
                nameLocation: 'end',
                nameGap: 20,
                splitNumber: 3,
                nameTextStyle: {
                    fontSize: 14
                },
                axisLine: {
                    lineStyle: {
                        color: '#555'
                    }
                },
                axisTick: {
                    lineStyle: {
                        color: '#555'
                    }
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#555'
                    }
                }
            }
        },
        grid: [],
        xAxis: [],
        yAxis: [],
        series: [
            {
                name: 'parallel',
                type: 'parallel',
                smooth: true,
                lineStyle: {
                    normal: {
                        color: '#777',
                        width: 1,
                    }
                },
                data: rdw_other
            },
            {
                name: 'parallel',
                type: 'parallel',
                smooth: true,
                lineStyle: {
                    normal: {
                        color: '#c23531'
                    }
                },
                data: rdw_choose
            }
        ]
    };
    return option;
};