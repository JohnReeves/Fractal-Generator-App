const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

async function fetchFractalSettings() {
    const response = await fetch('/fractal');
    return await response.json();
}

function drawFractal1(settings) {
    const { width, height, max_iter, color_scheme } = settings.settings;
    const { initial_zx, initial_zy, equations, escape_radius } = settings.formula;

    // Dynamically create functions for equations
    const zxEquation = new Function('zx', 'zy', 'cx', 'cy', equations[0].replace(/new/g, ''));
    const zyEquation = new Function('zx', 'zy', 'cx', 'cy', equations[1].replace(/new/g, ''));

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let cx = (x - width / 2) / (width / 4);
            let cy = (y - height / 2) / (height / 4);
            let zx = initial_zx, zy = initial_zy;
            let iter = 0;

            while (zx * zx + zy * zy < escape_radius && iter < max_iter) {
                const zx_new = zxEquation(zx, zy, cx, cy);
                zy_new = zyEquation(zx, zy, cx, cy);
                zx = zx_new;
                //  zy = zy_new;
                iter++;
            }

            // Debugging
            // if (x === 0 && y === 0) {
            //     console.log(`cx: ${cx}, cy: ${cy}, iter: ${iter}`);
            // }

            const color = iter === max_iter ? 0 : (iter * 255 / max_iter);
            ctx.fillStyle = color_scheme === "grayscale" ? `rgb(${color}, ${color}, ${color})` : `rgb(${color}, 0, ${255 - color})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

function drawFractal2() {
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

// fetchFractalSettings().then(drawFractal1);
fetchFractalSettings().then(drawFractal2);
