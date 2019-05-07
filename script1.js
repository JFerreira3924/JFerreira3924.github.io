// P_4_3_1_01
//
// Generative Gestaltung – Creative Coding im Web
// ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * pixel mapping. each pixel is translated into a new element
 *
 * MOUSE
 * position x/y        : various parameters (depending on draw mode)
 *
 * KEYS
 * 1-9                 : switch draw mode
 * s                   : save png
 */
'use strict';

var drawMode = 1;

var img;

var maxCount = 5000; // max count of the cirlces
var currentCount = 1;
var x = [];
var y = [];
var r = [];
var isSwitch = false;

function preload() {
  img = loadImage('data/Joe.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  if(isSwitch==false){
    background(255);

  var mouseXFactor = map(mouseX, 0, width, 0.05, 1);
  var mouseYFactor = map(mouseY, 0, height, 0.05, 1);

  for (var gridX = 0; gridX < img.width; gridX++) {
    for (var gridY = 0; gridY < img.height; gridY++) {
      // grid position + tile size
      var tileWidth = width / img.width;
      var tileHeight = height / img.height;
      var posX = tileWidth * gridX;
      var posY = tileHeight * gridY;

      // get current color
      img.loadPixels();
      var c = color(img.get(gridX, gridY));
      // greyscale conversion
      var greyscale = round(red(c) * 0.222 + green(c) * 0.707 + blue(c) * 0.071);

      switch (drawMode) {
      case 1:
        // greyscale to stroke weight
        var w1 = map(greyscale, 0, 255, 15, 0.1);
        stroke(0);
        strokeWeight(w1 * mouseXFactor);
        line(posX, posY, posX + 5, posY + 5);
        break;
      case 2:
        // greyscale to ellipse area
        fill(0);
        noStroke();
        var r2 = 1.1284 * sqrt(tileWidth * tileWidth * (1 - greyscale / 255));
        r2 *= mouseXFactor * 3;
        ellipse(posX, posY, r2, r2);
        break;
      case 3:
        // greyscale to line length
        var l3 = map(greyscale, 0, 255, 30, 0.1);
        l3 *= mouseXFactor;
        stroke(0);
        strokeWeight(10 * mouseYFactor);
        line(posX, posY, posX + l3, posY + l3);
        break;
      case 4:
        // greyscale to rotation, line length and stroke weight
        stroke(0);
        var w4 = map(greyscale, 0, 255, 10, 0);
        strokeWeight(w4 * mouseXFactor + 0.1);
        var l4 = map(greyscale, 0, 255, 35, 0);
        l4 *= mouseYFactor;
        push();
        translate(posX, posY);
        rotate(greyscale / 255 * PI);
        line(0, 0, 0 + l4, 0 + l4);
        pop();
        break;
      case 5:
        // greyscale to line relief
        var w5 = map(greyscale, 0, 255, 5, 0.2);
        strokeWeight(w5 * mouseYFactor + 0.1);
        // get neighbour pixel, limit it to image width
        var c2 = color(img.get(min(gridX + 1, img.width - 1), gridY));
        stroke(c2);
        var greyscale2 = floor(red(c2) * 0.222 + green(c2) * 0.707 + blue(c2) * 0.071);
        var h5 = 50 * mouseXFactor;
        var d1 = map(greyscale, 0, 255, h5, 0);
        var d2 = map(greyscale2, 0, 255, h5, 0);
        line(posX - d1, posY + d1, posX + tileWidth - d2, posY + d2);
        break;
      case 6:
        // pixel color to fill, greyscale to ellipse size
        var w6 = map(greyscale, 0, 255, 25, 0);
        noStroke();
        fill(c);
        ellipse(posX, posY, w6 * mouseXFactor, w6 * mouseXFactor);
        break;
      case 7:
        stroke(c);
        var w7 = map(greyscale, 0, 255, 5, 0.1);
        strokeWeight(w7);
        fill(255, 255 * mouseXFactor);
        push();
        translate(posX, posY);
        rotate(greyscale / 255 * PI * mouseYFactor);
        rect(0, 0, 15, 15);
        pop();
        break;
      case 8:
        noStroke();
        fill(greyscale, greyscale * mouseXFactor, 255 * mouseYFactor);
        rect(posX, posY, 3.5, 3.5);
        rect(posX + 4, posY, 3.5, 3.5);
        rect(posX, posY + 4, 3.5, 3.5);
        rect(posX + 4, posY + 4, 3.5, 3.5);
        break;
      case 9:
        stroke(255, greyscale, 0);
        noFill();
        push();
        translate(posX, posY);
        rotate(greyscale / 255 * PI);
        strokeWeight(1);
        rect(0, 0, 15 * mouseXFactor, 15 * mouseYFactor);
        var w9 = map(greyscale, 0, 255, 15, 0.1);
        strokeWeight(w9);
        stroke(0, 70);
        ellipse(0, 0, 10, 5);
        pop();
        break;
      }
    }
  }
  }
  else{
      strokeWeight(0.5);
   // first circle
  x[0] = width / 2;
  y[0] = height / 2;
  r[0] = 10;
  clear();

  // create a random set of parameters
  var newR = random(1, 7);
  var newX = random(newR, width - newR);
  var newY = random(newR, height - newR);

  var closestDist = Number.MAX_VALUE;
  var closestIndex = 0;
  // which circle is the closest?
  for (var i = 0; i < currentCount; i++) {
    var newDist = dist(newX, newY, x[i], y[i]);
    if (newDist < closestDist) {
      closestDist = newDist;
      closestIndex = i;
    }
  }

  // show original position of the circle and a line to the new position
  // fill(230);
  // ellipse(newX, newY, newR * 2, newR * 2);
  // line(newX, newY, x[closestIndex], y[closestIndex]);

  // aline it to the closest circle outline
  var angle = atan2(newY - y[closestIndex], newX - x[closestIndex]);

  x[currentCount] = x[closestIndex] + cos(angle) * (r[closestIndex] + newR);
  y[currentCount] = y[closestIndex] + sin(angle) * (r[closestIndex] + newR);
  r[currentCount] = newR;
  currentCount++;

  // draw them
  for (var i = 0; i < currentCount; i++) {
    fill(50);
    ellipse(x[i], y[i], r[i] * 2, r[i] * 2);
  }

  if (currentCount >= maxCount) noLoop();
  }
  
}

function mousePressed(){
  if(isSwitch==false){
    isSwitch=true;
  }
  else{
    isSwitch=false;
  }
}