// don't try to learn anything from the code, it's a
// series of hacks. this one's all about the visuals.
// - @hakimel

var LineChart = function( options ) {

  var data = options.data;
  var canvas = document.body.appendChild( document.createElement( 'canvas' ) );
  var context = canvas.getContext( '2d' );

  var rendering = false,
      paddingX = 40,
      paddingY = 40,
      width = options.width || window.innerWidth,
      height = options.height || window.innerHeight,
      progress = 0;

  canvas.width = width;
  canvas.height = height;

  var maxValue,
      minValue;

  var y1 = paddingY + ( 0.05 * ( height - ( paddingY * 2 ) ) ),
      y2 = paddingY + ( 0.50 * ( height - ( paddingY * 2 ) ) ),
      y3 = paddingY + ( 0.95 * ( height - ( paddingY * 2 ) ) );
  
  format();
  render();
  
  function format( force ) {

    maxValue = 0;
    minValue = Number.MAX_VALUE;
    
    data.forEach( function( point, i ) {
      maxValue = Math.max( maxValue, point.value );
      minValue = Math.min( minValue, point.value );
    } );

    data.forEach( function( point, i ) {
      point.targetX = paddingX + ( i / ( data.length - 1 ) ) * ( width - ( paddingX * 2 ) );
      point.targetY = paddingY + ( ( point.value - minValue ) / ( maxValue - minValue ) * ( height - ( paddingY * 2 ) ) );
      point.targetY = height - point.targetY;
  
      if( force || ( !point.x && !point.y ) ) {
        point.x = point.targetX + 30;
        point.y = point.targetY;
        point.speed = 0.6 + ( 1 - ( i / data.length ) ) * 0.8;
      }
    } );
    
  }

  function render() {

    if( !rendering ) {
      requestAnimationFrame( render );
      return;
    }
    
    context.font = '10px sans-serif';
    context.clearRect( 0, 0, width, height );

    context.fillStyle = '#222';
    context.fillRect( paddingX, y1, width - ( paddingX * 2 ), 1 );
    context.fillRect( paddingX, y2, width - ( paddingX * 2 ), 1 );
    context.fillRect( paddingX, y3, width - ( paddingX * 2 ), 1 );
    
    if( options.yAxisLabel ) {
      context.save();
      context.globalAlpha = progress;
      context.translate( paddingX - 15, height - paddingY - 10 );
      context.rotate( -Math.PI / 2 );
      context.fillStyle = '#fff';
      context.fillText( options.yAxisLabel, 0, 0 );
      context.restore();
    }

    var progressDots = Math.floor( progress * data.length );
    var progressFragment = ( progress * data.length ) - Math.floor( progress * data.length );

    data.forEach( function( point, i ) {
      if( i <= progressDots ) {
        point.x += ( point.targetX - point.x ) * point.speed;
        point.y += ( point.targetY - point.y ) * point.speed;

        context.save();
        
        var wordWidth = context.measureText( point.label ).width;
        context.globalAlpha = i === progressDots ? progressFragment : 1;
        context.fillStyle = point.future ? '#aaa' : '#fff';
        context.fillText( point.label, point.x - ( wordWidth / 2 ), height - 18 );

        if( i < progressDots && !point.future ) {
          context.beginPath();
          context.arc( point.x, point.y, 4, 0, Math.PI * 2 );
          context.fillStyle = '#1baee1';
          context.fill();
        }

        context.restore();
      }

    } );

    context.save();
    context.beginPath();
    context.strokeStyle = '#1baee1';
    context.lineWidth = 2;

    var futureStarted = false;

    data.forEach( function( point, i ) {

      if( i <= progressDots ) {

        var px = i === 0 ? data[0].x : data[i-1].x,
            py = i === 0 ? data[0].y : data[i-1].y;

        var x = point.x,
            y = point.y;

        if( i === progressDots ) {
          x = px + ( ( x - px ) * progressFragment );
          y = py + ( ( y - py ) * progressFragment );
        }

        if( point.future && !futureStarted ) {
          futureStarted = true;

          context.stroke();
          context.beginPath();
          context.moveTo( px, py );
          context.strokeStyle = '#aaa';

          if( typeof context.setLineDash === 'function' ) {
            context.setLineDash( [2,3] );
          }
        }

        if( i === 0 ) {
          context.moveTo( x, y );
        }
        else {
          context.lineTo( x, y );
        }

      }

    } );

    context.stroke();
    context.restore();

    progress += ( 1 - progress ) * 0.02;
  
    requestAnimationFrame( render );

  }
  
  this.start = function() {
    rendering = true;
  }
  
  this.stop = function() {
    rendering = false;
    progress = 0;
    format( true );
  }
  
  this.restart = function() {
    this.stop();
    this.start();
  }
  
  this.append = function( points ) {    
    progress -= points.length / data.length;
    data = data.concat( points );
    
    format();
  }
  
  this.populate = function( points ) {    
    progress = 0;
    data = points;
    
    format();
  }

};

var chart = new LineChart({ data: [] });

var test0 = [
    { label: '0', value: 50.41 },
    { label: '1st', value: 951 },
    { label: '2nd', value: 53 },
    { label: '3rd', value: 63 },
    { label: '4th', value: 8.28 },
    { label: '5th', value: 48 },
    { label: '6th', value: 4.54 },
    { label: '7th', value: 10.41 },
    { label: '8th', value: 3.2 },
    { label: '9th', value: 8.34 },
    { label: '10th', value: 1.87 },
    { label: '11th', value: 6.2 },
    { label: '12th', value: 0.49},
    { label: '13th', value: 6.36},
    { label: '14th', value: 1.16},
    { label: '15th', value: 4.15},
    { label: '16th', value: 0.64},
    { label: '17th', value: 0.95},
    { label: '18th', value: 1.27},
    { label: '19th', value: 2.74},
    { label: '20th', value: 0.89},
    { label: '21th', value: 0.75},
    { label: '22th', value: 0.72},
    { label: '23th', value: 1.69},
    { label: '24th', value: 2.13},
    { label: '25th', value: 0.41},
    { label: '26th', value: 0.5},
    { label: '27th', value: 1.02},
    { label: '28th', value: 2.1},
    { label: '29th', value: 0.77},
    { label: '30th', value: 0.84}
  ];

