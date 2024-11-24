async function fetchFractalSettings() {
    const response = await fetch('/fractal');
    return await response.json();
}

function drawFractal(settings) {
    console.log("Settings received:", settings);

    const canvas = document.getElementById('fractalCanvas');
    const ctx = canvas.getContext('2d');
    const { width, height, max_iter, color_scheme } = settings.settings;
    const { initial_zx, initial_zy, equations, escape_radius } = settings.formula;

    if (!width || !height || !equations || equations.length < 2) {
        console.error("Invalid settings for fractal rendering.");
        return;
    }    
    const validColorSchemes = ["grayscale", "rainbow"];
    const scheme = validColorSchemes.includes(color_scheme) ? color_scheme : "grayscale";
    
    canvas.width = width;
    canvas.height = height;

    // Functions for equations
    console.log("Equation for zx:", equations[0]);
    console.log("Equation for zy:", equations[1]);
    const zxEquation = new Function('zx', 'zy', 'cx', 'cy', equations[0]);
    const zyEquation = new Function('zx', 'zy', 'cx', 'cy', equations[1]);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let cx = (x - width / 2) / (width / 4);
            let cy = (y - height / 2) / (height / 4);

            let zx = initial_zx, zy = initial_zy;
            let iter = 0;

            while (zx * zx + zy * zy < escape_radius && iter < max_iter) {
                const zx_new = zxEquation(zx, zy, cx, cy);
                const zy_new = zyEquation(zx, zy, cx, cy);
                zx = zx_new;
                zy = zy_new;
                iter++;
            }

            const color = iter === max_iter ? 0 : (iter * 255 / max_iter);
            ctx.fillStyle = scheme === "grayscale"
                ? `rgb(${color}, ${color}, ${color})`
                : `rgb(${color}, 0, ${255 - color})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }   
}

fetchFractalSettings().then(drawFractal);
