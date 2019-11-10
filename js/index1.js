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
    { label: '0', value: 10 },
    { label: '1st', value: 346890 },
    { label: '2nd', value: 48 },
    { label: '3rd', value: 2698 },
    { label: '4th', value: 22 },
    { label: '5th', value: 9358 },
    { label: '6th', value: 43 },
    { label: '7th', value: 2089 },
    { label: '8th', value: 20 },
    { label: '9th', value: 3156 },
    { label: '10th', value: 24 },
    { label: '11th', value: 2458 },
    { label: '12th', value: 23},
    { label: '13th', value: 3622},
    { label: '14th', value: 53},
    { label: '15th', value: 892},
    { label: '16th', value: 13},
    { label: '17th', value: 1567},
    { label: '18th', value: 26},
    { label: '19th', value: 1268},
    { label: '20th', value: 21},
    { label: '21th', value: 271},
    { label: '22th', value: 2.14},
    { label: '23th', value: 283},
    { label: '24th', value: 3.57},
    { label: '25th', value: 211},
    { label: '26th', value: 5.77},
    { label: '27th', value: 281},
    { label: '28th', value: 8.16},
    { label: '29th', value: 135},
    { label: '30th', value: 7.49}
  ];

var test1 = [
  { label: '0', value: 10 },
{ label: '1st', value: 346843 },
{ label: '2nd', value: 20 },
{ label: '3rd', value: 2759 },
{ label: '4th', value: 12 },
{ label: '5th', value: 9517 },
{ label: '6th', value: 22 },
{ label: '7th', value: 1403 },
{ label: '8th', value: 25 },
{ label: '9th', value: 3194 },
{ label: '10th', value: 30 },
{ label: '11th', value: 2204 },
{ label: '12th', value: 61.94},
{ label: '13th', value: 3141},
{ label: '14th', value: 79},
{ label: '15th', value: 956},
{ label: '16th', value: 47},
{ label: '17th', value: 1435},
{ label: '18th', value: 45},
{ label: '19th', value: 1250},
{ label: '20th', value: 17},
{ label: '21th', value: 252},
{ label: '22th', value: 1.81},
{ label: '23th', value: 254},
{ label: '24th', value: 15},
{ label: '25th', value: 210},
{ label: '26th', value: 8.16},
{ label: '27th', value: 279},
{ label: '28th', value: 14},
{ label: '29th', value: 152},
{ label: '30th', value: 16.84}
  ]; 
  var test2 = [
  { label: '0', value: 12 },
  { label: '1st', value: 348636 },
  { label: '2nd', value: 100 },
  { label: '3rd', value: 2640 },
  { label: '4th', value: 95 },
  { label: '5th', value: 9640 },
  { label: '6th', value: 60 },
  { label: '7th', value: 1567 },
  { label: '8th', value: 38 },
  { label: '9th', value: 3183 },
  { label: '10th', value: 21 },
  { label: '11th', value: 2326 },
  { label: '12th', value: 9},
  { label: '13th', value: 3509},
  { label: '14th', value: 98},
  { label: '15th', value: 964},
  { label: '16th', value: 18},
  { label: '17th', value: 1467},
  { label: '18th', value: 33},
  { label: '19th', value: 1341},
  { label: '20th', value: 14},
  { label: '21th', value: 243},
  { label: '22th', value: 14},
  { label: '23th', value: 272},
  { label: '24th', value: 7},
  { label: '25th', value: 208},
  { label: '26th', value: 7},
  { label: '27th', value: 278},
  { label: '28th', value: 8},
  { label: '29th', value: 156},
  { label: '30th', value: 7.67}
    ];
var test3 = [
      { label: '0', value: 12 },
      { label: '1st', value: 348505 },
      { label: '2nd', value: 89 },
      { label: '3rd', value: 2606 },
      { label: '4th', value: 65 },
      { label: '5th', value: 9540 },
      { label: '6th', value: 71 },
      { label: '7th', value: 1553 },
      { label: '8th', value: 31 },
      { label: '9th', value: 3280 },
      { label: '10th', value: 27 },
      { label: '11th', value: 2273 },
      { label: '12th', value: 77},
      { label: '13th', value: 3513},
      { label: '14th', value: 26},
      { label: '15th', value: 951},
      { label: '16th', value: 19},
      { label: '17th', value: 1459},
      { label: '18th', value: 8},
      { label: '19th', value: 1352},
      { label: '20th', value: 8.91},
      { label: '21th', value: 259},
      { label: '22th', value: 9.25},
      { label: '23th', value: 300},
      { label: '24th', value: 7.55},
      { label: '25th', value: 211},
      { label: '26th', value: 12},
      { label: '27th', value: 300},
      { label: '28th', value: 12},
      { label: '29th', value: 149},
      { label: '30th', value: 10}
        ];
var test4 = [
  { label: '0', value: 8 },
  { label: '1st', value: 348952 },
  { label: '2nd', value: 28 },
  { label: '3rd', value: 2671 },
  { label: '4th', value: 8 },
  { label: '5th', value: 9384 },
  { label: '6th', value: 9.57 },
  { label: '7th', value: 1606 },
  { label: '8th', value: 14 },
  { label: '9th', value: 3295 },
  { label: '10th', value: 37 },
  { label: '11th', value: 2427 },
  { label: '12th', value: 19},
  { label: '13th', value: 3695},
  { label: '14th', value: 50},
  { label: '15th', value: 941},
  { label: '16th', value: 25},
  { label: '17th', value: 1493},
  { label: '18th', value: 14},
  { label: '19th', value: 1359},
  { label: '20th', value: 17},
  { label: '21th', value: 237},
  { label: '22th', value: 8.5},
  { label: '23th', value: 277},
  { label: '24th', value: 4.03},
  { label: '25th', value: 210},
  { label: '26th', value: 1.65},
  { label: '27th', value: 268},
  { label: '28th', value: 14},
  { label: '29th', value: 139},
  { label: '30th', value: 8.44}
  ];

