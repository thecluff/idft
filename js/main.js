var extent = 128,
    width = 450, height = 450,
    margin = {top:10, left:10, bottom:10, right:10},
    plotWidth = width-(margin.left+margin.right),
    plotHeight = height-(margin.top+margin.bottom);

var scaleX = d3.scale.linear()
    .domain([-extent, +extent])
    .range([0, plotWidth]);

var scaleY = d3.scale.linear()
    .domain([extent, -extent])
    .range([0, plotWidth]);

var xAxis = d3.svg.axis().scale(scaleX)
    .orient('bottom');
var yAxis = d3.svg.axis().scale(scaleY)
    .orient('left');

d3.select("#update").on("click", updateBoth);
d3.select("#transform-update").on("click", transformUpdate);

function appendSvg(plot) {
    var svg = d3.select(plot).append('svg')
        .attr({
            width:450,
            height:450
        })
        .append('g')
        .attr('transform','translate('+margin.left+','+margin.top+')');

    svg.append('g').attr({
        'class':'x axis',
        'transform':'translate(0,'+plotWidth/2+')'
    }).call(xAxis);

    svg.append('g').attr({
        'class':'y axis',
        'transform':'translate('+plotHeight/2+',0)'
    }).call(yAxis);
    return svg;
}

function drawPoints(points, data) {
    points.selectAll('circle').data(data, function(d){return d.id})
        .enter()
        .append('circle')
        .attr({
            'id':function(d){ return 'n'; },
            'r':2
        }).filter(function(d){
        return d.id != 'result';
    });
    points.selectAll('circle')
        .attr({
            'cx':function(d){ return scaleX(d.p.r); },
            'cy':function(d){ return scaleY(d.p.i); }
        });
}

var initialPoints = appendSvg('.container__content__complex-plane');

function initialUpdate(){
    genVector(initialPoints);
}

function genRandomVector(size){
    realArray = [];
    imagArray = [];
    var coefficient = size/2, i;
    for (i=0; i < size; i++) {
        realArray.push(Math.floor(Math.random() * size) - coefficient);
        imagArray.push(Math.floor(Math.random() * size) - coefficient);
    }
}

function genPointsValuesObject() {
    var complexPointsValues = [];
    var len = realArray.length, i;
    for (i = 0; i < len; i++) {
        complexPointsValues[i] = {
            r: realArray[i],
            i: imagArray[i]
        };
    }
    return complexPointsValues;
}

function genPointsDataObject() {
    var complexPointsValues = genPointsValuesObject();
    var complexPointsData = [];
    var len = realArray.length, i;
    for (i = 0; i < len; i++) {
        complexPointsData[i] = {
            p: complexPointsValues[i],
            id: i
        };
    }
    return complexPointsData;
}

function genVector(initialPoints) {
    genRandomVector(256);
    genPointsValuesObject();
    genPointsDataObject();
    drawPoints(initialPoints, genPointsDataObject());
}

var resultPoints = appendSvg('.container__content__complex-plane--result');

function transformUpdate(){
    transformVector(resultPoints);
}

function processVector() {
    var fourier2DArray = dft(realArray, imagArray);
    var fourier1DArray = Array.prototype.concat.apply([], fourier2DArray);
    var n = document.getElementById('nrange').value;
    var fourierReal = fourier1DArray.slice(0, 256);
    var fourierImag = fourier1DArray.slice(256);
    var realTemp = fourierReal
        .map(function (_, i) { return i; })
        .sort(function (a, b) { return Math.abs(fourierReal[a]) - Math.abs(fourierReal[b]); });

    fourierImag = fourier1DArray.slice(256);
    var imagTemp = fourierImag
        .map(function (_, i) { return i; })
        .sort(function (a, b) { return Math.abs(fourierImag[a]) - Math.abs(fourierImag[b]); });

    while (n--) {
        fourierReal[realTemp[n]] = 0;
        fourierImag[imagTemp[n]] = 0;
    }
    return [fourierReal, fourierImag];
}

function restoreVector() {
    var processedVector = processVector();
    var fourierReal = processedVector[0];
    var fourierImag = processedVector[1];
    var restored2DArray = idft(fourierReal, fourierImag),
        restored1DArray = Array.prototype.concat.apply([], restored2DArray);
    var restoredRealArray = restored1DArray.slice(0, 256);
    var restoredImagArray = restored1DArray.slice(256);
    return [restoredRealArray, restoredImagArray];
}

function genRestoredPointsValuesObject() {
    var restoredVector = restoreVector();
    var restoredRealArray = restoredVector[0];
    var restoredImagArray = restoredVector[1];
    var transformedComplexPointsValues = [];
    var len = restoredRealArray.length;
    for (var i = 0; i < len; i++) {
        transformedComplexPointsValues[i] = {
            r: restoredRealArray[i],
            i: restoredImagArray[i]
        };
    }
    return transformedComplexPointsValues;
}

function genRestoredPointsDataObject() {
    var transformedComplexPointsValues = genRestoredPointsValuesObject();
    var transformedComplexPointsData = [];
    var len = realArray.length;
    for (var i = 0; i < len; i++) {
        transformedComplexPointsData[i] = {
            p: transformedComplexPointsValues[i],
            id: i
        };
    }
    return transformedComplexPointsData;
}

function transformVector(resultPoints) {
    processVector();
    restoreVector();
    genRestoredPointsValuesObject();
    genRestoredPointsDataObject();
    drawPoints(resultPoints, genRestoredPointsDataObject());
}

function updateBoth() {
    initialUpdate();
    transformUpdate();
}

updateBoth();





