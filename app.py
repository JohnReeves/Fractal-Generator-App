from flask import Flask, render_template, jsonify

app = Flask(__name__)

Mandelbrot = {
    "type": "mandelbrot",
    "settings": {
        "width": 800,
        "height": 800,
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
    "width": 800,
    "height": 800,
    "max_iter": 100,
    "color_scheme": "rainbow"
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

DEFAULT_FRACTAL = Mandelbrot;

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/fractal', methods=['GET'])
def get_fractal():
    return jsonify(DEFAULT_FRACTAL)

if __name__ == '__main__':
    app.run(debug=True)
