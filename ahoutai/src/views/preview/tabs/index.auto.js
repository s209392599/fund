this.barRangeCustomSeriesInstaller = (function () {
    var renderItem = function (params, api) {
        var x = api.value(0);
        var valueStart = api.value(1);
        var coordStart = api.coord([x, valueStart]);
        var valueEnd = api.value(2);
        var coordEnd = api.coord([x, valueEnd]);
        var bandWidth = api.coord([1, 0])[0] - api.coord([0, 0])[0];
        var barWidthRaw = params.itemPayload.barWidth;

        // console.log('----------------------------------');
        // console.log('api',api);
        // console.log('x',x);
        // console.log('valueStart',valueStart);
        // console.log('coordStart',coordStart);
        // console.log('valueEnd',valueEnd);
        // console.log('coordEnd',coordEnd);
        // console.log('bandWidth',bandWidth);
        // console.log('barWidthRaw',barWidthRaw);

        if (barWidthRaw == null) {
            barWidthRaw = '70%';
        }
        var barWidth = typeof barWidthRaw === 'string' && barWidthRaw.endsWith('%')
            ? (parseFloat(barWidthRaw) / 100) * bandWidth
            : barWidthRaw;
        var borderRadius = params.itemPayload.borderRadius || 0;
        var bar = {
            type: 'rect',
            shape: {
                x: coordStart[0] - barWidth / 2,
                y: coordStart[1],
                width: barWidth,
                height: coordEnd[1] - coordStart[1],
                r: borderRadius,
            },
            style: {
                fill: api.visual('color'),
            },
        };
        var marginRaw = params.itemPayload.margin;
        var margin = marginRaw == null ? 10 : marginRaw;
        var textTop = {
            type: 'text',
            x: coordEnd[0],
            y: coordEnd[1] - margin,
            style: {
                text: valueEnd.toString(),
                textAlign: 'center',
                textVerticalAlign: 'bottom',
                fill: '#333',
            },
        };
        var textBottom = {
            type: 'text',
            x: coordStart[0],
            y: coordStart[1] + margin,
            style: {
                text: valueStart.toString(),
                textAlign: 'center',
                textVerticalAlign: 'top',
                fill: '#333',
            },
        };
        return {
            type: 'group',
            // children: [bar, textTop, textBottom],
            children: [bar],
        };
    };
    var index = {
        install: function (registers) {
            registers.registerCustomSeries('barRange', renderItem);
        },
    };
    return index;
})();