var test5 = [
  { label: '0', value: 13 },
  { label: '1st', value: 348882 },
  { label: '2nd', value: 90 },
  { label: '3rd', value: 2570 },
  { label: '4th', value: 7 },
  { label: '5th', value: 9926 },
  { label: '6th', value: 102 },
  { label: '7th', value: 1850 },
  { label: '8th', value: 116 },
  { label: '9th', value: 3393 },
  { label: '10th', value: 88.27 },
  { label: '11th', value: 2182 },
  { label: '12th', value: 457},
  { label: '13th', value: 2508},
  { label: '14th', value: 409},
  { label: '15th', value: 1369},
  { label: '16th', value: 109},
  { label: '17th', value: 1429},
  { label: '18th', value: 33},
  { label: '19th', value: 1300},
  { label: '20th', value: 33},
  { label: '21th', value: 279},
  { label: '22th', value: 30},
  { label: '23th', value: 268},
  { label: '24th', value: 11},
  { label: '25th', value: 213},
  { label: '26th', value: 18},
  { label: '27th', value: 252},
  { label: '28th', value: 32},
  { label: '29th', value: 140},
  { label: '30th', value: 4.2}
  ];

var test6 = [
  { label: '0', value: 4.69 },
  { label: '1st', value: 348957 },
  { label: '2nd', value: 41 },
  { label: '3rd', value: 2329 },
  { label: '4th', value: 20 },
  { label: '5th', value: 10690 },
  { label: '6th', value: 15 },
  { label: '7th', value: 1307 },
  { label: '8th', value: 10 },
  { label: '9th', value: 3318 },
  { label: '10th', value: 20 },
  { label: '11th', value: 2374 },
  { label: '12th', value: 63},
  { label: '13th', value: 3480},
  { label: '14th', value: 48},
  { label: '15th', value: 887},
  { label: '16th', value: 8},
  { label: '17th', value: 1373},
  { label: '18th', value: 11},
  { label: '19th', value: 1347},
  { label: '20th', value: 11},
  { label: '21th', value: 183},
  { label: '22th', value: 4.61},
  { label: '23th', value: 263},
  { label: '24th', value: 10},
  { label: '25th', value: 218},
  { label: '26th', value: 2.9},
  { label: '27th', value: 248},
  { label: '28th', value: 7.81},
  { label: '29th', value: 128},
  { label: '30th', value: 13.63}
  ];

var test7 = [
  { label: '0', value: 12 },
  { label: '1st', value: 348373 },
  { label: '2nd', value: 18 },
  { label: '3rd', value: 2144 },
  { label: '4th', value: 45 },
  { label: '5th', value: 9462 },
  { label: '6th', value: 46 },
  { label: '7th', value: 2338 },
  { label: '8th', value: 20 },
  { label: '9th', value: 3096 },
  { label: '10th', value: 10 },
  { label: '11th', value: 2319 },
  { label: '12th', value: 27},
  { label: '13th', value: 3707},
  { label: '14th', value: 49},
  { label: '15th', value: 791},
  { label: '16th', value: 31},
  { label: '17th', value: 1513},
  { label: '18th', value: 27},
  { label: '19th', value: 1310},
  { label: '20th', value: 20},
  { label: '21th', value: 255},
  { label: '22th', value: 4.9},
  { label: '23th', value: 273},
  { label: '24th', value: 10},
  { label: '25th', value: 229},
  { label: '26th', value: 10},
  { label: '27th', value: 256},
  { label: '28th', value: 11},
  { label: '29th', value: 129},
  { label: '30th', value: 9.02}
  ];


var test8 = [
  { label: '0', value: 16 },
  { label: '1st', value: 347754 },
  { label: '2nd', value: 37 },
  { label: '3rd', value: 2340 },
  { label: '4th', value: 42 },
  { label: '5th', value: 10456 },
  { label: '6th', value: 42 },
  { label: '7th', value: 1826 },
  { label: '8th', value: 22 },
  { label: '9th', value: 3252 },
  { label: '10th', value: 17 },
  { label: '11th', value: 2572 },
  { label: '12th', value: 25},
  { label: '13th', value: 3812},
  { label: '14th', value: 65},
  { label: '15th', value: 811},
  { label: '16th', value: 23},
  { label: '17th', value: 1522},
  { label: '18th', value: 30},
  { label: '19th', value: 1382},
  { label: '20th', value: 19},
  { label: '21th', value: 154},
  { label: '22th', value: 3.37},
  { label: '23th', value: 188},
  { label: '24th', value: 12},
  { label: '25th', value: 239},
  { label: '26th', value: 6.54},
  { label: '27th', value: 238},
  { label: '28th', value: 6.4},
  { label: '29th', value: 160},
  { label: '30th', value: 6.22}
  ];


var test9 = [
  { label: '0', value: 0.08 },
  { label: '1st', value: 347809 },
  { label: '2nd', value: 38 },
  { label: '3rd', value: 2361 },
  { label: '4th', value: 53 },
  { label: '5th', value: 10359 },
  { label: '6th', value: 33 },
  { label: '7th', value: 1811 },
  { label: '8th', value: 12 },
  { label: '9th', value: 3264 },
  { label: '10th', value: 17 },
  { label: '11th', value: 2600 },
  { label: '12th', value: 47},
  { label: '13th', value: 3829},
  { label: '14th', value: 42},
  { label: '15th', value: 815},
  { label: '16th', value: 22},
  { label: '17th', value: 1501},
  { label: '18th', value: 33},
  { label: '19th', value: 1390},
  { label: '20th', value: 19},
  { label: '21th', value: 171},
  { label: '22th', value: 8.53},
  { label: '23th', value: 192},
  { label: '24th', value: 12},
  { label: '25th', value: 244},
  { label: '26th', value: 9.59},
  { label: '27th', value: 244},
  { label: '28th', value: 18},
  { label: '29th', value: 146},
  { label: '30th', value: 13.66}
  ];


