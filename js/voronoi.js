// ideas
// maps : nodes correspond to places?

var mx, my; 
var isDrag = false;
var mySel, mySeli;
var rad = 4;
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

var pad = 100;

var voronoi_steps = { 
  draw_dots : true, 
  draw_circles : false, 
  drawAllCircleCombinations: false,
  draw_lines : true,
  add_colour : false
};

// if (document.defaultView && document.defaultView.getComputedStyle) {
//   stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], pad)      || 0;
//   stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], pad)       || 0;
//   styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], pad)  || 0;
//   styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], pad)   || 0;
// }

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

var nodes_num = 30;
var nodes_count = 0;

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

function length(x,y)
{
  return Math.sqrt(x*x + y*y)
}

function pushNode(ax, ay, fixed)
{
  var node = {
    x: ax,
    y: ay,
    radius: rad,
    x_vel: 0, 
    y_vel: 0, 
    fix: fixed
  };
  nodes.push(node);
  nodes_count+=1;
}

var fixed=false

console.log(canvas.width)
console.log(canvas.height)

for(i=0;i<nodes_num;i++){
  var node = {
    x: getRand(pad+rad,canvas.width-pad-rad),
    y: getRand(pad+rad,canvas.height-pad-rad),
    radius: rad,
    x_vel: 0, 
    y_vel: 0, 
    fix: fixed
  };
  nodes.push(node);
}

// pushNode(3+pad,3+pad,true);
// pushNode(canvas.width-3-pad,3+pad,true);
// pushNode(canvas.width-3-pad,canvas.height-3-pad,true);
// pushNode(3+pad,canvas.height-3-pad,true);

// for(var i=0;i<nodes_num;i++){
//   pushNode(getRand(pad,canvas.width-pad),getRand(pad,canvas.height-pad),false)
// }

nodes_count += nodes_num;
console.log(nodes_count);

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
  var l = nodes_count;

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
    for(var i = 0; i < nodes_count; i++){
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
    ctx.lineWidth="1.5";
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
  var div = palette(['tol-rainbow', 'sequential-cbf'], validTriangles.length);
  // var div = palette('Blue', validTriangles.length);
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

  //try ordering triangles by centroid position and colour accordingly 
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
  // ctx.beginPath();
  // ctx.lineWidth="3";
  // ctx.rect(pad-2*rad,pad-2*rad,canvas.width-2*pad + 4*rad,canvas.height-2*pad+4*rad);
  // ctx.stroke();

}

noise.seed(Math.random());
var speed = 1;
var step = 40;
var val = 0;

function ComputeCurl3(x, y, z)  
{ 
  var eps = 0.001;  
  var n1, n2, a, b;  

  n1  = noise.simplex3(x, y + eps, z); 
  n2  = noise.simplex3(x, y - eps, z); 
  a = (n1 - n2)/(2 * eps); 
  
  n1  = noise.simplex3(x + eps, y, z); 
  n2  = noise.simplex3(x - eps, y, z); 
  b = (n1 - n2)/(2 * eps); 

  return [a,-b];
}


function ComputeCurl(x, y)  
{ 
  var eps = 0.001;  
  var n1, n2, a, b;  

  n1  = noise.simplex2(x, y + eps); 
  n2  = noise.simplex2(x, y - eps); 
  a = (n1 - n2)/(2 * eps); 
  
  n1  = noise.simplex2(x + eps, y); 
  n2  = noise.simplex2(x - eps, y); 
  b = (n1 - n2)/(2 * eps); 

  return [a,-b];
}

function particleBoundaries()
{
  for(i=0; i < nodes.length; i++)
  {
    if(nodes[i].fix == true)
    {
      //do nothing
      nodes[i].x_vel = 0;
      nodes[i].y_vel = 0;
    }
    else if(nodes[i].x > canvas.width){
      // nodes[i].x = getRand(pad,canvas.width-pad);
      nodes[i].x_vel = -nodes[i].x_vel;
    }
    else if(nodes[i].x < nodes[i].radius) { 
      // nodes[i].x = getRand(pad,canvas.width-pad);
      nodes[i].x_vel = -nodes[i].x_vel;
    }
    else if(nodes[i].y > canvas.height){
      // nodes[i].y = getRand(pad,canvas.height-pad);
      nodes[i].y_vel = -nodes[i].y_vel;
    }
    else if(nodes[i].y < nodes[i].radius) { 
      // nodes[i].y = getRand(pad,canvas.height-pad);
      nodes[i].y_vel = -nodes[i].y_vel;
    }
    nodes[i].x += nodes[i].x_vel;
    nodes[i].y += nodes[i].y_vel;
  }

}


function move()
{
  particleBoundaries();

  // 
  for(i=0; i < nodes.length; i++)
  {
    // var a = noise.simplex3(particles[i].x/canvas.width, particles[i].y/canvas.height,val);
    var curl = ComputeCurl3(nodes[i].x/step, nodes[i].y/step, val);

    nodes[i].x_vel = speed*curl[0];// /Math.sqrt(Math.pow(curl[0]) + Math.pow(curl[1]));
    nodes[i].y_vel = speed*curl[1];///Math.sqrt(Math.pow(curl[0]) + Math.pow(curl[1]));
    ctx.beginPath();
    ctx.fillStyle = "#00008B";
    ctx.moveTo(nodes[i].x, nodes[i].y);
    ctx.arc(nodes[i].x, nodes[i].y, nodes[i].radius, 0, 2 * Math.PI);
    ctx.fill();
  }
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;
}

function draw() {
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;
  // drawAllCircleCombinations(); // very expensive
  var fade = 1.0;
  ctx.fillStyle = 'rgba(255, 255, 255, '+ fade + ')';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  delaunay();
  // move();

  if(voronoi_steps.add_colour)
    fillTriangles();
  if(voronoi_steps.draw_lines)
    drawTriangles();
  if(voronoi_steps.draw_circles)
    drawCircles();
  if(voronoi_steps.drawAllCircleCombinations)
    drawAllCircleCombinations();
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
gui.add(voronoi_steps, 'drawAllCircleCombinations').listen().onChange(function(value){ 
  voronoi_steps.step_3 = value; 
});
gui.add(voronoi_steps, 'draw_lines').listen().onChange(function(value){ 
  voronoi_steps.step_4 = value; 
});
gui.add(voronoi_steps, 'add_colour').listen().onChange(function(value){ 
  voronoi_steps.step_5 = value; 
});

window.requestAnimationFrame(draw);