var test1 = [
  { label: '0', value: 55 },
{ label: '1st', value: 2121 },
{ label: '2nd', value: 76.95 },
{ label: '3rd', value: 80.41 },
{ label: '4th', value: 11.71 },
{ label: '5th', value: 134.83 },
{ label: '6th', value: 6.4 },
{ label: '7th', value: 7.67 },
{ label: '8th', value: 2.85 },
{ label: '9th', value: 11.36 },
{ label: '10th', value: 2.37 },
{ label: '11th', value: 25.66 },
{ label: '12th', value: 2.04},
{ label: '13th', value: 3.29},
{ label: '14th', value: 2.42},
{ label: '15th', value: 14.29},
{ label: '16th', value: 1.85},
{ label: '17th', value: 5.66},
{ label: '18th', value: 1.29},
{ label: '19th', value: 6.27},
{ label: '20th', value: 0.99},
{ label: '21th', value: 4.47},
{ label: '22th', value: 0.34},
{ label: '23th', value: 2.63},
{ label: '24th', value: 0.49},
{ label: '25th', value: 2.85},
{ label: '26th', value: 1.04},
{ label: '27th', value: 2.27},
{ label: '28th', value: 0.07},
{ label: '29th', value: 0.38},
{ label: '30th', value: 1.29}
  ]; 
  var test2 = [
  { label: '0', value: 306 },
  { label: '1st', value: 10330 },
  { label: '2nd', value: 1254 },
  { label: '3rd', value: 2925 },
  { label: '4th', value: 878 },
  { label: '5th', value: 1592 },
  { label: '6th', value: 156 },
  { label: '7th', value: 388 },
  { label: '8th', value: 149 },
  { label: '9th', value: 120 },
  { label: '10th', value: 96 },
  { label: '11th', value: 134 },
  { label: '12th', value: 73},
  { label: '13th', value: 61},
  { label: '14th', value: 59},
  { label: '15th', value: 72},
  { label: '16th', value: 25},
  { label: '17th', value: 43},
  { label: '18th', value: 4.64},
  { label: '19th', value: 11.36},
  { label: '20th', value: 5.85},
  { label: '21th', value: 14},
  { label: '22th', value: 11},
  { label: '23th', value: 22},
  { label: '24th', value: 16},
  { label: '25th', value: 13.92},
  { label: '26th', value: 20},
  { label: '27th', value: 12},
  { label: '28th', value: 13},
  { label: '29th', value: 8},
  { label: '30th', value: 5}
    ];
var test3 = [
      { label: '0', value: 61 },
      { label: '1st', value: 11707 },
      { label: '2nd', value: 947 },
      { label: '3rd', value: 2944 },
      { label: '4th', value: 85 },
      { label: '5th', value: 1897 },
      { label: '6th', value: 72 },
      { label: '7th', value: 459 },
      { label: '8th', value: 20 },
      { label: '9th', value: 265 },
      { label: '10th', value: 19 },
      { label: '11th', value: 238 },
      { label: '12th', value: 12},
      { label: '13th', value: 132},
      { label: '14th', value: 12},
      { label: '15th', value: 93},
      { label: '16th', value: 10},
      { label: '17th', value: 62},
      { label: '18th', value: 6.9},
      { label: '19th', value: 39.8},
      { label: '20th', value: 6.35},
      { label: '21th', value: 36},
      { label: '22th', value: 4},
      { label: '23th', value: 34},
      { label: '24th', value: 3},
      { label: '25th', value: 28},
      { label: '26th', value: 1.38},
      { label: '27th', value: 24},
      { label: '28th', value: 3.19},
      { label: '29th', value: 20},
      { label: '30th', value: 0.95}
        ];
var test4 = [
  { label: '0', value: 54 },
  { label: '1st', value: 11457 },
  { label: '2nd', value: 738 },
  { label: '3rd', value: 2811 },
  { label: '4th', value: 56 },
  { label: '5th', value: 1852 },
  { label: '6th', value: 50 },
  { label: '7th', value: 477 },
  { label: '8th', value: 14 },
  { label: '9th', value: 271 },
  { label: '10th', value: 11 },
  { label: '11th', value: 246 },
  { label: '12th', value: 6},
  { label: '13th', value: 139},
  { label: '14th', value: 7},
  { label: '15th', value: 90},
  { label: '16th', value: 7},
  { label: '17th', value: 60},
  { label: '18th', value: 7},
  { label: '19th', value: 40},
  { label: '20th', value: 2.09},
  { label: '21th', value: 37},
  { label: '22th', value: 2.05},
  { label: '23th', value: 35},
  { label: '24th', value: 3},
  { label: '25th', value: 30},
  { label: '26th', value: 1.88},
  { label: '27th', value: 26.09},
  { label: '28th', value: 1.6},
  { label: '29th', value: 22},
  { label: '30th', value: 1.42}
  ];

var test5 = [
  { label: '0', value: 60 },
  { label: '1st', value: 2120 },
  { label: '2nd', value: 54 },
  { label: '3rd', value: 67 },
  { label: '4th', value: 13 },
  { label: '5th', value: 143 },
  { label: '6th', value: 3.93 },
  { label: '7th', value: 4.93 },
  { label: '8th', value: 2.82 },
  { label: '9th', value: 9.45 },
  { label: '10th', value: 1.56 },
  { label: '11th', value: 25 },
  { label: '12th', value: 2},
  { label: '13th', value: 2.89},
  { label: '14th', value: 1.27},
  { label: '15th', value: 15},
  { label: '16th', value: 2.2},
  { label: '17th', value: 8.75},
  { label: '18th', value: 1.45},
  { label: '19th', value: 7.97},
  { label: '20th', value: 1.78},
  { label: '21th', value: 5},
  { label: '22th', value: 1.01},
  { label: '23th', value: 4.75},
  { label: '24th', value: 1.84},
  { label: '25th', value: 2.28},
  { label: '26th', value: 1.88},
  { label: '27th', value: 1.77},
  { label: '28th', value: 1.17},
  { label: '29th', value: 0.91},
  { label: '30th', value: 1.05}
  ];



var test6 = [
  { label: '0', value: 54 },
  { label: '1st', value: 11898 },
  { label: '2nd', value: 64 },
  { label: '3rd', value: 194 },
  { label: '4th', value: 8.2 },
  { label: '5th', value: 439.97 },
  { label: '6th', value: 2.97 },
  { label: '7th', value: 37 },
  { label: '8th', value: 0.78 },
  { label: '9th', value: 106 },
  { label: '10th', value: 2.53 },
  { label: '11th', value: 90 },
  { label: '12th', value: 2.48},
  { label: '13th', value: 115},
  { label: '14th', value: 1.14},
  { label: '15th', value: 16},
  { label: '16th', value: 1.06},
  { label: '17th', value: 50},
  { label: '18th', value: 1.43},
  { label: '19th', value: 38},
  { label: '20th', value: 0.28},
  { label: '21th', value: 2.42},
  { label: '22th', value: 1.28},
  { label: '23th', value: 12},
  { label: '24th', value: 0.23},
  { label: '25th', value: 5.48},
  { label: '26th', value: 1.07},
  { label: '27th', value: 8.71},
  { label: '28th', value: 0.98},
  { label: '29th', value: 2.33},
  { label: '30th', value: 0.87}
  ];