var test10 = [
  { label: '0', value: 1.75 },
  { label: '1st', value: 348030 },
  { label: '2nd', value: 49 },
  { label: '3rd', value: 2402 },
  { label: '4th', value: 24 },
  { label: '5th', value: 10439 },
  { label: '6th', value: 19 },
  { label: '7th', value: 1775 },
  { label: '8th', value: 3.87 },
  { label: '9th', value: 3288 },
  { label: '10th', value: 58 },
  { label: '11th', value: 2570 },
  { label: '12th', value: 49},
  { label: '13th', value: 3922},
  { label: '14th', value: 55},
  { label: '15th', value: 864},
  { label: '16th', value: 34},
  { label: '17th', value: 1473},
  { label: '18th', value: 28},
  { label: '19th', value: 1363},
  { label: '20th', value: 20},
  { label: '21th', value: 166},
  { label: '22th', value: 14},
  { label: '23th', value: 175},
  { label: '24th', value: 9},
  { label: '25th', value: 246},
  { label: '26th', value: 11},
  { label: '27th', value: 234},
  { label: '28th', value: 7},
  { label: '29th', value: 142},
  { label: '30th', value: 7.67}
  ];

var test11 = [
  { label: '0', value: 10 },
  { label: '1st', value: 348049 },
  { label: '2nd', value: 6.17 },
  { label: '3rd', value: 2409 },
  { label: '4th', value: 44 },
  { label: '5th', value: 10217 },
  { label: '6th', value: 32 },
  { label: '7th', value: 1747 },
  { label: '8th', value: 21 },
  { label: '9th', value: 3228 },
  { label: '10th', value: 37 },
  { label: '11th', value: 2486 },
  { label: '12th', value: 32},
  { label: '13th', value: 3697},
  { label: '14th', value: 39},
  { label: '15th', value: 772},
  { label: '16th', value: 36},
  { label: '17th', value: 1466},
  { label: '18th', value: 26},
  { label: '19th', value: 1348},
  { label: '20th', value: 17},
  { label: '21th', value: 144},
  { label: '22th', value: 12},
  { label: '23th', value: 189},
  { label: '24th', value: 10},
  { label: '25th', value: 238},
  { label: '26th', value: 16},
  { label: '27th', value: 217},
  { label: '28th', value: 9},
  { label: '29th', value: 138},
  { label: '30th', value: 8.05}
  ];

var test12 = [
  { label: '0', value: 5.19 },
  { label: '1st', value: 348259 },
  { label: '2nd', value: 46 },
  { label: '3rd', value: 2366 },
  { label: '4th', value: 15 },
  { label: '5th', value: 9865 },
  { label: '6th', value: 32 },
  { label: '7th', value: 1825 },
  { label: '8th', value: 15 },
  { label: '9th', value: 3102 },
  { label: '10th', value: 41 },
  { label: '11th', value: 2342 },
  { label: '12th', value: 39},
  { label: '13th', value: 3690},
  { label: '14th', value: 56},
  { label: '15th', value: 679},
  { label: '16th', value: 22},
  { label: '17th', value: 1429},
  { label: '18th', value: 23},
  { label: '19th', value: 1373},
  { label: '20th', value: 11},
  { label: '21th', value: 167},
  { label: '22th', value: 11},
  { label: '23th', value: 239},
  { label: '24th', value: 4},
  { label: '25th', value: 231},
  { label: '26th', value: 8.36},
  { label: '27th', value: 251},
  { label: '28th', value: 5.79},
  { label: '29th', value: 113},
  { label: '30th', value: 13.34}
  ];

var test13 = [
  { label: '0', value: 30 },
  { label: '1st', value: 348037 },
  { label: '2nd', value: 47 },
  { label: '3rd', value: 2322 },
  { label: '4th', value: 48 },
  { label: '5th', value: 9761 },
  { label: '6th', value: 40 },
  { label: '7th', value: 2145 },
  { label: '8th', value: 72 },
  { label: '9th', value: 3388 },
  { label: '10th', value: 72 },
  { label: '11th', value: 1922 },
  { label: '12th', value: 645},
  { label: '13th', value: 2575},
  { label: '14th', value: 790},
  { label: '15th', value: 565},
  { label: '16th', value: 336},
  { label: '17th', value: 1894},
  { label: '18th', value: 94},
  { label: '19th', value: 1307},
  { label: '20th', value: 19},
  { label: '21th', value: 248},
  { label: '22th', value: 18},
  { label: '23th', value: 231},
  { label: '24th', value: 37},
  { label: '25th', value: 217},
  { label: '26th', value: 12},
  { label: '27th', value: 240},
  { label: '28th', value: 38},
  { label: '29th', value: 114},
  { label: '30th', value: 22}
  ];

var test14 = [
  { label: '0', value: 11 },
  { label: '1st', value: 348351 },
  { label: '2nd', value: 128 },
  { label: '3rd', value: 2277 },
  { label: '4th', value: 92 },
  { label: '5th', value: 9481 },
  { label: '6th', value: 107 },
  { label: '7th', value: 1970 },
  { label: '8th', value: 77 },
  { label: '9th', value: 3190 },
  { label: '10th', value: 296 },
  { label: '11th', value: 2060 },
  { label: '12th', value: 917},
  { label: '13th', value: 2019},
  { label: '14th', value: 1465},
  { label: '15th', value: 1372},
  { label: '16th', value: 255},
  { label: '17th', value: 1958},
  { label: '18th', value: 107},
  { label: '19th', value: 1067},
  { label: '20th', value: 171},
  { label: '21th', value: 349},
  { label: '22th', value: 50},
  { label: '23th', value: 299},
  { label: '24th', value: 127},
  { label: '25th', value: 266},
  { label: '26th', value: 30},
  { label: '27th', value: 273},
  { label: '28th', value: 50},
  { label: '29th', value: 155},
  { label: '30th', value: 56}
  ];

var test15 = [
  { label: '0', value: 12 },
  { label: '1st', value: 348568 },
  { label: '2nd', value: 53 },
  { label: '3rd', value: 2320 },
  { label: '4th', value: 43 },
  { label: '5th', value: 9426 },
  { label: '6th', value: 84 },
  { label: '7th', value: 2137 },
  { label: '8th', value: 94 },
  { label: '9th', value: 2983 },
  { label: '10th', value: 205 },
  { label: '11th', value: 1722 },
  { label: '12th', value: 354},
  { label: '13th', value: 1034},
  { label: '14th', value: 10},
  { label: '15th', value: 1964},
  { label: '16th', value: 352},
  { label: '17th', value: 1780},
  { label: '18th', value: 80},
  { label: '19th', value: 1101},
  { label: '20th', value: 114},
  { label: '21th', value: 273},
  { label: '22th', value: 64},
  { label: '23th', value: 301},
  { label: '24th', value: 39},
  { label: '25th', value: 244},
  { label: '26th', value: 15},
  { label: '27th', value: 263},
  { label: '28th', value: 8},
  { label: '29th', value: 137},
  { label: '30th', value: 16}
  ];

