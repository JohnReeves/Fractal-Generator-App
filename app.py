from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# Default Mandelbrot fractal JSON
Mandelbrot = {
    "type": "mandelbrot",
    "settings": {
        "width": 700,
        "height": 700,
        "max_iter": 100,
        "color_scheme": "grayscale"
    },
    "formula": {
        "initial_zx": 0,
        "initial_zy": 0,
        "equations": [
            "return zx * zx - zy * zy + cx",
            "return 2 * zx * zy + cy"
        ],
        "escape_radius": 4
    }
}

Julia = {
  "type": "julia",
  "settings": {
    "width": 700,
    "height": 700,
    "max_iter": 100,
    "color_scheme": "grayscale"
  },
  "formula": {
    "initial_zx": 0,
    "initial_zy": 0,
    "constants": {
      "cx": -0.7,
      "cy": 0.27015
    },
    "equations": [
      "return zx * zx - zy * zy + cx",
      "return 2 * zx * zy + cy"
    ],
    "escape_radius": 4
  }
}

Sierpinski = {
    "type": "sierpinski",
    "settings": {
        "width": 800,
        "height": 800,
        "iterations": 6,
        "color": "black"
    }
}

KochSnowflake = {
    "type": "koch",
    "settings": {
        "width": 800,
        "height": 800,
        "iterations": 5,
        "color": "blue",
        "start_length": 300
    }
}

DEFAULT_FRACTAL = Mandelbrot;
# Available fractals
FRACTALS = {
    "mandelbrot": Mandelbrot,
    "julia": Julia,
    "sierpinski": Sierpinski,
    "koch": KochSnowflake,
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/fractal', methods=['GET'])
def get_fractal():
    fractal_type = request.args.get('type', 'mandelbrot')
    return jsonify(FRACTALS.get(fractal_type, Mandelbrot))

if __name__ == '__main__':
    app.run(debug=True)