var test7 = [
  { label: '0', value: 52 },
  { label: '1st', value: 11152 },
  { label: '2nd', value: 40 },
  { label: '3rd', value: 127 },
  { label: '4th', value: 2.5 },
  { label: '5th', value: 355 },
  { label: '6th', value: 4.46 },
  { label: '7th', value: 57 },
  { label: '8th', value: 2.27 },
  { label: '9th', value: 90 },
  { label: '10th', value: 2.72 },
  { label: '11th', value: 82 },
  { label: '12th', value: 1.61},
  { label: '13th', value: 120},
  { label: '14th', value: 1.17},
  { label: '15th', value: 16},
  { label: '16th', value: 1.6},
  { label: '17th', value: 56},
  { label: '18th', value: 1.38},
  { label: '19th', value: 37.9},
  { label: '20th', value: 0.8},
  { label: '21th', value: 6.28},
  { label: '22th', value: 1.33},
  { label: '23th', value: 11},
  { label: '24th', value: 0.26},
  { label: '25th', value: 6.68},
  { label: '26th', value: 0.88},
  { label: '27th', value: 7.85},
  { label: '28th', value: 0.81},
  { label: '29th', value: 2.98},
  { label: '30th', value: 1.29}
  ];


var test8 = [
  { label: '0', value: 37 },
  { label: '1st', value: 22339 },
  { label: '2nd', value: 79 },
  { label: '3rd', value: 1511 },
  { label: '4th', value: 1.16 },
  { label: '5th', value: 663 },
  { label: '6th', value: 7.81 },
  { label: '7th', value: 127 },
  { label: '8th', value: 2.62 },
  { label: '9th', value: 247 },
  { label: '10th', value: 1.49 },
  { label: '11th', value: 194 },
  { label: '12th', value: 1.9},
  { label: '13th', value: 260},
  { label: '14th', value: 3.48},
  { label: '15th', value: 37},
  { label: '16th', value: 0.62},
  { label: '17th', value: 107},
  { label: '18th', value: 0.68},
  { label: '19th', value: 77.21},
  { label: '20th', value: 1.16},
  { label: '21th', value: 21.49},
  { label: '22th', value: 0.47},
  { label: '23th', value: 17.33},
  { label: '24th', value: 1.57},
  { label: '25th', value: 18},
  { label: '26th', value: 0.85},
  { label: '27th', value: 22},
  { label: '28th', value: 1.38},
  { label: '29th', value: 12},
  { label: '30th', value: 0.31}
  ];


var test9 = [
  { label: '0', value: 69 },
  { label: '1st', value: 24079 },
  { label: '2nd', value: 51 },
  { label: '3rd', value: 1700 },
  { label: '4th', value: 7.66 },
  { label: '5th', value: 684 },
  { label: '6th', value: 4.41 },
  { label: '7th', value: 131.37 },
  { label: '8th', value: 5 },
  { label: '9th', value: 276 },
  { label: '10th', value: 1.51 },
  { label: '11th', value: 205 },
  { label: '12th', value: 1.23},
  { label: '13th', value: 286},
  { label: '14th', value: 0.34},
  { label: '15th', value: 47},
  { label: '16th', value: 0.72},
  { label: '17th', value: 112},
  { label: '18th', value: 1},
  { label: '19th', value: 83},
  { label: '20th', value: 1.74},
  { label: '21th', value: 24},
  { label: '22th', value: 0.29},
  { label: '23th', value: 20},
  { label: '24th', value: 0.45},
  { label: '25th', value: 19.55},
  { label: '26th', value: 1.94},
  { label: '27th', value: 24},
  { label: '28th', value: 1.95},
  { label: '29th', value: 13.6},
  { label: '30th', value: 0.56}
  ];


var test10 = [
  { label: '0', value: 60 },
  { label: '1st', value: 24812 },
  { label: '2nd', value: 91 },
  { label: '3rd', value: 1838 },
  { label: '4th', value: 3.7 },
  { label: '5th', value: 707 },
  { label: '6th', value: 6.44 },
  { label: '7th', value: 134 },
  { label: '8th', value: 1.81 },
  { label: '9th', value: 290 },
  { label: '10th', value: 6.03 },
  { label: '11th', value: 204 },
  { label: '12th', value: 2.18},
  { label: '13th', value: 306},
  { label: '14th', value: 4.05},
  { label: '15th', value: 49},
  { label: '16th', value: 1.78},
  { label: '17th', value: 115.01},
  { label: '18th', value: 1.06},
  { label: '19th', value: 84.8},
  { label: '20th', value: 1.21},
  { label: '21th', value: 25.73},
  { label: '22th', value: 1.16},
  { label: '23th', value: 19.89},
  { label: '24th', value: 0.55},
  { label: '25th', value: 20.54},
  { label: '26th', value: 0.85},
  { label: '27th', value: 27.37},
  { label: '28th', value: 1.74},
  { label: '29th', value: 12.04},
  { label: '30th', value: 0.85}
  ];

var test11 = [
  { label: '0', value: 45 },
  { label: '1st', value: 24427 },
  { label: '2nd', value: 59 },
  { label: '3rd', value: 1878 },
  { label: '4th', value: 8.19 },
  { label: '5th', value: 680 },
  { label: '6th', value: 1.91 },
  { label: '7th', value: 140 },
  { label: '8th', value: 3.24 },
  { label: '9th', value: 283 },
  { label: '10th', value: 6.12 },
  { label: '11th', value: 190 },
  { label: '12th', value: 0.97},
  { label: '13th', value: 285},
  { label: '14th', value: 0.78},
  { label: '15th', value: 50},
  { label: '16th', value: 1.5},
  { label: '17th', value: 112},
  { label: '18th', value: 0.85},
  { label: '19th', value: 81},
  { label: '20th', value: 0.3},
  { label: '21th', value: 25},
  { label: '22th', value: 1.15},
  { label: '23th', value: 20},
  { label: '24th', value: 2.03},
  { label: '25th', value: 21},
  { label: '26th', value: 1.09},
  { label: '27th', value: 24},
  { label: '28th', value: 1.48},
  { label: '29th', value: 12.21},
  { label: '30th', value: 1.31}
  ];

var test12 = [
  { label: '0', value: 37.4 },
  { label: '1st', value: 23471 },
  { label: '2nd', value: 84 },
  { label: '3rd', value: 1843 },
  { label: '4th', value: 2.28 },
  { label: '5th', value: 637 },
  { label: '6th', value: 4.52 },
  { label: '7th', value: 125 },
  { label: '8th', value: 1.52 },
  { label: '9th', value: 262 },
  { label: '10th', value: 4.84 },
  { label: '11th', value: 170 },
  { label: '12th', value: 1.11},
  { label: '13th', value: 271},
  { label: '14th', value: 3.98},
  { label: '15th', value: 40},
  { label: '16th', value: 1.61},
  { label: '17th', value: 104},
  { label: '18th', value: 1.04},
  { label: '19th', value: 84},
  { label: '20th', value: 1.47},
  { label: '21th', value: 24},
  { label: '22th', value: 1.68},
  { label: '23th', value: 19.5},
  { label: '24th', value: 0.71},
  { label: '25th', value: 20},
  { label: '26th', value: 0.78},
  { label: '27th', value: 26},
  { label: '28th', value: 1.08},
  { label: '29th', value: 11.88},
  { label: '30th', value: 0.79}
  ];

