document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('triangleCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 600;
    canvas.height = 400;

    const vertices = [
        { x: 0, y: -100 },    
        { x: -100, y: 100 },  
        { x: 100, y: 100 }    
    ];

    let angle = 0;
    const initialColor = '#ff6347';
    let currentColor = initialColor;
    let isTriangleClicked = false;

    function drawTriangle() {
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.translate(canvas.width / 2, canvas.height / 2);

        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);
        ctx.lineTo(vertices[1].x, vertices[1].y);
        ctx.lineTo(vertices[2].x, vertices[2].y);
        ctx.closePath();

        ctx.fillStyle = currentColor;
        ctx.fill();

        ctx.strokeStyle = '#000000'; 
        ctx.stroke();

        ctx.restore();

        angle += Math.PI / 180;
        requestAnimationFrame(drawTriangle);
    }

    function isPointInTriangle(px, py, vertices) {
        const [A, B, C] = vertices;
        const v0 = [C.x - A.x, C.y - A.y];
        const v1 = [B.x - A.x, B.y - A.y];
        const v2 = [px - A.x, py - A.y];

        const dot00 = v0[0] * v0[0] + v0[1] * v0[1];
        const dot01 = v0[0] * v1[0] + v0[1] * v1[1];
        const dot02 = v0[0] * v2[0] + v0[1] * v2[1];
        const dot11 = v1[0] * v1[0] + v1[1] * v1[1];
        const dot12 = v1[0] * v2[0] + v1[1] * v2[1];

        const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
        const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        return (u >= 0) && (v >= 0) && (u + v < 1);
    }

    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left - canvas.width / 2;
        const mouseY = event.clientY - rect.top - canvas.height / 2;

        const rotatedX = mouseX * Math.cos(-angle) - mouseY * Math.sin(-angle);
        const rotatedY = mouseX * Math.sin(-angle) + mouseY * Math.cos(-angle);

        if (isPointInTriangle(rotatedX, rotatedY, vertices)) {
            if (!isTriangleClicked) {
                currentColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
                isTriangleClicked = true;
            }
        } else {
            if (isTriangleClicked) {
                currentColor = initialColor;
                isTriangleClicked = false;
            }
        }
    });

    drawTriangle();
});
