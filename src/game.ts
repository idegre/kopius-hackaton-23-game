console.log("begin");

const drawHint = (ctx: CanvasRenderingContext2D, h: number, w: number) => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    const r = w * 0.4
    const center = w / 2
    //vertical
    ctx.beginPath();
    ctx.moveTo(w / 2, h * 0.1)
    ctx.lineTo(w / 2, h * 0.9)
    ctx.stroke();
    ctx.closePath();
    //diagonal1
    ctx.beginPath();
    ctx.moveTo(center + (r * Math.sin(45)), center + (r * Math.cos(45)))
    ctx.lineTo(center - (r * Math.sin(45)), center - (r * Math.cos(45)))
    ctx.stroke();
    ctx.closePath();
    //diagonal2
    ctx.beginPath();
    ctx.moveTo(center + (r * Math.sin(-45)), center + (r * Math.cos(-45)))
    ctx.lineTo(center - (r * Math.sin(-45)), center - (r * Math.cos(-45)))
    ctx.stroke();
    ctx.closePath();

}

const pointDistance = (p1x: number, p1y: number, p2x: number, p2y: number) => {
    const a = p1x - p2x;
    const b = p1y - p2y;

    return Math.sqrt(a * a + b * b);
}
type Point = [number, number]
//@ts-ignore
const requestAnimationFrameOpt = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;
let mouseDown = false
const render = () => {
    console.log('loaded')
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const svg = document.querySelector("svg")
    let strokes: Point[][] = []
    const size = 300
    var scale = 3;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    canvas.width = size * scale;
    canvas.height = size * scale;
    let points: Point[] = []
    if (ctx) {
        drawHint(ctx, size, size)
        ctx.lineWidth = size / 12;
        const gradient = ctx.createLinearGradient(0, size / 2, size, size / 2);
        gradient.addColorStop(0, "rgb(247, 63, 93)");
        gradient.addColorStop(0.2, "rgb(247, 63, 93)");
        gradient.addColorStop(0.8, "rgb(153, 0, 127)");
        gradient.addColorStop(1, "rgb(153, 0, 127)");
        ctx.fillStyle = "rgb(247, 63, 93)";
        ctx.strokeStyle = gradient
        ctx.lineCap = 'round'
        canvas.addEventListener("mousedown", () => {
            mouseDown = true
            ctx.beginPath();
        })
        canvas.addEventListener("mouseup", () => {
            mouseDown = false
            ctx.stroke();
            ctx.closePath();
            strokes.push(points)
            points = []
            console.log(strokes)
        })
        canvas.addEventListener("mousemove", (e) => {
            if (mouseDown) {
                const ex = e.offsetX * scale
                const ey = e.offsetY * scale
                if (points.length === 0) {
                    ctx.moveTo(ex, ey)
                    points.push([ex, ey])
                    ctx.stroke();
                } else {
                    if (pointDistance(points[points.length - 1][0], points[points.length - 1][1], ex, ey) > 1) {
                        ctx.lineTo(ex, ey)
                        points.push([ex, ey])
                        ctx.stroke();
                    }
                }
            }
        })
    } else {
        console.error('canvas not suppoerted')
    }
}

window.addEventListener('DOMContentLoaded', render)

