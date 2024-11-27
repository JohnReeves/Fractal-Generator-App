const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');
const iterationSlider = document.getElementById('iterationSlider');
const iterationValue = document.getElementById('iterationValue');

async function fetchFractalSettings() {
    const response = await fetch('/fractal');
    return await response.json();
}

document.getElementById('renderButton').addEventListener('click', async () => {
    const type = document.getElementById('fractalType').value;
    const response = await fetch(`/fractal?type=${type}`);
    const settings = await response.json();
    console.log("response=",response, " | settings=",settings)
    renderFractal(settings);
});

document.getElementById("saveSettings").addEventListener("click", async () => {
    const type = document.getElementById("fractalType").value;
    const settings = collectParameters(type);

    const response = await fetch('/save_settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, settings })
    });

    const result = await response.json();
    alert(result.message);
});

document.getElementById("loadSettings").addEventListener("click", async () => {
    const response = await fetch('/load_settings');
    if (response.ok) {
        const data = await response.json();
        const type = data.type;
        generateParameterInputs(type);

        Object.entries(data.settings).forEach(([id, value]) => {
            const input = document.getElementById(id);
            if (input) input.value = value;
        });

        document.getElementById("fractalType").value = type;
        alert("Settings loaded successfully!");
    } else {
        const error = await response.json();
        alert(error.message);
    }
});

function drawSierpinski(settings) {
    const { width, height, iterations, color } = settings.settings;

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    function drawTriangle(x1, y1, x2, y2, x3, y3, depth) {
        if (depth === 0) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.closePath();
            ctx.fill();
        } else {
            const midX1 = (x1 + x2) / 2;
            const midY1 = (y1 + y2) / 2;
            const midX2 = (x2 + x3) / 2;
            const midY2 = (y2 + y3) / 2;
            const midX3 = (x1 + x3) / 2;
            const midY3 = (y1 + y3) / 2;

            drawTriangle(x1, y1, midX1, midY1, midX3, midY3, depth - 1);
            drawTriangle(midX1, midY1, x2, y2, midX2, midY2, depth - 1);
            drawTriangle(midX3, midY3, midX2, midY2, x3, y3, depth - 1);
        }
    }

    drawTriangle(width / 2, 0, 0, height, width, height, iterations);
}

function drawKoch(settings) {
    const { width, height, iterations, color, start_length } = settings.settings;

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    function drawSegment(x1, y1, x2, y2, depth) {
        if (depth === 0) {
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        } else {
            const dx = x2 - x1, dy = y2 - y1;
            const xA = x1 + dx / 3, yA = y1 + dy / 3;
            const xB = x1 + 2 * dx / 3, yB = y1 + 2 * dy / 3;
            const xC = (xA + xB) / 2 - (yB - yA) * Math.sqrt(3) / 2;
            const yC = (yA + yB) / 2 + (xB - xA) * Math.sqrt(3) / 2;

            drawSegment(x1, y1, xA, yA, depth - 1);
            drawSegment(xA, yA, xC, yC, depth - 1);
            drawSegment(xC, yC, xB, yB, depth - 1);
            drawSegment(xB, yB, x2, y2, depth - 1);
        }
    }

    const startX = (width - start_length) / 2;
    const startY = height / 2;
    const endX = startX + start_length;

    drawSegment(startX, startY, endX, startY, iterations);
    drawSegment(endX, startY, (startX + endX) / 2, startY - (start_length * Math.sqrt(3)) / 2, iterations);
    drawSegment((startX + endX) / 2, startY - (start_length * Math.sqrt(3)) / 2, startX, startY, iterations);
}

function drawFractal(settings, max_iter) {
    console.log("Settings received:", settings);

    const { width, height, color_scheme } = settings.settings;
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
            const cx = settings.formula.constants?.cx || (x - width / 2) / (width / 4);
            const cy = settings.formula.constants?.cy || (y - height / 2) / (height / 4);   

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

function renderFractal(settings) {
    switch (settings.type) {
        case 'mandelbrot':
            drawFractal(settings);
            break;
        case 'julia':
            drawFractal(settings);
            break;
        case 'sierpinski':
            drawSierpinski(settings);
            break;
        case 'koch':
            drawKoch(settings);
            break;
        default:
            console.error("Unknown fractal type:", settings.type);
    }
}

// Event listener for the slider
iterationSlider.addEventListener('input', async () => {
    const maxIter = parseInt(iterationSlider.value, 10);
    iterationValue.textContent = maxIter; // Update displayed value
    const fractalSettings = await fetchFractalSettings();
    drawFractal(fractalSettings, maxIter);
});

// Initial render
fetchFractalSettings().then(settings => drawFractal(settings, parseInt(iterationSlider.value, 10)));
// fetchFractalSettings().then(renderFractal);
