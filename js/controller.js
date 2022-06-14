'use strict';

let gCanvas;
let gCtx;
const gCanvasColor = '#eee';
let gEvHandler = false;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

function init() {
  gCanvas = document.querySelector('.my-canvas');
  gCtx = gCanvas.getContext('2d');
  renderCanvas();
  addMouseListeners();
  addTouchListeners();
}

function renderCanvas() {
  gCtx.fillStyle = gCanvasColor;
  gCtx.fillRect(0, 0, gCanvas.width, gCanvas.height);
}

function draw(ev) {
  if (!gEvHandler) return;
  const { x, y } = getEvPos(ev);
  const paint = getPaint();
  switch (paint.shape) {
    case 'triangle':
      drawTriangle(x, y, paint.size, paint.fillColor, paint.strokeColor);
      break;
    case 'square':
      drawSquare(x, y, paint.size, paint.fillColor, paint.strokeColor);
      break;
    case 'circle':
      drawCircle(x, y, paint.size, paint.fillColor, paint.strokeColor);
      break;
    case 'rect':
      drawRect(x, y, paint.size, paint.fillColor, paint.strokeColor);
      break;
    case 'arc':
      drawArc(x, y, paint.size, paint.strokeColor);
      break;
    case 'text':
      drawText(
        x,
        y,
        paint.size,
        paint.text,
        paint.fillColor,
        paint.strokeColor
      );
      break;
  }
}

function clearCanvas() {
  renderCanvas();
}

function drawText(x, y, size, text, fillColor, strokeColor) {
  colorShape(fillColor, strokeColor, false);
  gCtx.font = `${size}px Arial`;
  gCtx.fillText(text, x, y);
  gCtx.strokeText(text, x, y);
}

function drawTriangle(x, y, size, fillColor, strokeColor) {
  startDrawing();

  createTriangle(x, y, size);

  colorShape(fillColor, strokeColor);
}

function drawCircle(x, y, size, fillColor, strokeColor) {
  startDrawing();
  gCtx.arc(x, y, size, 0, Math.PI * 2);
  colorShape(fillColor, strokeColor);
}

function drawSquare(x, y, size, fillColor, strokeColor) {
  startDrawing();
  createRect(x, y, size, strokeColor, true);
  colorRect(x, y, size, fillColor, true);
}

function drawRect(x, y, size, fillColor, strokeColor) {
  startDrawing();
  createRect(x, y, size, strokeColor);
  colorRect(x, y, size, fillColor);
}
function drawArc(x, y, size, strokeColor) {
  startDrawing();
  gCtx.arc(x, y, size, 0, Math.PI);
  colorShape(gCanvasColor, strokeColor);
}

function startDrawing() {
  gCtx.beginPath();
}

function onSetFillClr(color) {
  setFillClr(color);
}
function onSetStorkeClr(color) {
  setStrokeClr(color);
}
function onSetFillClr(color) {
  setFillClr(color);
}

function onSetShape(shape) {
  shape = shape.toLowerCase();
  setShape(shape);
}

function onSetText(ev, elForm) {
  ev.preventDefault();
  const elText = elForm.querySelector('[name=text]');
  setText(elText.value);
  elText.value = '';
}
function onSetSize(ev, elForm) {
  ev.preventDefault();
  const elSize = elForm.querySelector('[name=size]');
  setSize(+elSize.value);
  elSize.value = '';
}

function createTriangle(x, y, size) {
  gCtx.moveTo(x, y);
  gCtx.lineTo(x + size, y + size);
  gCtx.lineTo(y + size, x + size);
  gCtx.closePath();
}

function colorShape(fillColor, strokeColor, isShape = true) {
  gCtx.fillStyle = fillColor;
  isShape && gCtx.fill();
  gCtx.strokeStyle = strokeColor;
  isShape && gCtx.stroke();
}

function createRect(x, y, size, strokeColor, isSquare = false) {
  gCtx.rect(x, y, size, (size = isSquare ? size : size * 2));
  gCtx.strokeStyle = strokeColor;
  gCtx.stroke();
}

function colorRect(x, y, size, fillColor, isSquare = false) {
  gCtx.fillStyle = fillColor;
  gCtx.fillRect(x, y, size, (size = isSquare ? size : size * 2));
}

function addMouseListeners() {
  gCanvas.addEventListener('mousedown', toggleEvHandler);
  gCanvas.addEventListener('mousemove', draw);
  gCanvas.addEventListener('mouseup', toggleEvHandler);
}
function toggleEvHandler(ev) {
  // On end of holding key(touch or mouse) event draw shape
  if (ev.type === 'mouseup' || ev.type === 'touchend') {
    draw(ev);
  }
  gEvHandler = gEvHandler ? false : true;
}

function onSetEvHandlerOff() {
  // If we exit the canvas set evhandler to false
  gEvHandler = false;
}

function addTouchListeners() {
  gCanvas.addEventListener('touchstart', toggleEvHandler);
  gCanvas.addEventListener('touchmove', draw);
  gCanvas.addEventListener('touchend', toggleEvHandler);
}

function getEvPos(ev) {
  //Gets the offset pos , the default pos
  let pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  };
  // Check if its a touch ev
  if (gTouchEvs.includes(ev.type)) {
    //soo we will not trigger the mouse ev
    ev.preventDefault();
    //Gets the first touch point
    ev = ev.changedTouches[0];
    //Calc the right pos according to the touch screen
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    };
  }
  return pos;
}

function downloadImg(elLink) {
  const imgContent = gCanvas.toDataURL('image/jpeg'); // image/jpeg the default format
  elLink.href = imgContent;
}

// The next 2 functions handle IMAGE UPLOADING to img tag from file system:
function onImgInput(ev) {
  loadImageFromInput(ev, renderImg);
}
//                               CallBack func will run on success load of the img
function loadImageFromInput(ev, onImageReady) {
  var reader = new FileReader();
  //After we read the file
  reader.onload = function (event) {
    var img = new Image(); // Create a new html img element
    img.src = event.target.result; // Set the img src to the img file we read
    //Run the callBack func , To render the img on the canvas
    img.onload = onImageReady.bind(null, img);
  };
  reader.readAsDataURL(ev.target.files[0]); // Read the file we picked
}

function renderImg(img) {
  //Draw the img on the canvas
  gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}
