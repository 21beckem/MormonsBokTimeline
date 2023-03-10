let canvas, circles, timeline;
let controls = {
  view: {x: 0, y: 0, zoom: 1},
  viewPos: { prevX: null,  prevY: null,  isDragging: false },
}
const historyData = [
  {
    "title" : "Lehi Leaves Jerusalem",
    "pos" : 0
  }
]

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  controls.view.x = width / 2;
  controls.view.y = height / 2;
  controls.view.zoom = width / (1000 + 50);
  canvas.mouseWheel(e => Controls.zoom(controls).worldZoom(e));
  // - - - - - - - - - - - - - - - - - - - - - -
  circles = Circle.create(100);
  
  timeline = new Timeline(historyData);
}

function draw() {
  background(100);
  translate(controls.view.x, controls.view.y);
  scale(controls.view.zoom);
  // - - - - - - - - - - - - - - - - - - - - - -
  circles.forEach(circle => circle.show());
  
  timeline.draw(controls.view.zoom);
}

window.mousePressed = e => Controls.move(controls).mousePressed(e);
window.mouseDragged = e => Controls.move(controls).mouseDragged(e);
window.mouseReleased = e => Controls.move(controls).mouseReleased(e);


class Controls {
  static move(controls) {
    function mousePressed(e) {
      controls.viewPos.isDragging = true;
      controls.viewPos.prevX = e.clientX;
      controls.viewPos.prevY = e.clientY;
    }

    function mouseDragged(e) {
      const {prevX, prevY, isDragging} = controls.viewPos;
      if(!isDragging) return;

      const pos = {x: e.clientX, y: e.clientY};
      const dx = pos.x - prevX;
      const dy = pos.y - prevY;

      if(prevX || prevY) {
        controls.view.x += dx;
        controls.view.y += dy;
        controls.viewPos.prevX = pos.x, controls.viewPos.prevY = pos.y;
      }
    }

    function mouseReleased(e) {
      controls.viewPos.isDragging = false;
      controls.viewPos.prevX = null;
      controls.viewPos.prevY = null;
    }
 
    return {
      mousePressed, 
      mouseDragged, 
      mouseReleased
    };
  }

  static zoom(controls) {
    // function calcPos(x, y, zoom) {
    //   const newX = width - (width * zoom - x);
    //   const newY = height - (height * zoom - y);
    //   return {x: newX, y: newY}
    // }

    function worldZoom(e) {
      const {x, y, deltaY} = e;
      const direction = deltaY > 0 ? -1 : 1;
      const factor = 0.1;
      const zoom = 1 * direction * factor * controls.view.zoom;

      const wx = (x-controls.view.x)/(width*controls.view.zoom);
      const wy = (y-controls.view.y)/(height*controls.view.zoom);
      
      controls.view.x -= wx*width*zoom;
      controls.view.y -= wy*height*zoom;
      controls.view.zoom += zoom;
    }

    return {worldZoom};
  }
}


class Circle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  show() {
    fill(110);
    noStroke();
    ellipse(this.x, this.y, 10, 10);
  }
  
  static create(count) {
    return Array.from(Array(count), () => {
      const x = random(-500, width + 500);
      const y = random(-500, height + 500);
      return new this(x, y);
    })
  }
}
class Timeline {
  constructor(data) {
    this.data = data;
  }
  draw(zoom) {
    // figure out line thickness
    const thickness = 7 / zoom;
    // draw main line
    stroke(225);
    strokeWeight(thickness);
    line(-500, 0, 500, 0);
  }
}