var test13 = [
  { label: '0', value: 30 },
  { label: '1st', value: 22049 },
  { label: '2nd', value: 57 },
  { label: '3rd', value: 1762 },
  { label: '4th', value: 2.33 },
  { label: '5th', value: 605 },
  { label: '6th', value: 7.75 },
  { label: '7th', value: 99 },
  { label: '8th', value: 6.44 },
  { label: '9th', value: 278 },
  { label: '10th', value: 16 },
  { label: '11th', value: 147 },
  { label: '12th', value: 44},
  { label: '13th', value: 177},
  { label: '14th', value: 54},
  { label: '15th', value: 52},
  { label: '16th', value: 19},
  { label: '17th', value: 143},
  { label: '18th', value: 1.87},
  { label: '19th', value: 70},
  { label: '20th', value: 2.24},
  { label: '21th', value: 26},
  { label: '22th', value: 1.97},
  { label: '23th', value: 19},
  { label: '24th', value: 2.68},
  { label: '25th', value: 18},
  { label: '26th', value: 0.48},
  { label: '27th', value: 22},
  { label: '28th', value: 3.85},
  { label: '29th', value: 13},
  { label: '30th', value: 2.95}
  ];

var test14 = [
  { label: '0', value: 38 },
  { label: '1st', value: 20782 },
  { label: '2nd', value: 74 },
  { label: '3rd', value: 1658 },
  { label: '4th', value: 10 },
  { label: '5th', value: 570 },
  { label: '6th', value: 4.69 },
  { label: '7th', value: 91 },
  { label: '8th', value: 6.77 },
  { label: '9th', value: 238 },
  { label: '10th', value: 13 },
  { label: '11th', value: 164 },
  { label: '12th', value: 45},
  { label: '13th', value: 125},
  { label: '14th', value: 98},
  { label: '15th', value: 103},
  { label: '16th', value: 2.57},
  { label: '17th', value: 146},
  { label: '18th', value: 7.25},
  { label: '19th', value: 52},
  { label: '20th', value: 7.47},
  { label: '21th', value: 25},
  { label: '22th', value: 5.13},
  { label: '23th', value: 19.2},
  { label: '24th', value: 6.86},
  { label: '25th', value: 20},
  { label: '26th', value: 3.98},
  { label: '27th', value: 23},
  { label: '28th', value: 0.86},
  { label: '29th', value: 15.24},
  { label: '30th', value: 3.05}
  ];

var test15 = [
  { label: '0', value: 44 },
  { label: '1st', value: 19793 },
  { label: '2nd', value: 30 },
  { label: '3rd', value: 1567 },
  { label: '4th', value: 1.35 },
  { label: '5th', value: 551 },
  { label: '6th', value: 6 },
  { label: '7th', value: 92 },
  { label: '8th', value: 8.82 },
  { label: '9th', value: 218 },
  { label: '10th', value: 10 },
  { label: '11th', value: 154 },
  { label: '12th', value: 21},
  { label: '13th', value: 51},
  { label: '14th', value: 6},
  { label: '15th', value: 118},
  { label: '16th', value: 27},
  { label: '17th', value: 127},
  { label: '18th', value: 4.96},
  { label: '19th', value: 52},
  { label: '20th', value: 7.37},
  { label: '21th', value: 16},
  { label: '22th', value: 4.43},
  { label: '23th', value: 19},
  { label: '24th', value: 4.96},
  { label: '25th', value: 16},
  { label: '26th', value: 1.2},
  { label: '27th', value: 24},
  { label: '28th', value: 1.93},
  { label: '29th', value: 12},
  { label: '30th', value: 1.42}
  ];

var test16 = [
  { label: '0', value: 45 },
  { label: '1st', value: 18919 },
  { label: '2nd', value: 62 },
  { label: '3rd', value: 1469 },
  { label: '4th', value: 5.56 },
  { label: '5th', value: 535 },
  { label: '6th', value: 10 },
  { label: '7th', value: 93 },
  { label: '8th', value: 4.37 },
  { label: '9th', value: 219 },
  { label: '10th', value: 14 },
  { label: '11th', value: 139 },
  { label: '12th', value: 25},
  { label: '13th', value: 167},
  { label: '14th', value: 14},
  { label: '15th', value: 59},
  { label: '16th', value: 4.2},
  { label: '17th', value: 102},
  { label: '18th', value: 1.86},
  { label: '19th', value: 55},
  { label: '20th', value: 1.88},
  { label: '21th', value: 18.05},
  { label: '22th', value: 2.44},
  { label: '23th', value: 17},
  { label: '24th', value: 1.86},
  { label: '25th', value: 16},
  { label: '26th', value: 0.23},
  { label: '27th', value: 20},
  { label: '28th', value: 1.62},
  { label: '29th', value: 9.81},
  { label: '30th', value: 0.33}
  ];

var test17 = [
  { label: '0', value: 45 },
  { label: '1st', value: 18111 },
  { label: '2nd', value: 27 },
  { label: '3rd', value: 1395 },
  { label: '4th', value: 2.88 },
  { label: '5th', value: 531 },
  { label: '6th', value: 3.86 },
  { label: '7th', value: 86 },
  { label: '8th', value: 4.04 },
  { label: '9th', value: 210 },
  { label: '10th', value: 10 },
  { label: '11th', value: 139 },
  { label: '12th', value: 9.58},
  { label: '13th', value: 151},
  { label: '14th', value: 9.4},
  { label: '15th', value: 54},
  { label: '16th', value: 8.69},
  { label: '17th', value: 90},
  { label: '18th', value: 1.42},
  { label: '19th', value: 57},
  { label: '20th', value: 2.09},
  { label: '21th', value: 17},
  { label: '22th', value: 1.47},
  { label: '23th', value: 16},
  { label: '24th', value: 1.19},
  { label: '25th', value: 16},
  { label: '26th', value: 1.83},
  { label: '27th', value: 19},
  { label: '28th', value: 1.58},
  { label: '29th', value: 10},
  { label: '30th', value: 0.91}
  ];

var test18 = [
  { label: '0', value: 150 },
  { label: '1st', value: 26175 },
  { label: '2nd', value: 112 },
  { label: '3rd', value: 2387 },
  { label: '4th', value: 6.54 },
  { label: '5th', value: 669 },
  { label: '6th', value: 6.45 },
  { label: '7th', value: 139 },
  { label: '8th', value: 8.13 },
  { label: '9th', value: 328 },
  { label: '10th', value: 20 },
  { label: '11th', value: 198 },
  { label: '12th', value: 17},
  { label: '13th', value: 239},
  { label: '14th', value: 9.27},
  { label: '15th', value: 72},
  { label: '16th', value: 4.41},
  { label: '17th', value: 123},
  { label: '18th', value: 2.9},
  { label: '19th', value: 90},
  { label: '20th', value: 2.5},
  { label: '21th', value: 32},
  { label: '22th', value: 0.45},
  { label: '23th', value: 25},
  { label: '24th', value: 2.51},
  { label: '25th', value: 24},
  { label: '26th', value: 4.4},
  { label: '27th', value: 26},
  { label: '28th', value: 1.68},
  { label: '29th', value: 15},
  { label: '30th', value: 2.11}
  ];

