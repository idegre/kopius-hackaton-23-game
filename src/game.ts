console.log("begin");

const size = 300
const scale = 3;

const drawHint = (ctx: CanvasRenderingContext2D) => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.setLineDash([30])
    const r = size * 0.4 * scale
    const center = (size / 2) * scale
    //vertical
    ctx.beginPath();
    ctx.moveTo((size / 2) * scale, size * 0.1 * scale)
    ctx.lineTo((size / 2) * scale, size * 0.9 * scale)
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
    ctx.setLineDash([])

}

const pointDistance = (p1x: number, p1y: number, p2x: number, p2y: number) => {
    const a = p1x - p2x;
    const b = p1y - p2y;

    return Math.sqrt(a * a + b * b);
}

const calculatePointScore = (px: number, py: number): number => {
    const r = size * 0.4 * scale
    const center = (size / 2) * scale
    if (((py > (size * 0.1 * scale))) && (py < (size * 0.9 * scale))) {
        const d = pointDistance(px, py, (size / 2) * scale, py)
        if (d < 10) {
            return 1
        } else {
            if ((py < (center + (r * Math.cos(45)))) && (py > center - (r * Math.cos(45)))) {
                console.log('solving for diagonals')
                const y1 = center + (r * Math.cos(45))
                const y2 = center - (r * Math.cos(45))
                const x1 = center + (r * Math.sin(45))
                const x2 = center - (r * Math.sin(45))
                var slope = (y2 - y1) / (x2 - x1);
                const lx = ((py - y1) / slope) + x1;
                const d = pointDistance(px, py, lx, py)
                if (d < 10) {
                    return 1
                }
                const y12 = center + (r * Math.cos(45))
                const y22 = center - (r * Math.cos(45))
                const x12 = center + (r * Math.sin(45))
                const x22 = center - (r * Math.sin(45))
                var slope2 = (y22 - y12) / (x22 - x12);
                const lx2 = ((py - y12) / slope2) + x12;
                const d2 = pointDistance(px, py, lx2, py)
                if (d2 < 10) {
                    return 1
                }
                return 0
            } else {
                return 0
            }
        }
    } else {
        return 0
    }
}
let score = 0

type Point = [number, number]
//@ts-ignore
const requestAnimationFrameOpt = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;


let strokes: Point[][] = []
let mouseDown = false

const checkWinLoss = () => {
    if ((score > 90) && (strokes.length < 5)) {
        console.log('win')
        return
    }

    if (strokes.flat().length > 400 && strokes.length > 5) {
        console.log('loss')
    }
}

const render = () => {
    console.log('loaded')
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const svg = document.querySelector("svg")


    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    canvas.width = size * scale;
    canvas.height = size * scale;
    let points: Point[] = []
    if (ctx) {
        drawHint(ctx)
        ctx.lineWidth = (size / 10) * scale;
        const gradient = ctx.createLinearGradient(0, (size / 2) * scale, size * scale, (size / 2) * scale);
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
        const endStroke = () => {
            if (mouseDown) {
                mouseDown = false
                ctx.stroke();
                ctx.closePath();
                strokes.push(points)
                points.forEach(p => {
                    score = score + calculatePointScore(p[0], p[1])
                })
                points = []
                checkWinLoss()
            }
        }
        canvas.addEventListener("mouseup", endStroke)
        document.addEventListener('blur', endStroke)
        canvas.addEventListener("mouseleave", endStroke)
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