var test16 = [
  { label: '0', value: 0.73 },
  { label: '1st', value: 348726 },
  { label: '2nd', value: 30 },
  { label: '3rd', value: 2256 },
  { label: '4th', value: 32 },
  { label: '5th', value: 9330 },
  { label: '6th', value: 75 },
  { label: '7th', value: 2340 },
  { label: '8th', value: 105 },
  { label: '9th', value: 3216 },
  { label: '10th', value: 176 },
  { label: '11th', value: 1996 },
  { label: '12th', value: 366},
  { label: '13th', value: 2720},
  { label: '14th', value: 270},
  { label: '15th', value: 1056},
  { label: '16th', value: 44},
  { label: '17th', value: 1562},
  { label: '18th', value: 53},
  { label: '19th', value: 1266},
  { label: '20th', value: 25},
  { label: '21th', value: 253},
  { label: '22th', value: 36},
  { label: '23th', value: 237},
  { label: '24th', value: 11},
  { label: '25th', value: 250},
  { label: '26th', value: 10},
  { label: '27th', value: 247},
  { label: '28th', value: 18},
  { label: '29th', value: 121},
  { label: '30th', value: 16.6}
  ];

var test17 = [
  { label: '0', value: 12 },
  { label: '1st', value: 348792 },
  { label: '2nd', value: 82 },
  { label: '3rd', value: 2307 },
  { label: '4th', value: 41 },
  { label: '5th', value: 9408 },
  { label: '6th', value: 56 },
  { label: '7th', value: 2141 },
  { label: '8th', value: 103 },
  { label: '9th', value: 3283 },
  { label: '10th', value: 143 },
  { label: '11th', value: 1991 },
  { label: '12th', value: 82},
  { label: '13th', value: 2535},
  { label: '14th', value: 117},
  { label: '15th', value: 1117},
  { label: '16th', value: 135},
  { label: '17th', value: 1457},
  { label: '18th', value: 55},
  { label: '19th', value: 1296},
  { label: '20th', value: 33},
  { label: '21th', value: 269},
  { label: '22th', value: 2.34},
  { label: '23th', value: 248},
  { label: '24th', value: 7.81},
  { label: '25th', value: 244},
  { label: '26th', value: 4.69},
  { label: '27th', value: 244},
  { label: '28th', value: 7},
  { label: '29th', value: 129},
  { label: '30th', value: 12}
  ];

var test18 = [
  { label: '0', value: 10 },
  { label: '1st', value: 348683 },
  { label: '2nd', value: 31 },
  { label: '3rd', value: 2299 },
  { label: '4th', value: 35 },
  { label: '5th', value: 9373 },
  { label: '6th', value: 39 },
  { label: '7th', value: 2063 },
  { label: '8th', value: 107 },
  { label: '9th', value: 3231 },
  { label: '10th', value: 185 },
  { label: '11th', value: 2181 },
  { label: '12th', value: 148},
  { label: '13th', value: 2797},
  { label: '14th', value: 99},
  { label: '15th', value: 864},
  { label: '16th', value: 80},
  { label: '17th', value: 1459},
  { label: '18th', value: 39},
  { label: '19th', value: 1347},
  { label: '20th', value: 28},
  { label: '21th', value: 240},
  { label: '22th', value: 10},
  { label: '23th', value: 240},
  { label: '24th', value: 19},
  { label: '25th', value: 233},
  { label: '26th', value: 29},
  { label: '27th', value: 226},
  { label: '28th', value: 16},
  { label: '29th', value: 132},
  { label: '30th', value: 16}
  ];

var test19 = [
  { label: '0', value: 19 },
  { label: '1st', value: 348596 },
  { label: '2nd', value: 50 },
  { label: '3rd', value: 2280 },
  { label: '4th', value: 27 },
  { label: '5th', value: 9463 },
  { label: '6th', value: 13 },
  { label: '7th', value: 2136 },
  { label: '8th', value: 85 },
  { label: '9th', value: 3173 },
  { label: '10th', value: 235 },
  { label: '11th', value: 2086 },
  { label: '12th', value: 307},
  { label: '13th', value: 2666},
  { label: '14th', value: 130},
  { label: '15th', value: 867},
  { label: '16th', value: 34},
  { label: '17th', value: 1436},
  { label: '18th', value: 79},
  { label: '19th', value: 1338},
  { label: '20th', value: 13},
  { label: '21th', value: 202},
  { label: '22th', value: 33},
  { label: '23th', value: 259},
  { label: '24th', value: 16},
  { label: '25th', value: 232},
  { label: '26th', value: 6},
  { label: '27th', value: 235},
  { label: '28th', value: 12},
  { label: '29th', value: 116},
  { label: '30th', value: 4.6}
  ];

var test20 = [
  { label: '0', value: 11 },
  { label: '1st', value: 348346 },
  { label: '2nd', value: 19 },
  { label: '3rd', value: 2367 },
  { label: '4th', value: 49 },
  { label: '5th', value: 9585 },
  { label: '6th', value: 24 },
  { label: '7th', value: 2209 },
  { label: '8th', value: 86 },
  { label: '9th', value: 3242 },
  { label: '10th', value: 199 },
  { label: '11th', value: 1942 },
  { label: '12th', value: 277},
  { label: '13th', value: 2436},
  { label: '14th', value: 127},
  { label: '15th', value: 865},
  { label: '16th', value: 103},
  { label: '17th', value: 1489},
  { label: '18th', value: 28},
  { label: '19th', value: 1328},
  { label: '20th', value: 33},
  { label: '21th', value: 259},
  { label: '22th', value: 6.24},
  { label: '23th', value: 243},
  { label: '24th', value: 22},
  { label: '25th', value: 251},
  { label: '26th', value: 18},
  { label: '27th', value: 241},
  { label: '28th', value: 15},
  { label: '29th', value: 129},
  { label: '30th', value: 15}
  ];

