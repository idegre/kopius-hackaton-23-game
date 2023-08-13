"use strict";
console.log("begin");
const size = window.screen.width == window.innerWidth ? 300 : window.innerWidth * 0.8;
const scale = 3;
const drawHint = (ctx) => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.setLineDash([30]);
    const r = size * 0.4 * scale;
    const center = (size / 2) * scale;
    //vertical
    ctx.beginPath();
    ctx.moveTo((size / 2) * scale, size * 0.1 * scale);
    ctx.lineTo((size / 2) * scale, size * 0.9 * scale);
    ctx.stroke();
    ctx.closePath();
    //diagonal1
    ctx.beginPath();
    ctx.moveTo(center + (r * Math.sin(45)), center + (r * Math.cos(45)));
    ctx.lineTo(center - (r * Math.sin(45)), center - (r * Math.cos(45)));
    ctx.stroke();
    ctx.closePath();
    //diagonal2
    ctx.beginPath();
    ctx.moveTo(center + (r * Math.sin(-45)), center + (r * Math.cos(-45)));
    ctx.lineTo(center - (r * Math.sin(-45)), center - (r * Math.cos(-45)));
    ctx.stroke();
    ctx.closePath();
    ctx.setLineDash([]);
};
const pointDistance = (p1x, p1y, p2x, p2y) => {
    const a = p1x - p2x;
    const b = p1y - p2y;
    return Math.sqrt(a * a + b * b);
};
const calculatePointScore = (px, py) => {
    const r = size * 0.4 * scale;
    const center = (size / 2) * scale;
    if (((py > (size * 0.1 * scale))) && (py < (size * 0.9 * scale))) {
        const d = pointDistance(px, py, (size / 2) * scale, py);
        if (d < 14) {
            return 1;
        }
        else {
            if ((py < (center + (r * Math.cos(45)))) && (py > center - (r * Math.cos(45)))) {
                const y1 = center + (r * Math.cos(45));
                const y2 = center - (r * Math.cos(45));
                const x1 = center + (r * Math.sin(45));
                const x2 = center - (r * Math.sin(45));
                var slope = (y2 - y1) / (x2 - x1);
                const lx = ((py - y1) / slope) + x1;
                const d = pointDistance(px, py, lx, py);
                if (d < 14) {
                    return 1;
                }
                const y12 = center + (r * Math.cos(45));
                const y22 = center - (r * Math.cos(45));
                const x12 = center + (r * Math.sin(45));
                const x22 = center - (r * Math.sin(45));
                var slope2 = (y22 - y12) / (x22 - x12);
                const lx2 = ((py - y12) / slope2) + x12;
                const d2 = pointDistance(px, py, lx2, py);
                if (d2 < 14) {
                    return 1;
                }
                return 0;
            }
            else {
                return 0;
            }
        }
    }
    else {
        return 0;
    }
};
let score = 0;
//@ts-ignore
const requestAnimationFrameOpt = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;
let strokes = [];
let mouseDown = false;
let timer = null;
let playing = true;
const win = () => {
    clearTimeout(timer);
    const logo = document.getElementById('bigLogo');
    const text = document.getElementById('kopiusText');
    const canvas = document.getElementById("canvas");
    console.log(logo);
    playing = false;
    if (logo) {
        console.log('adding class');
        canvas.style.display = "none";
        logo.classList.add("logoWin");
        logo.style.display = 'block';
        text.style.display = 'block';
    }
    drawScore();
};
const lose = () => {
    if (playing) {
        const logo = document.getElementById('sad');
        const canvas = document.getElementById("canvas");
        if (logo) {
            console.log('adding class');
            canvas.style.display = "none";
            logo.classList.add("logoWin");
            logo.style.display = 'block';
            logo.style.margin = "25px";
        }
    }
};
const drawScore = () => {
    const scoreCounter = document.getElementById('scoreCounter');
    const button = document.getElementById('tryAgain');
    if (scoreCounter) {
        scoreCounter.style.visibility = "visible";
        scoreCounter.textContent = `Score: ${score}`;
        button.style.display = "block";
    }
};
const checkWinLoss = () => {
    if ((score > 70) && (strokes.length < 5) && (strokes.length > 2)) {
        console.log('win');
        drawScore();
        win();
        return;
    }
    if ((score < 90) && (strokes.length > 3)) {
        console.log('loss');
        drawScore();
        lose();
    }
};
const drawNewPoint = (x, y, points, ctx) => {
    const ex = x * scale;
    const ey = y * scale;
    if (points.length === 0) {
        ctx.moveTo(ex, ey);
        points.push([ex, ey]);
        ctx.stroke();
    }
    else {
        if (pointDistance(points[points.length - 1][0], points[points.length - 1][1], ex, ey) > 5) {
            ctx.lineTo(ex, ey);
            points.push([ex, ey]);
            ctx.stroke();
        }
    }
};
const render = () => {
    console.log('loaded');
    const canvas = document.getElementById("canvas");
    const winImg = document.getElementById("bigLogo");
    const sadImg = document.getElementById("sad");
    const ctx = canvas.getContext("2d");
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    winImg.style.width = size * 0.83 + 'px';
    winImg.style.height = size * 0.83 + 'px';
    sadImg.style.width = size * 0.83 + 'px';
    sadImg.style.height = size * 0.83 + 'px';
    canvas.width = size * scale;
    canvas.height = size * scale;
    let points = [];
    if (ctx) {
        drawHint(ctx);
        ctx.lineWidth = (size / 10) * scale;
        const gradient = ctx.createLinearGradient(0, (size / 2) * scale, size * scale, (size / 2) * scale);
        gradient.addColorStop(0, "rgb(247, 63, 93)");
        gradient.addColorStop(0.2, "rgb(247, 63, 93)");
        gradient.addColorStop(0.8, "rgb(153, 0, 127)");
        gradient.addColorStop(1, "rgb(153, 0, 127)");
        ctx.fillStyle = "rgb(247, 63, 93)";
        ctx.strokeStyle = gradient;
        ctx.lineCap = 'round';
        canvas.addEventListener("mousedown", () => {
            mouseDown = true;
            ctx.beginPath();
            clearTimeout(timer);
        });
        canvas.addEventListener("touchstart", () => {
            mouseDown = true;
            ctx.beginPath();
            clearTimeout(timer);
        });
        const endStroke = () => {
            if (mouseDown) {
                mouseDown = false;
                ctx.stroke();
                ctx.closePath();
                strokes.push(points);
                points.forEach(p => {
                    score = score + calculatePointScore(p[0], p[1]);
                });
                points = [];
                checkWinLoss();
                timer = setTimeout(() => { drawScore(), console.log('timeout'), lose(); }, 1500);
            }
        };
        canvas.addEventListener("mouseup", endStroke);
        canvas.addEventListener("touchcancel", endStroke);
        canvas.addEventListener("touchend", endStroke);
        document.addEventListener('blur', endStroke);
        canvas.addEventListener("mouseleave", endStroke);
        canvas.addEventListener("touchmove", e => {
            var rect = canvas.getBoundingClientRect();
            var x = e.targetTouches[0].pageX - rect.left;
            var y = e.targetTouches[0].pageY - rect.top;
            if (mouseDown) {
                drawNewPoint(x, y, points, ctx);
                e.preventDefault();
            }
        });
        canvas.addEventListener("mousemove", (e) => {
            if (mouseDown) {
                drawNewPoint(e.offsetX, e.offsetY, points, ctx);
            }
        });
    }
    else {
        console.error('canvas not suppoerted');
    }
};
window.addEventListener('DOMContentLoaded', render);
