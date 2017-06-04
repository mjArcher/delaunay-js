// ideas
// maps : nodes correspond to places?

var mx, my; 
var isDrag = false;
var mySel, mySeli;
var rad = 6;
var canvas = document.getElementById('canvas');
var validTriangles = [];
// var borderWidth = document.css("border-left-width");
// console.log(borderWidth)

canvas.addEventListener('mousemove', mouse_track);
canvas.onselectstart = function () { return false; }
canvas.onmousemove = null;
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');

var pad = 75;

var voronoi_steps = { 
  draw_dots : false, 
  draw_circles : false, 
  draw_lines : false,
  add_colour : true
};

if (document.defaultView && document.defaultView.getComputedStyle) {
  stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], pad)      || 0;
  stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], pad)       || 0;
  styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], pad)  || 0;
  styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], pad)   || 0;
}

// ctx.fillStyle = '#f00';
// ctx=canvas.getContext("2d");
// ctx.rect(pad,pad,canvas.width-pad,canvas.height-pad);

// ctx.beginPath();
// ctx.moveTo(pad, pad);
// ctx.lineTo(canvas.width-pad,pad);
// ctx.lineTo(canvas.width-pad, canvas.height-pad);
// ctx.lineTo(canvas.pad, canvas.height-pad);
// ctx.closePath();
// ctx.fill();

var NODES = 20;

var mouse_pos_x = 0;
var mouse_pos_y = 0;

function mouse_track(event) {
  mouse_pos_x = event.clientX;
  mouse_pos_y = event.clientY;
}

function getRand(min, max) {
      return Math.random() * (max - min) + min;
}

function dist(x,y){
  return Math.sqrt(x*x+y*y);
}


var nodes = [];

// loop over all points in the domain, fill certain colour if near vertex 1, vertex 2 etc 
for(i=0;i<NODES;i++){
  var node = {
    x: getRand(pad,canvas.width-pad),
    y: getRand(pad,canvas.height-pad),
    radius: rad
  };
  nodes.push(node);
}

function pushNode(ax, ay)
{
  var node = {
    x: ax,
    y: ay,
    radius: rad
  };
  nodes.push(node);
  NODES += 1;
}

pushNode(3,3);
pushNode(canvas.width-3,3);
pushNode(canvas.width-3,canvas.height-3);
pushNode(3,canvas.height-3);
console.log(NODES);

nodes.sort(function(p1,p2){
  var angle1 =  Math.atan2(p1.x,p1.x);
  var angle2 =  Math.atan2(p2.y,p2.x);
  if (angle1 < angle2) return 1;
  else if (angle1 > angle2) return -1;
  return 0;
});
// console.log(nodes);

function mouse_track(e) {
  mx = e.clientX;
  my = e.clientY;
}

function myDown(e)
{
  // console.log(mx, my);
  getMouse(e);
  var l = NODES;

  for (var i = l-1; i >= 0; i--) {
    if(dist(mx-nodes[i].x, my-nodes[i].y) < rad*2)
    {
      nodes[i].x = mx; 
      nodes[i].y = my;
      mySel = nodes[i];
      mySeli = i;
      isDrag = true;
      canvas.onmousemove = myMove;
      break;
    }
  }
}

function myUp(e)
{
  mySeli=null;
  isDrag = false;
  canvas.onmousemove = null;
}


// Mouse activity
function myMove(e)
{
  if (isDrag){
    getMouse(e);
    mySel.x = mx;
    mySel.y = my; 
  }
}

function getMouse(e) 
{
  // console.log("called")
  var element = canvas, offsetX = 0, offsetY = 0;
  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;
}

var count = 0;
function delaunay(){
  var cmb = Combinatorics.combination(nodes, 3);
  validTriangles = [];
  while(a = cmb.next()) 
  {
    var inside = 0;
    for(var i = 0; i < NODES; i++){
      // test if inside
      // console.log(isPointInsideSphere(a,nodes[i]))
      if(isPointInsideSphere(a,nodes[i]) > 0)
      {
        inside = 1;
        break;
      }
    }
    if(inside != 0){}
    else{
      // console.log("push")
      validTriangles.push(a);
    }
  }

  // console.log("valid triangles " + validTriangles.length)
  // draw the triangle
}

function drawTriangles(){
 
  //create palette
  for(var i = 0; i < validTriangles.length; i++)
  {
    var a = validTriangles[i];
    ctx.beginPath();
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.lineWidth="3";
    ctx.moveTo(a[0].x, a[0].y);
    ctx.lineTo(a[1].x, a[1].y);
    ctx.lineTo(a[2].x, a[2].y);
    ctx.lineTo(a[0].x, a[0].y);
    ctx.stroke();
    ctx.closePath();
  }
}