var test19 = [
  { label: '0', value: 64 },
  { label: '1st', value: 29148 },
  { label: '2nd', value: 103 },
  { label: '3rd', value: 2680 },
  { label: '4th', value: 5.61 },
  { label: '5th', value: 731 },
  { label: '6th', value: 3.76 },
  { label: '7th', value: 149 },
  { label: '8th', value: 9.53 },
  { label: '9th', value: 366 },
  { label: '10th', value: 31 },
  { label: '11th', value: 210 },
  { label: '12th', value: 37},
  { label: '13th', value: 255},
  { label: '14th', value: 8.31},
  { label: '15th', value: 76},
  { label: '16th', value: 6.71},
  { label: '17th', value: 130},
  { label: '18th', value: 6.13},
  { label: '19th', value: 101},
  { label: '20th', value: 1.09},
  { label: '21th', value: 34.7},
  { label: '22th', value: 2.76},
  { label: '23th', value: 30},
  { label: '24th', value: 2.64},
  { label: '25th', value: 24},
  { label: '26th', value: 1.83},
  { label: '27th', value: 31},
  { label: '28th', value: 2.16},
  { label: '29th', value: 15},
  { label: '30th', value: 1.32}
  ];

var test20 = [
  { label: '0', value: 53 },
  { label: '1st', value: 28868 },
  { label: '2nd', value: 97 },
  { label: '3rd', value: 2810 },
  { label: '4th', value: 8.63 },
  { label: '5th', value: 733 },
  { label: '6th', value: 5.8 },
  { label: '7th', value: 141 },
  { label: '8th', value: 11 },
  { label: '9th', value: 382 },
  { label: '10th', value: 23 },
  { label: '11th', value: 201 },
  { label: '12th', value: 31},
  { label: '13th', value: 237},
  { label: '14th', value: 9.49},
  { label: '15th', value: 90},
  { label: '16th', value: 11.76},
  { label: '17th', value: 139},
  { label: '18th', value: 2.15},
  { label: '19th', value: 98},
  { label: '20th', value: 2.12},
  { label: '21th', value: 39},
  { label: '22th', value: 0.65},
  { label: '23th', value: 27},
  { label: '24th', value: 1.32},
  { label: '25th', value: 25},
  { label: '26th', value: 2.25},
  { label: '27th', value: 32},
  { label: '28th', value: 1.38},
  { label: '29th', value: 16.62},
  { label: '30th', value: 3.87}
  ];

var test21 = [
  { label: '0', value: 45 },
  { label: '1st', value: 28666 },
  { label: '2nd', value: 135 },
  { label: '3rd', value: 2827 },
  { label: '4th', value: 5.4 },
  { label: '5th', value: 728 },
  { label: '6th', value: 5.23 },
  { label: '7th', value: 150 },
  { label: '8th', value: 3.92 },
  { label: '9th', value: 364 },
  { label: '10th', value: 22 },
  { label: '11th', value: 189 },
  { label: '12th', value: 49},
  { label: '13th', value: 180},
  { label: '14th', value: 36},
  { label: '15th', value: 118},
  { label: '16th', value: 24},
  { label: '17th', value: 157},
  { label: '18th', value: 12},
  { label: '19th', value: 81},
  { label: '20th', value: 1.34},
  { label: '21th', value: 31},
  { label: '22th', value: 5.84},
  { label: '23th', value: 24},
  { label: '24th', value: 2.53},
  { label: '25th', value: 20},
  { label: '26th', value: 3.19},
  { label: '27th', value: 29.51},
  { label: '28th', value: 2.59},
  { label: '29th', value: 16.43},
  { label: '30th', value: 3.6}
  ];

var test22 = [
  { label: '0', value: 39 },
  { label: '1st', value: 28031 },
  { label: '2nd', value: 80 },
  { label: '3rd', value: 2812 },
  { label: '4th', value: 5.08 },
  { label: '5th', value: 736 },
  { label: '6th', value: 13 },
  { label: '7th', value: 159 },
  { label: '8th', value: 0.27 },
  { label: '9th', value: 362 },
  { label: '10th', value: 22 },
  { label: '11th', value: 184 },
  { label: '12th', value: 18},
  { label: '13th', value: 95},
  { label: '14th', value: 63},
  { label: '15th', value: 103},
  { label: '16th', value: 23},
  { label: '17th', value: 164},
  { label: '18th', value: 14},
  { label: '19th', value: 82},
  { label: '20th', value: 8.41},
  { label: '21th', value: 31},
  { label: '22th', value: 5.79},
  { label: '23th', value: 23},
  { label: '24th', value: 1.84},
  { label: '25th', value: 26},
  { label: '26th', value: 0.38},
  { label: '27th', value: 28},
  { label: '28th', value: 2.95},
  { label: '29th', value: 15},
  { label: '30th', value: 2.85}
  ];

var test23 = [
  { label: '0', value: 39 },
  { label: '1st', value: 26780 },
  { label: '2nd', value: 118 },
  { label: '3rd', value: 2732 },
  { label: '4th', value: 6.25 },
  { label: '5th', value: 702 },
  { label: '6th', value: 5.23 },
  { label: '7th', value: 156 },
  { label: '8th', value: 19 },
  { label: '9th', value: 364 },
  { label: '10th', value: 7.64 },
  { label: '11th', value: 181 },
  { label: '12th', value: 35},
  { label: '13th', value: 168},
  { label: '14th', value: 93},
  { label: '15th', value: 125},
  { label: '16th', value: 17},
  { label: '17th', value: 149},
  { label: '18th', value: 20},
  { label: '19th', value: 81},
  { label: '20th', value: 10},
  { label: '21th', value: 35},
  { label: '22th', value: 8.13},
  { label: '23th', value: 25},
  { label: '24th', value: 7.67},
  { label: '25th', value: 23.92},
  { label: '26th', value: 3.25},
  { label: '27th', value: 26.37},
  { label: '28th', value: 5.67},
  { label: '29th', value: 17.36},
  { label: '30th', value: 0.46}
  ];