var test21 = [
  { label: '0', value: 58 },
  { label: '1st', value: 348043 },
  { label: '2nd', value: 47 },
  { label: '3rd', value: 2402 },
  { label: '4th', value: 38 },
  { label: '5th', value: 9534 },
  { label: '6th', value: 82 },
  { label: '7th', value: 1987 },
  { label: '8th', value: 69 },
  { label: '9th', value: 3118 },
  { label: '10th', value: 335 },
  { label: '11th', value: 1807 },
  { label: '12th', value: 548},
  { label: '13th', value: 1867},
  { label: '14th', value: 347},
  { label: '15th', value: 1175},
  { label: '16th', value: 180},
  { label: '17th', value: 1660},
  { label: '18th', value: 106},
  { label: '19th', value: 1159},
  { label: '20th', value: 23},
  { label: '21th', value: 205},
  { label: '22th', value: 40},
  { label: '23th', value: 243},
  { label: '24th', value: 24},
  { label: '25th', value: 194},
  { label: '26th', value: 33.5},
  { label: '27th', value: 216},
  { label: '28th', value: 6.88},
  { label: '29th', value: 128},
  { label: '30th', value: 19.49}
  ];

var test22 = [
  { label: '0', value: 26 },
  { label: '1st', value: 347910 },
  { label: '2nd', value: 20 },
  { label: '3rd', value: 2343 },
  { label: '4th', value: 45 },
  { label: '5th', value: 9745 },
  { label: '6th', value: 103 },
  { label: '7th', value: 2165 },
  { label: '8th', value: 69 },
  { label: '9th', value: 3089 },
  { label: '10th', value: 178 },
  { label: '11th', value: 1607 },
  { label: '12th', value: 299},
  { label: '13th', value: 1054},
  { label: '14th', value: 722},
  { label: '15th', value: 1252},
  { label: '16th', value: 317},
  { label: '17th', value: 1791},
  { label: '18th', value: 129},
  { label: '19th', value: 1227},
  { label: '20th', value: 118},
  { label: '21th', value: 178},
  { label: '22th', value: 17},
  { label: '23th', value: 262},
  { label: '24th', value: 14},
  { label: '25th', value: 236},
  { label: '26th', value: 12},
  { label: '27th', value: 201},
  { label: '28th', value: 30},
  { label: '29th', value: 120},
  { label: '30th', value: 7.77}
  ];

var test23 = [
  { label: '0', value: 3 },
  { label: '1st', value: 347758 },
  { label: '2nd', value: 17 },
  { label: '3rd', value: 2343 },
  { label: '4th', value: 38 },
  { label: '5th', value: 9559 },
  { label: '6th', value: 52 },
  { label: '7th', value: 2406 },
  { label: '8th', value: 107 },
  { label: '9th', value: 3282 },
  { label: '10th', value: 200 },
  { label: '11th', value: 1876 },
  { label: '12th', value: 470},
  { label: '13th', value: 1832},
  { label: '14th', value: 951},
  { label: '15th', value: 1262},
  { label: '16th', value: 74},
  { label: '17th', value: 1666},
  { label: '18th', value: 217},
  { label: '19th', value: 1187},
  { label: '20th', value: 160},
  { label: '21th', value: 290},
  { label: '22th', value: 67},
  { label: '23th', value: 301},
  { label: '24th', value: 86},
  { label: '25th', value: 248},
  { label: '26th', value: 17},
  { label: '27th', value: 184},
  { label: '28th', value: 59},
  { label: '29th', value: 139},
  { label: '30th', value: 32.9}
  ];

var test24 = [
  { label: '0', value: 3 },
  { label: '1st', value: 347783 },
  { label: '2nd', value: 57 },
  { label: '3rd', value: 2375 },
  { label: '4th', value: 50 },
  { label: '5th', value: 9383 },
  { label: '6th', value: 96 },
  { label: '7th', value: 2326 },
  { label: '8th', value: 130 },
  { label: '9th', value: 3133 },
  { label: '10th', value: 284 },
  { label: '11th', value: 1821 },
  { label: '12th', value: 1139},
  { label: '13th', value: 1012},
  { label: '14th', value: 1655},
  { label: '15th', value: 1355},
  { label: '16th', value: 314},
  { label: '17th', value: 1973},
  { label: '18th', value: 186},
  { label: '19th', value: 1186},
  { label: '20th', value: 58},
  { label: '21th', value: 207},
  { label: '22th', value: 62},
  { label: '23th', value: 308},
  { label: '24th', value: 98},
  { label: '25th', value: 200},
  { label: '26th', value: 12},
  { label: '27th', value: 203},
  { label: '28th', value: 26},
  { label: '29th', value: 150},
  { label: '30th', value: 37}
  ];

var test25 = [
  { label: '0', value: 0.36 },
  { label: '1st', value: 347514 },
  { label: '2nd', value: 22 },
  { label: '3rd', value: 2411 },
  { label: '4th', value: 40 },
  { label: '5th', value: 9544 },
  { label: '6th', value: 56 },
  { label: '7th', value: 2431 },
  { label: '8th', value: 47 },
  { label: '9th', value: 3139 },
  { label: '10th', value: 31 },
  { label: '11th', value: 2336 },
  { label: '12th', value: 10},
  { label: '13th', value: 3522},
  { label: '14th', value: 54},
  { label: '15th', value: 809},
  { label: '16th', value: 38},
  { label: '17th', value: 1548},
  { label: '18th', value: 9.98},
  { label: '19th', value: 1275},
  { label: '20th', value: 15},
  { label: '21th', value: 257},
  { label: '22th', value: 5.14},
  { label: '23th', value: 261},
  { label: '24th', value: 16},
  { label: '25th', value: 213},
  { label: '26th', value: 2.26},
  { label: '27th', value: 245},
  { label: '28th', value: 6.42},
  { label: '29th', value: 131},
  { label: '30th', value: 13}
  ];

