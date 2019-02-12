/* eslint-disable no-param-reassign */
import size from 'lodash/size';

import forEach from 'lodash/forEach';

import QR from 'bg-canvases';

import Vector from './figures/vector';

import makeSquares from './makeSquares';

// Setting highest dpi for canvas
const setDPI = (canvas, dpi) => {
    // Set up CSS size.
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;

    // Resize canvas and scale future draws.
    const scaleFactor = dpi / 96;
    canvas.width = Math.ceil(canvas.width * scaleFactor);
    canvas.height = Math.ceil(canvas.height * scaleFactor);
    const ctx = canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);
};
// Empty data
let data = '';

// Getting dom elements
const canvas = document.getElementById('qrCanvas');

const clearButton = document.getElementById('clear-button');

const fname = document.getElementById('fname');

const lname = document.getElementById('lname');

const createButton = document.getElementById('create-button');

const country = document.getElementById('country');

// Function that resizes canvas, and updates DPI
const updateCanvasSize = () => {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    setDPI(canvas, window.devicePixelRatio + 1 * 96);
};
updateCanvasSize();

// Getting context
const ctx = canvas.getContext('2d');

// Creating bg-canvases instance
const qr = new QR();

// Basic animation, squares looking for their target position
const basicQrAnimation = (s) => {
    if (s.active) {
        // Is square is active updating it
        s.lookFor().update();
        // If square target too far, reseting it's position to initial state
        if (s.pos.distanceTo(s.initialTarget) > canvas.width * 1.5) {
            s.resetPos();
        }
    }
};

// Creatring layer
qr.createLayer(ctx, 'qr', () => { }, 0, basicQrAnimation);

// Animation loo[]
const animationLoop = () => {
    qr.draw().animate();
    window.requestAnimationFrame(animationLoop);
};
window.requestAnimationFrame(animationLoop);

// Mouse or touch hovering effect
const hoverEvent = (e, distOn, distTo, rect) => (square) => {
    if (square.active) {
        // Creating mouse / touch position vector
        const v = new Vector(e.clientX - rect.left, e.clientY - rect.top);
        // Calculating distance from square to mouse / touch pos
        const dist = square.initialTarget.distanceTo(v);
        if (dist < distOn && dist > distTo) {
            // If fistance is in limits, making mouse position squares target
            square.setTarget(v);
            // Setting slow random speed
            square.setSpeed(0.01 * Math.random());
            // Making color effect
            const color = 90 - square.pos.distanceTo(v);
            square.setColor(`rgb(${60 + color},${color},${color})`);
        } else {
            // If beyound limis resetting target and color
            square.resetTarget();
            square.setColor('black');
        }
    }
};
// Listener forevent
const movingListener = (e) => {
    const rect = canvas.getBoundingClientRect();
    qr.applyOnEach(hoverEvent(e, 30, 10, rect), 'qr');
};
// Set listener
canvas.addEventListener('mousemove', movingListener);

// Resetting targets when mouse / touch out
canvas.addEventListener('mouseout', () => {
    qr.applyOnEach((square) => {
        if (square.active) {
            square.resetTarget();
            square.setSpeed(5);
            square.setColor('black');
        }
    }, 'qr');
});
window.addEventListener('touchend', () => {
    qr.applyOnEach((square) => {
        if (square.active) {
            square.resetTarget();
            square.setSpeed(5);
            square.setColor('black');
        }
    }, 'qr');
});

// Touch dublicates
canvas.addEventListener('touchmove', (evt) => {
    evt.preventDefault();
    const rect = canvas.getBoundingClientRect();
    forEach(evt.changedTouches, e => qr.applyOnEach(hoverEvent(e, 90, 0, rect), 'qr'));
});

canvas.addEventListener('touchstart', (evt) => {
    evt.preventDefault();
    const rect = canvas.getBoundingClientRect();
    forEach(evt.changedTouches, e => qr.applyOnEach(hoverEvent(e, 90, 0, rect), 'qr'));
});

// Resize event
window.addEventListener('resize', () => {
    updateCanvasSize();
    // Updating table if data available
    if (data) {
        const newWidth = parseInt(canvas.style.width, 10);

        const newSquares = makeSquares(data, newWidth);

        qr.createLayer(ctx, 'qr', i => newSquares[i], size(newSquares), basicQrAnimation);
    }
});
// 'Flush' animation
const hide = (s) => {
    // Creating far target below canvas
    const far = new Vector(canvas.width * Math.random(), canvas.height * 2);
    // Setting target
    s.setTarget(far);
    // Default updating
    s.lookFor().update();
    // Setting speef
    s.setSpeed(1 * Math.random());
    // If square is beyound canvas border, deactivate it
    if (s.pos.y > canvas.height) {
        s.hide();
        s.deactivate();
    }
};

// Clear button event
clearButton.onclick = () => {
    data = '';
    lname.value = '';
    fname.value = '';
    // Blocking mouse move listener
    canvas.removeEventListener('mousemove', movingListener);
    // Setting hide animation
    qr.getLayer('qr').setAnimation(hide);
};
// Creating new qr code
createButton.onclick = () => {
    // Adding listener
    canvas.addEventListener('mousemove', movingListener);
    // Recievung data
    const firstName = fname.value;

    const lastName = lname.value;
    // Adding warnings if data field is empty
    if (!firstName) {
        fname.classList.add('warning');
    }
    if (!lastName) {
        lname.classList.add('warning');
    }
    if (firstName && lastName) {
        // Creating new squares table
        const newWidth = parseInt(canvas.style.width, 10);
        data = `Name: ${firstName} ${lastName}, Country: ${country.value}`;
        const newSquares = makeSquares(data, newWidth, false);
        // Setting layer
        qr.createLayer(ctx, 'qr', i => newSquares[i], size(newSquares), basicQrAnimation);
    }
};
// On input remove warning
lname.oninput = () => {
    lname.classList.remove('warning');
};
fname.oninput = () => {
    fname.classList.remove('warning');
};