function fillTriangles(){
 
  //create palette
  var seq = palette('tol-sq', validTriangles.length);
  var div = palette(['tol-sq', 'diverging'], validTriangles.length);
  for(var i = 0; i < validTriangles.length; i++)
  {
    var a = validTriangles[i];
    ctx.beginPath();
    ctx.fillStyle="#" + div[i];
    ctx.strokeStyle="#" + div[i];
    ctx.lineWidth="3";
    ctx.moveTo(a[0].x, a[0].y);
    ctx.lineTo(a[1].x, a[1].y);
    ctx.lineTo(a[2].x, a[2].y);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
}


function drawCircles(){

  for(var i = 0; i < validTriangles.length; i++)
  {
    var a = validTriangles[i];
    var center = CalculateCircleCenter(a);
    var radius = dist(center.x - a[0].x, center.y - a[0].y);
    ctx.beginPath();
    ctx.strokeStyle = "rgb(255,0,0)";
    ctx.lineWidth="1";
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
  }
}

function drawAllCircleCombinations(){
  var cmb = Combinatorics.combination(nodes, 3);
  while(a = cmb.next()) 
  {
    var center = CalculateCircleCenter(a);
    var radius = dist(center.x - a[0].x, center.y - a[0].y);
    ctx.beginPath();
    ctx.strokeStyle = "rgb(215,215,215)";
    ctx.lineWidth="1";
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
  }
}



function isPointInsideSphere(a, D)
{
  // now sorted in counterclockwise order
  var center = CalculateCircleCenter(a);
  a.sort(function(p1,p2){
    var angle1 = Math.atan2(p1.y - center.y,p1.x - center.x);
    var angle2 = Math.atan2(p2.y - center.y,p2.x - center.x);
    if (angle1 < angle2) return -1;
    else if (angle1 > angle2) return 1;
    return 0;
  });

  var A,B,C;
  A = a[0];
  B = a[1];
  C = a[2];
  
  // write out determinant
  var val =  (A.x - D.x) * ((B.y - D.y) * ((Math.pow(C.x,2) - Math.pow(D.x,2))+(Math.pow(C.y,2)-Math.pow(D.y,2)))
                          - (C.y - D.y) * ((Math.pow(B.x,2) - Math.pow(D.x,2))+(Math.pow(B.y,2)-Math.pow(D.y,2))))
           - (B.x - D.x) * ((A.y - D.y) * ((Math.pow(C.x,2) - Math.pow(D.x,2))+(Math.pow(C.y,2)-Math.pow(D.y,2)))
                          - (C.y - D.y) * ((Math.pow(A.x,2) - Math.pow(D.x,2))+(Math.pow(A.y,2)-Math.pow(D.y,2))))
           + (C.x - D.x) * ((A.y - D.y) * ((Math.pow(B.x,2) - Math.pow(D.x,2))+(Math.pow(B.y,2)-Math.pow(D.y,2)))
                          - (B.y - D.y) * ((Math.pow(A.x,2) - Math.pow(D.x,2))+(Math.pow(A.y,2)-Math.pow(D.y,2))));

  // if value is greater than zero, this means that point is inside or on circumcircle
  
  return val;
}

function CalculateCircleCenter(a)
{
  var A = a[0]; var B = a[1]; var C = a[2];
  var yDelta_a = B.y - A.y;
  var xDelta_a = B.x - A.x;
  var yDelta_b = C.y - B.y;
  var xDelta_b = C.x - B.x;
  center = [];
  var aSlope = yDelta_a / xDelta_a;
  var bSlope = yDelta_b / xDelta_b;
  center.x = (aSlope*bSlope*(A.y - C.y) + bSlope*(A.x + B.x) - aSlope*(B.x+C.x) )/(2* (bSlope-aSlope) );
  center.y = -1*(center.x - (A.x+B.x)/2)/aSlope +  (A.y+B.y)/2;
  return center;
}

function drawNodes()
{
  for (i = 0; i < nodes.length; i++) {
    if(i >= 0){
      ctx.strokeStyle = "rgb(215,215,215)";
    }
    // ctx.strokeStyle = "rgb(0,0,0)";
    ctx.beginPath();
    ctx.arc(nodes[i].x, nodes[i].y, nodes[i].radius, 0, 2 * Math.PI);
    // ctx.font="20px Georgia";
    // ctx.fillText(i,nodes[i].x + nodes[i].radius,nodes[i].y+nodes[i].radius);
    ctx.fillStyle = '#000000';
    ctx.fill();
  }
  ctx.beginPath();
  ctx.lineWidth="3";
  ctx.rect(pad-2*rad,pad-2*rad,canvas.width-2*pad + 4*rad,canvas.height-2*pad+4*rad);
  ctx.stroke();

}

function draw() {
  // console.log(canvas.width)
  // console.log(canvas.height)

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // drawAllCircleCombinations(); // very expensive
  //
  delaunay();
  if(voronoi_steps.add_colour)
    fillTriangles();
  if(voronoi_steps.draw_lines)
    drawTriangles();
  if(voronoi_steps.draw_circles)
    drawCircles();
  if(voronoi_steps.draw_dots)
    drawNodes();

  window.requestAnimationFrame(draw);
}

var gui = new dat.GUI();

gui.add(voronoi_steps, 'draw_dots').listen().onChange(function(value){ 
  voronoi_steps.step_1 = value; 
});
gui.add(voronoi_steps, 'draw_circles').listen().onChange(function(value){ 
  voronoi_steps.step_2 = value; 
});
gui.add(voronoi_steps, 'draw_lines').listen().onChange(function(value){ 
  voronoi_steps.step_3 = value; 
});
gui.add(voronoi_steps, 'add_colour').listen().onChange(function(value){ 
  voronoi_steps.step_4 = value; 
});

window.requestAnimationFrame(draw);