var test26 = [
  { label: '0', value: 5 },
  { label: '1st', value: 347624 },
  { label: '2nd', value: 51 },
  { label: '3rd', value: 2401 },
  { label: '4th', value: 52 },
  { label: '5th', value: 9527 },
  { label: '6th', value: 64 },
  { label: '7th', value: 2383 },
  { label: '8th', value: 37 },
  { label: '9th', value: 3147 },
  { label: '10th', value: 16 },
  { label: '11th', value: 2323 },
  { label: '12th', value: 10},
  { label: '13th', value: 3577},
  { label: '14th', value: 39},
  { label: '15th', value: 814},
  { label: '16th', value: 3.71},
  { label: '17th', value: 1545},
  { label: '18th', value: 15},
  { label: '19th', value: 1310},
  { label: '20th', value: 14},
  { label: '21th', value: 254},
  { label: '22th', value: 2.6},
  { label: '23th', value: 261},
  { label: '24th', value: 11},
  { label: '25th', value: 218},
  { label: '26th', value: 7},
  { label: '27th', value: 246},
  { label: '28th', value: 3.16},
  { label: '29th', value: 130 },
  { label: '30th', value: 14}
  ];

var test27 = [
  { label: '0', value: 7 },
  { label: '1st', value: 347673 },
  { label: '2nd', value: 24 },
  { label: '3rd', value: 2388 },
  { label: '4th', value: 38 },
  { label: '5th', value: 9532 },
  { label: '6th', value: 55 },
  { label: '7th', value: 2450 },
  { label: '8th', value: 42 },
  { label: '9th', value: 3096 },
  { label: '10th', value: 17 },
  { label: '11th', value: 2343 },
  { label: '12th', value: 19},
  { label: '13th', value: 3676},
  { label: '14th', value: 41},
  { label: '15th', value: 835},
  { label: '16th', value: 24},
  { label: '17th', value: 1482},
  { label: '18th', value: 20},
  { label: '19th', value: 1261},
  { label: '20th', value: 14},
  { label: '21th', value: 239},
  { label: '22th', value: 1.87},
  { label: '23th', value: 246},
  { label: '24th', value: 12},
  { label: '25th', value: 200},
  { label: '26th', value: 4.63},
  { label: '27th', value: 232},
  { label: '28th', value: 10},
  { label: '29th', value: 124 },
  { label: '30th', value: 4.56}
  ];

var test28 = [
  { label: '0', value: 10 },
  { label: '1st', value: 347791 },
  { label: '2nd', value: 32 },
  { label: '3rd', value: 2414 },
  { label: '4th', value: 21 },
  { label: '5th', value: 9358 },
  { label: '6th', value: 26 },
  { label: '7th', value: 2313 },
  { label: '8th', value: 19 },
  { label: '9th', value: 3163 },
  { label: '10th', value: 37 },
  { label: '11th', value: 2374 },
  { label: '12th', value: 42},
  { label: '13th', value: 3744},
  { label: '14th', value: 32},
  { label: '15th', value: 866},
  { label: '16th', value: 27},
  { label: '17th', value: 1516},
  { label: '18th', value: 23},
  { label: '19th', value: 1291},
  { label: '20th', value: 14},
  { label: '21th', value: 257},
  { label: '22th', value: 4.42},
  { label: '23th', value: 265},
  { label: '24th', value: 4},
  { label: '25th', value: 214},
  { label: '26th', value: 4.22},
  { label: '27th', value: 214},
  { label: '28th', value: 3},
  { label: '29th', value: 124 },
  { label: '30th', value: 5.92}
  ];

var test29 = [
  { label: '0', value: 6 },
  { label: '1st', value: 347747 },
  { label: '2nd', value: 33 },
  { label: '3rd', value: 2395 },
  { label: '4th', value: 16 },
  { label: '5th', value: 9416 },
  { label: '6th', value: 4.88 },
  { label: '7th', value: 2357 },
  { label: '8th', value: 16 },
  { label: '9th', value: 3125 },
  { label: '10th', value: 46 },
  { label: '11th', value: 2369 },
  { label: '12th', value: 34},
  { label: '13th', value: 3786},
  { label: '14th', value: 66},
  { label: '15th', value: 864},
  { label: '16th', value: 22},
  { label: '17th', value: 1522},
  { label: '18th', value: 21},
  { label: '19th', value: 1291},
  { label: '20th', value: 16},
  { label: '21th', value: 253},
  { label: '22th', value: 8},
  { label: '23th', value: 264},
  { label: '24th', value: 7},
  { label: '25th', value: 204},
  { label: '26th', value: 8.85},
  { label: '27th', value: 253},
  { label: '28th', value: 13.79},
  { label: '29th', value: 139 },
  { label: '30th', value: 6.46}
  ];

var test30 = [
  { label: '0', value: 10 },
  { label: '1st', value: 347762 },
  { label: '2nd', value: 34 },
  { label: '3rd', value: 2328 },
  { label: '4th', value: 41 },
  { label: '5th', value: 9346 },
  { label: '6th', value: 27 },
  { label: '7th', value: 2346 },
  { label: '8th', value: 36 },
  { label: '9th', value: 3127 },
  { label: '10th', value: 16 },
  { label: '11th', value: 2352 },
  { label: '12th', value: 14},
  { label: '13th', value: 3839},
  { label: '14th', value: 30},
  { label: '15th', value: 850},
  { label: '16th', value: 16},
  { label: '17th', value: 1439},
  { label: '18th', value: 8.55},
  { label: '19th', value: 1288},
  { label: '20th', value: 4.59},
  { label: '21th', value: 240},
  { label: '22th', value: 7.05},
  { label: '23th', value: 267},
  { label: '24th', value: 14},
  { label: '25th', value: 203},
  { label: '26th', value: 8.71},
  { label: '27th', value: 247},
  { label: '28th', value: 12},
  { label: '29th', value: 132 },
  { label: '30th', value: 13.35}
  ];

