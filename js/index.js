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

var test = [
    { label: '0', value: 4.54 },
    { label: '1st', value: 592.69 },
    { label: '2nd', value: 2.42 },
    { label: '3rd', value: 456.98 },
    { label: '4th', value: 2.68 },
    { label: '5th', value: 280.51 },
    { label: '6th', value: 0.99 },
    { label: '7th', value: 136.68 },
    { label: '8th', value: 2.82 },
    { label: '9th', value: 31.22 },
    { label: '10th', value: 2.16 },
    { label: '11th', value: 129.18 },
    { label: '12th', value: 3.44},
    { label: '13th', value: 77.34},
    { label: '14th', value: 1.66},
    { label: '15th', value: 81.9},
    { label: '16th', value: 2.71},
    { label: '17th', value: 40.93},
    { label: '18th', value: 1.32},
    { label: '19th', value: 23.13},
    { label: '20th', value: 1.61},
    { label: '21th', value: 18.62},
    { label: '22th', value: 2.18},
    { label: '23th', value: 11.46},
    { label: '24th', value: 0.81},
    { label: '25th', value: 6.51},
    { label: '26th', value: 1.61},
    { label: '27th', value: 4.97},
    { label: '28th', value: 1.19},
    { label: '29th', value: 16.21},
  ];

var test1 = [{ label: '0', value: 4.54 },
{ label: '1st', value: 5.55 },
{ label: '2nd', value: 2.42 },
{ label: '3rd', value: 5.55 },
{ label: '4th', value: 2.68 },
{ label: '5th', value: 280.51 },
{ label: '6th', value: 0.99 },
{ label: '7th', value: 136.68 },
{ label: '8th', value: 2.82 },
{ label: '9th', value: 31.22 },
{ label: '10th', value: 2.16 },
{ label: '11th', value: 129.18 },
{ label: '12th', value: 3.44},
{ label: '13th', value: 77.34},
{ label: '14th', value: 1.66},
{ label: '15th', value: 81.9},
{ label: '16th', value: 2.71},
{ label: '17th', value: 40.93},
{ label: '18th', value: 1.32},
{ label: '19th', value: 23.13},
{ label: '20th', value: 1.61},
{ label: '21th', value: 18.62},
{ label: '22th', value: 2.18},
{ label: '23th', value: 11.46},
{ label: '24th', value: 0.81},
{ label: '25th', value: 6.51},
{ label: '26th', value: 1.61},
{ label: '27th', value: 4.97},
{ label: '28th', value: 1.19},
{ label: '29th', value: 16.21},
  ]; 
  var test2 = [{ label: '0', value: 4.54 },
  { label: '1st', value: 5.55 },
  { label: '2nd', value: 2.42 },
  { label: '3rd', value: 5.55 },
  { label: '4th', value: 2.68 },
  { label: '5th', value: 5.67 },
  { label: '6th', value: 0.99 },
  { label: '7th', value: 40.3 },
  { label: '8th', value: 2.82 },
  { label: '9th', value: 31.22 },
  { label: '10th', value: 2.16 },
  { label: '11th', value: 129.18 },
  { label: '12th', value: 3.44},
  { label: '13th', value: 77.34},
  { label: '14th', value: 1.66},
  { label: '15th', value: 81.9},
  { label: '16th', value: 2.71},
  { label: '17th', value: 40.93},
  { label: '18th', value: 1.32},
  { label: '19th', value: 23.13},
  { label: '20th', value: 1.61},
  { label: '21th', value: 18.62},
  { label: '22th', value: 2.18},
  { label: '23th', value: 11.46},
  { label: '24th', value: 0.81},
  { label: '25th', value: 6.51},
  { label: '26th', value: 1.61},
  { label: '27th', value: 4.97},
  { label: '28th', value: 1.19},
  { label: '29th', value: 16.21},
    ];


var test3 = [test,test1,test2];
reset();
index = 0;
intervalID3 = setInterval(change,5000)


chart.start();

function change(){
  chart.populate(test3[index++])
  index %= test3.length;
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
  chart.populate(test3[0]
    
  );
}

