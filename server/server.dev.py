from flask import Flask
from flask.templating import render_template
from flask_cors import CORS

CLIENT_ADDR = ["http://127.0.0.1:4200", "http://localhost:4200"]
app = Flask(
    __name__, static_folder="../client/build/static", template_folder="../client/build"
)
CORS(app, resources={r"/*": {"origins": CLIENT_ADDR}})


@app.route("/", methods=["GET"])
@app.route("/<path:path>", methods=["GET"])
def any_root_path(path=None):
    return render_template("index.html")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