var test31 = [
  { label: '0', value: 15.7 },
  { label: '1st', value: 348138 },
  { label: '2nd', value: 44 },
  { label: '3rd', value: 2688 },
  { label: '4th', value: 23 },
  { label: '5th', value: 10394 },
  { label: '6th', value: 16 },
  { label: '7th', value: 1893 },
  { label: '8th', value: 17 },
  { label: '9th', value: 3399 },
  { label: '10th', value: 43 },
  { label: '11th', value: 2631 },
  { label: '12th', value: 23},
  { label: '13th', value: 3617},
  { label: '14th', value: 25},
  { label: '15th', value: 799},
  { label: '16th', value: 40},
  { label: '17th', value: 1548},
  { label: '18th', value: 19},
  { label: '19th', value: 1327},
  { label: '20th', value: 16},
  { label: '21th', value: 150},
  { label: '22th', value: 10},
  { label: '23th', value: 175},
  { label: '24th', value: 9.37},
  { label: '25th', value: 272},
  { label: '26th', value: 11},
  { label: '27th', value: 216},
  { label: '28th', value: 13},
  { label: '29th', value: 127 },
  { label: '30th', value: 8.19}
  ];

var test32 = [
  { label: '0', value: 2.87 },
  { label: '1st', value: 347886 },
  { label: '2nd', value: 32 },
  { label: '3rd', value: 2248 },
  { label: '4th', value: 10 },
  { label: '5th', value: 9287 },
  { label: '6th', value: 19 },
  { label: '7th', value: 2095 },
  { label: '8th', value: 12 },
  { label: '9th', value: 3093 },
  { label: '10th', value: 16.96 },
  { label: '11th', value: 2567 },
  { label: '12th', value: 26},
  { label: '13th', value: 3739},
  { label: '14th', value: 31},
  { label: '15th', value: 770},
  { label: '16th', value: 24},
  { label: '17th', value: 1546},
  { label: '18th', value: 8.95},
  { label: '19th', value: 1286},
  { label: '20th', value: 10},
  { label: '21th', value: 201},
  { label: '22th', value: 14},
  { label: '23th', value: 197},
  { label: '24th', value: 14},
  { label: '25th', value: 232},
  { label: '26th', value: 1.37},
  { label: '27th', value: 266},
  { label: '28th', value: 10},
  { label: '29th', value: 107 },
  { label: '30th', value: 6.61}
  ];

var test33 = [
  { label: '0', value: 9.82 },
  { label: '1st', value: 347896 },
  { label: '2nd', value: 14 },
  { label: '3rd', value: 2544 },
  { label: '4th', value: 22 },
  { label: '5th', value: 9327 },
  { label: '6th', value: 19 },
  { label: '7th', value: 2267 },
  { label: '8th', value: 15 },
  { label: '9th', value: 3206 },
  { label: '10th', value: 12 },
  { label: '11th', value: 2495 },
  { label: '12th', value: 17},
  { label: '13th', value: 3712},
  { label: '14th', value: 25},
  { label: '15th', value: 868},
  { label: '16th', value: 20},
  { label: '17th', value: 1532},
  { label: '18th', value: 11},
  { label: '19th', value: 1281},
  { label: '20th', value: 23},
  { label: '21th', value: 211},
  { label: '22th', value: 2},
  { label: '23th', value: 221},
  { label: '24th', value: 13},
  { label: '25th', value: 228},
  { label: '26th', value: 8.58},
  { label: '27th', value: 243},
  { label: '28th', value: 6.51},
  { label: '29th', value: 127 },
  { label: '30th', value: 6.97}
  ];

var test34 = [
  { label: '0', value: 12 },
  { label: '1st', value: 347796 },
  { label: '2nd', value: 31 },
  { label: '3rd', value: 2486 },
  { label: '4th', value: 5.87 },
  { label: '5th', value: 9220 },
  { label: '6th', value: 12 },
  { label: '7th', value: 2211 },
  { label: '8th', value: 6.84 },
  { label: '9th', value: 3186 },
  { label: '10th', value: 27 },
  { label: '11th', value: 2447 },
  { label: '12th', value: 4.77},
  { label: '13th', value: 3686},
  { label: '14th', value: 29},
  { label: '15th', value: 861},
  { label: '16th', value: 22},
  { label: '17th', value: 1532},
  { label: '18th', value: 12},
  { label: '19th', value: 1281},
  { label: '20th', value: 17},
  { label: '21th', value: 216},
  { label: '22th', value: 5.24},
  { label: '23th', value: 227},
  { label: '24th', value: 4.11},
  { label: '25th', value: 229},
  { label: '26th', value: 12},
  { label: '27th', value: 246},
  { label: '28th', value: 4.6},
  { label: '29th', value: 125},
  { label: '30th', value: 9.04}
  ];

var test35 = [
  { label: '0', value: 4 },
  { label: '1st', value: 347850 },
  { label: '2nd', value: 23 },
  { label: '3rd', value: 2426 },
  { label: '4th', value: 40 },
  { label: '5th', value: 9146 },
  { label: '6th', value: 19 },
  { label: '7th', value: 2229 },
  { label: '8th', value: 17 },
  { label: '9th', value: 3191 },
  { label: '10th', value: 6.52 },
  { label: '11th', value: 2406 },
  { label: '12th', value: 12},
  { label: '13th', value: 3777},
  { label: '14th', value: 45},
  { label: '15th', value: 861},
  { label: '16th', value: 34},
  { label: '17th', value: 1474},
  { label: '18th', value: 15},
  { label: '19th', value: 1295},
  { label: '20th', value: 5.69},
  { label: '21th', value: 202},
  { label: '22th', value: 6.18},
  { label: '23th', value: 226.55},
  { label: '24th', value: 2.49},
  { label: '25th', value: 214},
  { label: '26th', value: 8.33},
  { label: '27th', value: 224},
  { label: '28th', value: 5.72},
  { label: '29th', value: 118.99},
  { label: '30th', value: 9.13}
  ];

