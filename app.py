from flask import Flask, render_template, jsonify, request
import json
import os

app = Flask(__name__)

# Load fractals from JSON file
with open('fractals.json', 'r') as f:
    FRACTALS = json.load(f)

USER_SETTINGS_FILE = 'user_settings.json'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/fractal', methods=['GET'])
def get_fractal():
    fractal_type = request.args.get('type', 'mandelbrot')
    fractal = FRACTALS.get(fractal_type, FRACTALS['mandelbrot'])
    return jsonify(fractal)

@app.route('/save_settings', methods=['POST'])
def save_settings():
    data = request.json
    with open(USER_SETTINGS_FILE, 'w') as f:
        json.dump(data, f)
    return jsonify({"status": "success", "message": "Settings saved successfully!"})

@app.route('/load_settings', methods=['GET'])
def load_settings():
    if os.path.exists(USER_SETTINGS_FILE):
        with open(USER_SETTINGS_FILE, 'r') as f:
            settings = json.load(f)
        return jsonify(settings)
    return jsonify({"status": "error", "message": "No saved settings found."}), 404

if __name__ == '__main__':
    app.run(debug=True)