var test24 = [
  { label: '0', value: 37 },
  { label: '1st', value: 25408 },
  { label: '2nd', value: 58 },
  { label: '3rd', value: 2636 },
  { label: '4th', value: 12 },
  { label: '5th', value: 665 },
  { label: '6th', value: 12 },
  { label: '7th', value: 162 },
  { label: '8th', value: 0.9 },
  { label: '9th', value: 326 },
  { label: '10th', value: 5.88 },
  { label: '11th', value: 171 },
  { label: '12th', value: 74},
  { label: '13th', value: 77},
  { label: '14th', value: 136},
  { label: '15th', value: 111},
  { label: '16th', value: 4.15},
  { label: '17th', value: 168},
  { label: '18th', value: 20},
  { label: '19th', value: 70},
  { label: '20th', value: 1.05},
  { label: '21th', value: 31},
  { label: '22th', value: 7.39},
  { label: '23th', value: 26},
  { label: '24th', value: 8},
  { label: '25th', value: 19},
  { label: '26th', value: 1.73},
  { label: '27th', value: 28},
  { label: '28th', value: 3.43},
  { label: '29th', value: 18.19},
  { label: '30th', value: 2.43}
  ];

var test25 = [
  { label: '0', value: 42 },
  { label: '1st', value: 24362 },
  { label: '2nd', value: 98 },
  { label: '3rd', value: 2540 },
  { label: '4th', value: 4.07 },
  { label: '5th', value: 661 },
  { label: '6th', value: 8.18 },
  { label: '7th', value: 148 },
  { label: '8th', value: 2.61 },
  { label: '9th', value: 300 },
  { label: '10th', value: 3.45 },
  { label: '11th', value: 150 },
  { label: '12th', value: 3.39},
  { label: '13th', value: 278},
  { label: '14th', value: 3.97},
  { label: '15th', value: 72.6},
  { label: '16th', value: 2.39},
  { label: '17th', value: 120},
  { label: '18th', value: 1.47},
  { label: '19th', value: 79},
  { label: '20th', value: 2.31},
  { label: '21th', value: 37},
  { label: '22th', value: 0.69},
  { label: '23th', value: 24},
  { label: '24th', value: 1.08},
  { label: '25th', value: 22},
  { label: '26th', value: 0.6},
  { label: '27th', value: 30},
  { label: '28th', value: 1.44},
  { label: '29th', value: 15.54},
  { label: '30th', value: 0.31}
  ];

var test26 = [
  { label: '0', value: 40 },
  { label: '1st', value: 23602 },
  { label: '2nd', value: 40 },
  { label: '3rd', value: 2466 },
  { label: '4th', value: 6.48 },
  { label: '5th', value: 653 },
  { label: '6th', value: 7.65 },
  { label: '7th', value: 150 },
  { label: '8th', value: 3.35 },
  { label: '9th', value: 288 },
  { label: '10th', value: 3.71 },
  { label: '11th', value: 141 },
  { label: '12th', value: 2.33},
  { label: '13th', value: 274},
  { label: '14th', value: 3.25},
  { label: '15th', value: 72},
  { label: '16th', value: 2.59},
  { label: '17th', value: 118},
  { label: '18th', value: 2.96},
  { label: '19th', value: 79},
  { label: '20th', value: 1.57},
  { label: '21th', value: 34},
  { label: '22th', value: 0.44},
  { label: '23th', value: 23.5},
  { label: '24th', value: 0.79},
  { label: '25th', value: 20},
  { label: '26th', value: 1.53},
  { label: '27th', value: 27},
  { label: '28th', value: 1.81},
  { label: '29th', value: 15.42 },
  { label: '30th', value: 2.29}
  ];

var test27 = [
  { label: '0', value: 44 },
  { label: '1st', value: 22967 },
  { label: '2nd', value: 90 },
  { label: '3rd', value: 2394 },
  { label: '4th', value: 3.94 },
  { label: '5th', value: 641 },
  { label: '6th', value: 8.65 },
  { label: '7th', value: 151 },
  { label: '8th', value: 2.63 },
  { label: '9th', value: 274 },
  { label: '10th', value: 1.31 },
  { label: '11th', value: 135 },
  { label: '12th', value: 1.56},
  { label: '13th', value: 275},
  { label: '14th', value: 0.31},
  { label: '15th', value: 69.5},
  { label: '16th', value: 1.03},
  { label: '17th', value: 111},
  { label: '18th', value: 1.27},
  { label: '19th', value: 73},
  { label: '20th', value: 1.27},
  { label: '21th', value: 32},
  { label: '22th', value: 1.22},
  { label: '23th', value: 21.71},
  { label: '24th', value: 0.59},
  { label: '25th', value: 19.6},
  { label: '26th', value: 1.72},
  { label: '27th', value: 25},
  { label: '28th', value: 2.04},
  { label: '29th', value: 15.2 },
  { label: '30th', value: 0.76}
  ];

var test28 = [
  { label: '0', value: 47 },
  { label: '1st', value: 22447 },
  { label: '2nd', value: 30 },
  { label: '3rd', value: 2347 },
  { label: '4th', value: 5.22 },
  { label: '5th', value: 627 },
  { label: '6th', value: 5.71 },
  { label: '7th', value: 157 },
  { label: '8th', value: 1.8 },
  { label: '9th', value: 270 },
  { label: '10th', value: 3.88 },
  { label: '11th', value: 129 },
  { label: '12th', value: 0.78},
  { label: '13th', value: 273},
  { label: '14th', value: 0.72},
  { label: '15th', value: 69.73},
  { label: '16th', value: 1.41},
  { label: '17th', value: 110},
  { label: '18th', value: 0.33},
  { label: '19th', value: 74.4},
  { label: '20th', value: 1.53},
  { label: '21th', value: 31},
  { label: '22th', value: 0.53},
  { label: '23th', value: 24},
  { label: '24th', value: 2.21},
  { label: '25th', value: 20.5},
  { label: '26th', value: 1.12},
  { label: '27th', value: 27},
  { label: '28th', value: 0.16},
  { label: '29th', value: 15.14 },
  { label: '30th', value: 0.87}
  ];

var test29 = [
  { label: '0', value: 43 },
  { label: '1st', value: 21987 },
  { label: '2nd', value: 80 },
  { label: '3rd', value: 2299 },
  { label: '4th', value: 6.75 },
  { label: '5th', value: 623 },
  { label: '6th', value: 5.61 },
  { label: '7th', value: 146 },
  { label: '8th', value: 2.8 },
  { label: '9th', value: 259 },
  { label: '10th', value: 3.79 },
  { label: '11th', value: 125 },
  { label: '12th', value: 1.04},
  { label: '13th', value: 270},
  { label: '14th', value: 4.95},
  { label: '15th', value: 68.27},
  { label: '16th', value: 1.36},
  { label: '17th', value: 109},
  { label: '18th', value: 0.95},
  { label: '19th', value: 72},
  { label: '20th', value: 0.92},
  { label: '21th', value: 32},
  { label: '22th', value: 1.89},
  { label: '23th', value: 22},
  { label: '24th', value: 1.07},
  { label: '25th', value: 17},
  { label: '26th', value: 1.96},
  { label: '27th', value: 28.17},
  { label: '28th', value: 0.26},
  { label: '29th', value: 14.58 },
  { label: '30th', value: 0.25}
  ];

