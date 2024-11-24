const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

function drawFractal() {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const cx = (x - width / 2) / (width / 4);
            const cy = (y - height / 2) / (height / 4);
            let zx = 0, zy = 0, iter = 0;
            const maxIter = 100;

            while (zx * zx + zy * zy < 4 && iter < maxIter) {
                const tmp = zx * zx - zy * zy + cx;
                zy = 2 * zx * zy + cy;
                zx = tmp;
                iter++;
            }

            const color = iter === maxIter ? 0 : (iter * 255 / maxIter);
            ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

drawFractal();
