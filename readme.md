# Introduction to Fractals

Fractals are self-repeating patterns that emerge from simple mathematical equations. 

Fractals appear in nature as snowflakes, coastlines, and fern leaves and are characterized by their infinite complexity and self-similarity at every scale. 

https://iternal.us/what-is-a-fractal/

The term fractal was coined by Benoît B. Mandelbrot in 1975, who expanded on earlier work by mathematicians like Gaston Julia. Mandelbrot's discovery of the Mandelbrot set, one of the most famous fractals, demonstrated how simple iterative equations could generate infinite visual complexity.

Fractals have applications in science, technology, and art. 

Computer scientists use fractals to create realistic landscapes and textures. Telecommunications engineers use fractals to design compact, efficient antennas. Scientists use fractals to model complex systems, such as blood vessel networks or galaxy distributions. Artists use fractals to inspire their art and music, blending mathematics and creativity, and putting the A into STEM.

https://brilliant.org/wiki/fractals/

In this project, you’ll learn to create a fractal generator to visualize fractals like the Mandelbrot set. You’ll combine Flask, Python, HTML, and JavaScript to build a web-based interactive tool that renders fractals dynamically, providing a hands-on introduction to web development and programming with mathematical beauty.

## application stucture
```
fractal-generator/
├── app.py                # Main Flask application
├── templates/
│   └── index.html        # HTML template
├── static/
│   ├── fractal.js        # JavaScript for fractal rendering
│   └── styles.css        # CSS for styling
└── requirements.txt      # Python dependencies
```

* `app.py` contains Flask application logic
* `templates/index.html` the main web page served by Flask, embedding the canvas for rendering
* `static/fractal.js` JavaScript logic for generating and drawing the fractal
* `static/styles.css` optional file for additional styling
* `requirements.txt` lists dependencies like Flask for easy installation