var test30 = [
  { label: '0', value: 47.6 },
  { label: '1st', value: 21667 },
  { label: '2nd', value: 24 },
  { label: '3rd', value: 2282 },
  { label: '4th', value: 4.8 },
  { label: '5th', value: 629 },
  { label: '6th', value: 2.96 },
  { label: '7th', value: 148 },
  { label: '8th', value: 1.41 },
  { label: '9th', value: 244 },
  { label: '10th', value: 3.23 },
  { label: '11th', value: 132 },
  { label: '12th', value: 2.05},
  { label: '13th', value: 266},
  { label: '14th', value: 1.71},
  { label: '15th', value: 63},
  { label: '16th', value: 0.32},
  { label: '17th', value: 98},
  { label: '18th', value: 0.8},
  { label: '19th', value: 76},
  { label: '20th', value: 0.96},
  { label: '21th', value: 34},
  { label: '22th', value: 1.43},
  { label: '23th', value: 19},
  { label: '24th', value: 1.29},
  { label: '25th', value: 19},
  { label: '26th', value: 2.9},
  { label: '27th', value: 25},
  { label: '28th', value: 1.18},
  { label: '29th', value: 12.9 },
  { label: '30th', value: 2.13}
  ];

var test31 = [
  { label: '0', value: 53 },
  { label: '1st', value: 35232 },
  { label: '2nd', value: 281 },
  { label: '3rd', value: 2409 },
  { label: '4th', value: 36 },
  { label: '5th', value: 1117 },
  { label: '6th', value: 9.99 },
  { label: '7th', value: 198 },
  { label: '8th', value: 3.76 },
  { label: '9th', value: 389 },
  { label: '10th', value: 8.71 },
  { label: '11th', value: 268 },
  { label: '12th', value: 2.09},
  { label: '13th', value: 379},
  { label: '14th', value: 3.5},
  { label: '15th', value: 84.76},
  { label: '16th', value: 4.39},
  { label: '17th', value: 168},
  { label: '18th', value: 1.21},
  { label: '19th', value: 128},
  { label: '20th', value: 2.34},
  { label: '21th', value: 36.76},
  { label: '22th', value: 1.77},
  { label: '23th', value: 17.26},
  { label: '24th', value: 3.38},
  { label: '25th', value: 33.59},
  { label: '26th', value: 1.09},
  { label: '27th', value: 32.48},
  { label: '28th', value: 1.38},
  { label: '29th', value: 19.16 },
  { label: '30th', value: 0.8}
  ];

var test32 = [
  { label: '0', value: 26 },
  { label: '1st', value: 40570 },
  { label: '2nd', value: 143 },
  { label: '3rd', value: 4712 },
  { label: '4th', value: 120 },
  { label: '5th', value: 1690 },
  { label: '6th', value: 97 },
  { label: '7th', value: 1375 },
  { label: '8th', value: 76 },
  { label: '9th', value: 965 },
  { label: '10th', value: 57 },
  { label: '11th', value: 169 },
  { label: '12th', value: 38},
  { label: '13th', value: 629},
  { label: '14th', value: 24},
  { label: '15th', value: 248},
  { label: '16th', value: 25},
  { label: '17th', value: 167},
  { label: '18th', value: 24},
  { label: '19th', value: 146},
  { label: '20th', value: 21},
  { label: '21th', value: 31},
  { label: '22th', value: 21},
  { label: '23th', value: 97},
  { label: '24th', value: 22},
  { label: '25th', value: 49},
  { label: '26th', value: 27},
  { label: '27th', value: 46},
  { label: '28th', value: 28},
  { label: '29th', value: 57 },
  { label: '30th', value: 26}
  ];

var test33 = [
  { label: '0', value: 74 },
  { label: '1st', value: 46170 },
  { label: '2nd', value: 276 },
  { label: '3rd', value: 4960 },
  { label: '4th', value: 47 },
  { label: '5th', value: 1314 },
  { label: '6th', value: 14 },
  { label: '7th', value: 357 },
  { label: '8th', value: 7.11 },
  { label: '9th', value: 521 },
  { label: '10th', value: 1.84 },
  { label: '11th', value: 236 },
  { label: '12th', value: 0.75},
  { label: '13th', value: 384},
  { label: '14th', value: 6.58},
  { label: '15th', value: 183},
  { label: '16th', value: 1.97},
  { label: '17th', value: 190},
  { label: '18th', value: 9.63},
  { label: '19th', value: 155},
  { label: '20th', value: 7.97},
  { label: '21th', value: 57},
  { label: '22th', value: 7.91},
  { label: '23th', value: 25},
  { label: '24th', value: 11},
  { label: '25th', value: 15},
  { label: '26th', value: 11},
  { label: '27th', value: 64},
  { label: '28th', value: 4.11},
  { label: '29th', value: 15 },
  { label: '30th', value: 3.28}
  ];

var test34 = [
  { label: '0', value: 43 },
  { label: '1st', value: 43491 },
  { label: '2nd', value: 211 },
  { label: '3rd', value: 4256 },
  { label: '4th', value: 67 },
  { label: '5th', value: 1205 },
  { label: '6th', value: 22 },
  { label: '7th', value: 344 },
  { label: '8th', value: 1.67 },
  { label: '9th', value: 505 },
  { label: '10th', value: 7.75 },
  { label: '11th', value: 234 },
  { label: '12th', value: 4.22},
  { label: '13th', value: 385},
  { label: '14th', value: 3.28},
  { label: '15th', value: 161},
  { label: '16th', value: 3.68},
  { label: '17th', value: 188},
  { label: '18th', value: 4.12},
  { label: '19th', value: 145},
  { label: '20th', value: 1.39},
  { label: '21th', value: 57},
  { label: '22th', value: 1.49},
  { label: '23th', value: 12},
  { label: '24th', value: 1.84},
  { label: '25th', value: 9.36},
  { label: '26th', value: 1.57},
  { label: '27th', value: 62},
  { label: '28th', value: 0.31},
  { label: '29th', value: 14.04},
  { label: '30th', value: 2.04}
  ];

var test35 = [
  { label: '0', value: 81 },
  { label: '1st', value: 43140 },
  { label: '2nd', value: 331 },
  { label: '3rd', value: 4272 },
  { label: '4th', value: 108 },
  { label: '5th', value: 1169 },
  { label: '6th', value: 48 },
  { label: '7th', value: 341 },
  { label: '8th', value: 13 },
  { label: '9th', value: 515 },
  { label: '10th', value: 8.14 },
  { label: '11th', value: 232 },
  { label: '12th', value: 3.63},
  { label: '13th', value: 393},
  { label: '14th', value: 2.42},
  { label: '15th', value: 157},
  { label: '16th', value: 3.98},
  { label: '17th', value: 184},
  { label: '18th', value: 5.75},
  { label: '19th', value: 146},
  { label: '20th', value: 1.58},
  { label: '21th', value: 53},
  { label: '22th', value: 1.31},
  { label: '23th', value: 11.36},
  { label: '24th', value: 1.73},
  { label: '25th', value: 6.68},
  { label: '26th', value: 3.36},
  { label: '27th', value: 58},
  { label: '28th', value: 0.26},
  { label: '29th', value: 8.87},
  { label: '30th', value: 2.03}
  ];

