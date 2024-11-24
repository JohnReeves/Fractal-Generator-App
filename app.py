from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/fractal')
def fractal():
    max_iter = int(request.args.get('max_iter', 100))
    # Optionally calculate something here and return as JSON
    return jsonify(message="Fractal settings updated.")

if __name__ == '__main__':
    app.run(debug=True)