var test36 = [
  { label: '0', value: 0.14 },
  { label: '1st', value: 348266 },
  { label: '2nd', value: 47 },
  { label: '3rd', value: 2470 },
  { label: '4th', value: 52 },
  { label: '5th', value: 9034 },
  { label: '6th', value: 27 },
  { label: '7th', value: 2176 },
  { label: '8th', value: 14 },
  { label: '9th', value: 3188 },
  { label: '10th', value: 25 },
  { label: '11th', value: 2359 },
  { label: '12th', value: 24},
  { label: '13th', value: 3557},
  { label: '14th', value: 47},
  { label: '15th', value: 882},
  { label: '16th', value: 29},
  { label: '17th', value: 1472},
  { label: '18th', value: 9.17},
  { label: '19th', value: 1269},
  { label: '20th', value: 15.4},
  { label: '21th', value: 225.96},
  { label: '22th', value: 8.38},
  { label: '23th', value: 244},
  { label: '24th', value: 5.34},
  { label: '25th', value: 222},
  { label: '26th', value: 4.13},
  { label: '27th', value: 232},
  { label: '28th', value: 9.3},
  { label: '29th', value: 127},
  { label: '30th', value: 8.25}
  ];

var test37 = [
  { label: '0', value: 2.51 },
  { label: '1st', value: 348389 },
  { label: '2nd', value: 53 },
  { label: '3rd', value: 2468 },
  { label: '4th', value: 6.96 },
  { label: '5th', value: 9016 },
  { label: '6th', value: 26 },
  { label: '7th', value: 2134 },
  { label: '8th', value: 7 },
  { label: '9th', value: 3182 },
  { label: '10th', value: 14 },
  { label: '11th', value: 2364 },
  { label: '12th', value: 24},
  { label: '13th', value: 3501},
  { label: '14th', value: 42},
  { label: '15th', value: 886},
  { label: '16th', value: 5.38},
  { label: '17th', value: 1444},
  { label: '18th', value: 15},
  { label: '19th', value: 1249},
  { label: '20th', value: 20},
  { label: '21th', value: 205},
  { label: '22th', value: 6.2},
  { label: '23th', value: 218},
  { label: '24th', value: 8.44},
  { label: '25th', value: 215},
  { label: '26th', value: 9.13},
  { label: '27th', value: 236},
  { label: '28th', value: 9.58},
  { label: '29th', value: 112.43},
  { label: '30th', value: 13.18}
  ];

var test38 = [
  { label: '0', value: 13 },
  { label: '1st', value: 348391 },
  { label: '2nd', value: 41 },
  { label: '3rd', value: 2463 },
  { label: '4th', value: 37 },
  { label: '5th', value: 9076 },
  { label: '6th', value: 59 },
  { label: '7th', value: 2096 },
  { label: '8th', value: 13 },
  { label: '9th', value: 3197 },
  { label: '10th', value: 17 },
  { label: '11th', value: 2375 },
  { label: '12th', value: 54},
  { label: '13th', value: 3526},
  { label: '14th', value: 56},
  { label: '15th', value: 842},
  { label: '16th', value: 16},
  { label: '17th', value: 1411},
  { label: '18th', value: 12},
  { label: '19th', value: 1222},
  { label: '20th', value: 18},
  { label: '21th', value: 202},
  { label: '22th', value: 5.99},
  { label: '23th', value: 226},
  { label: '24th', value: 4.56},
  { label: '25th', value: 208},
  { label: '26th', value: 6.19},
  { label: '27th', value: 241},
  { label: '28th', value: 7.07},
  { label: '29th', value: 112},
  { label: '30th', value: 11.82}
  ];

var test39 = [
  { label: '0', value: 10 },
  { label: '1st', value: 348240 },
  { label: '2nd', value: 48 },
  { label: '3rd', value: 2529 },
  { label: '4th', value: 16 },
  { label: '5th', value: 9184 },
  { label: '6th', value: 23 },
  { label: '7th', value: 2118 },
  { label: '8th', value: 18.97 },
  { label: '9th', value: 3219 },
  { label: '10th', value: 17 },
  { label: '11th', value: 2335 },
  { label: '12th', value: 36.33},
  { label: '13th', value: 3602},
  { label: '14th', value: 48},
  { label: '15th', value: 878},
  { label: '16th', value: 34},
  { label: '17th', value: 1435},
  { label: '18th', value: 18},
  { label: '19th', value: 1228},
  { label: '20th', value: 16},
  { label: '21th', value: 215},
  { label: '22th', value: 3.34},
  { label: '23th', value: 219},
  { label: '24th', value: 13},
  { label: '25th', value: 205},
  { label: '26th', value: 9},
  { label: '27th', value: 246},
  { label: '28th', value: 3.92},
  { label: '29th', value: 107},
  { label: '30th', value: 16.22}
  ];

var test40 = [
  { label: '0', value: 1.27 },
  { label: '1st', value: 348016 },
  { label: '2nd', value: 18 },
  { label: '3rd', value: 2524 },
  { label: '4th', value: 39 },
  { label: '5th', value: 9333 },
  { label: '6th', value: 40 },
  { label: '7th', value: 2130 },
  { label: '8th', value: 23 },
  { label: '9th', value: 3148 },
  { label: '10th', value: 24 },
  { label: '11th', value: 2272 },
  { label: '12th', value: 10},
  { label: '13th', value: 3585},
  { label: '14th', value: 49},
  { label: '15th', value: 848},
  { label: '16th', value: 20},
  { label: '17th', value: 1433},
  { label: '18th', value: 23},
  { label: '19th', value: 1226},
  { label: '20th', value: 5.44},
  { label: '21th', value: 218},
  { label: '22th', value: 0.42},
  { label: '23th', value: 227},
  { label: '24th', value: 5},
  { label: '25th', value: 198},
  { label: '26th', value: 2},
  { label: '27th', value: 255},
  { label: '28th', value: 7},
  { label: '29th', value: 114},
  { label: '30th', value: 10}
  ];
var test50 = [test0,test1,test2,test3,test4,test5,test6,test7,test8,test9,
test10,test11,test12,test13,test14,test15,test16,test17,test18,test19,test20,
test21,test22,test23,test24,test25,test26,test27,test28,test29,test30,
test31,test32,test33,test34,test35,test36,test37,test38,test39,test40
];


reset();
index = 0;
intervalID4 = setInterval(change,4000)


chart.start();

function change(){
  chart.populate(test50[index++])
  index %= test50.length;
}

function stop4(){
   clearInterval(intervalID4)
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