var test36 = [
  { label: '0', value: 48 },
  { label: '1st', value: 42791 },
  { label: '2nd', value: 621 },
  { label: '3rd', value: 4685 },
  { label: '4th', value: 326 },
  { label: '5th', value: 901 },
  { label: '6th', value: 182 },
  { label: '7th', value: 412 },
  { label: '8th', value: 80 },
  { label: '9th', value: 539 },
  { label: '10th', value: 17 },
  { label: '11th', value: 224 },
  { label: '12th', value: 19},
  { label: '13th', value: 356},
  { label: '14th', value: 9.06},
  { label: '15th', value: 168},
  { label: '16th', value: 3.43},
  { label: '17th', value: 180},
  { label: '18th', value: 4.85},
  { label: '19th', value: 145},
  { label: '20th', value: 3.06},
  { label: '21th', value: 56},
  { label: '22th', value: 7.5},
  { label: '23th', value: 4.56},
  { label: '24th', value: 1.19},
  { label: '25th', value: 3.74},
  { label: '26th', value: 5.86},
  { label: '27th', value: 57.78},
  { label: '28th', value: 5.5},
  { label: '29th', value: 11.75},
  { label: '30th', value: 4.28}
  ];

var test37 = [
  { label: '0', value: 207 },
  { label: '1st', value: 43352 },
  { label: '2nd', value: 136 },
  { label: '3rd', value: 4025 },
  { label: '4th', value: 32 },
  { label: '5th', value: 1232 },
  { label: '6th', value: 12 },
  { label: '7th', value: 306 },
  { label: '8th', value: 3 },
  { label: '9th', value: 501 },
  { label: '10th', value: 7 },
  { label: '11th', value: 240 },
  { label: '12th', value: 5.29},
  { label: '13th', value: 362},
  { label: '14th', value: 5.58},
  { label: '15th', value: 167},
  { label: '16th', value: 2.08},
  { label: '17th', value: 173},
  { label: '18th', value: 3.59},
  { label: '19th', value: 148},
  { label: '20th', value: 3.5},
  { label: '21th', value: 51},
  { label: '22th', value: 4.36},
  { label: '23th', value: 7.57},
  { label: '24th', value: 1.36},
  { label: '25th', value: 4.15},
  { label: '26th', value: 2.8},
  { label: '27th', value: 55},
  { label: '28th', value: 1.89},
  { label: '29th', value: 13.57},
  { label: '30th', value: 4.03}
  ];

var test38 = [
  { label: '0', value: 124 },
  { label: '1st', value: 42666 },
  { label: '2nd', value: 762 },
  { label: '3rd', value: 4785 },
  { label: '4th', value: 432 },
  { label: '5th', value: 804 },
  { label: '6th', value: 247 },
  { label: '7th', value: 439 },
  { label: '8th', value: 92 },
  { label: '9th', value: 555 },
  { label: '10th', value: 25 },
  { label: '11th', value: 237 },
  { label: '12th', value: 14},
  { label: '13th', value: 348},
  { label: '14th', value: 27},
  { label: '15th', value: 188},
  { label: '16th', value: 15},
  { label: '17th', value: 175},
  { label: '18th', value: 6.96},
  { label: '19th', value: 142},
  { label: '20th', value: 13.46},
  { label: '21th', value: 53},
  { label: '22th', value: 8.51},
  { label: '23th', value: 11.28},
  { label: '24th', value: 3.53},
  { label: '25th', value: 1.7},
  { label: '26th', value: 4.05},
  { label: '27th', value: 54},
  { label: '28th', value: 2.02},
  { label: '29th', value: 13.83},
  { label: '30th', value: 6.68}
  ];

var test39 = [
  { label: '0', value: 11 },
  { label: '1st', value: 42970 },
  { label: '2nd', value: 670 },
  { label: '3rd', value: 4435 },
  { label: '4th', value: 322 },
  { label: '5th', value: 1021 },
  { label: '6th', value: 148 },
  { label: '7th', value: 329 },
  { label: '8th', value: 58 },
  { label: '9th', value: 538 },
  { label: '10th', value: 25 },
  { label: '11th', value: 220 },
  { label: '12th', value: 15},
  { label: '13th', value: 360},
  { label: '14th', value: 16.14},
  { label: '15th', value: 167},
  { label: '16th', value: 14},
  { label: '17th', value: 172},
  { label: '18th', value: 5.71},
  { label: '19th', value: 142},
  { label: '20th', value: 2.93},
  { label: '21th', value: 53.53},
  { label: '22th', value: 1.64},
  { label: '23th', value: 7.08},
  { label: '24th', value: 4.08},
  { label: '25th', value: 2.02},
  { label: '26th', value: 4.35},
  { label: '27th', value: 62.62},
  { label: '28th', value: 3.41},
  { label: '29th', value: 18},
  { label: '30th', value: 4.23}
  ];

var test40 = [
  { label: '0', value: 239 },
  { label: '1st', value: 42752 },
  { label: '2nd', value: 822 },
  { label: '3rd', value: 4667 },
  { label: '4th', value: 491 },
  { label: '5th', value: 882 },
  { label: '6th', value: 256 },
  { label: '7th', value: 446 },
  { label: '8th', value: 100 },
  { label: '9th', value: 550 },
  { label: '10th', value: 17 },
  { label: '11th', value: 214 },
  { label: '12th', value: 11},
  { label: '13th', value: 361},
  { label: '14th', value: 20},
  { label: '15th', value: 170},
  { label: '16th', value: 7.5},
  { label: '17th', value: 175},
  { label: '18th', value: 10},
  { label: '19th', value: 139},
  { label: '20th', value: 10},
  { label: '21th', value: 53},
  { label: '22th', value: 9.5},
  { label: '23th', value: 3.22},
  { label: '24th', value: 6.77},
  { label: '25th', value: 3.68},
  { label: '26th', value: 3.32},
  { label: '27th', value: 58.91},
  { label: '28th', value: 2.61},
  { label: '29th', value: 14.12},
  { label: '30th', value: 1.92}
  ];
var test50 = [test0,test1,test2,test3,test4,test5,test6,test7,test8,test9,
test10,test11,test12,test13,test14,test15,test16,test17,test18,test19,test20,
test21,test22,test23,test24,test25,test26,test27,test28,test29,test30,
test31,test32,test33,test34,test35,test36,test37,test38,test39,test40
];


reset();
index = 0;
intervalID3 = setInterval(change,4000)


chart.start();

function change(){
  chart.populate(test50[index++])
  index %= test50.length;
}

function stop3(){
   clearInterval(intervalID3)
}
function append() {
  chart.append([
    { label: 'Rnd', value: 1300 + ( Math.random() * 1500 ) }
  ]);
}



function restart() {
  chart.restart();
}

function reset() {
  chart.populate(test50[0]
    
  );
}

