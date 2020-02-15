from flask import Flask
from flask_cors import CORS

CLIENT_ADDR = ["http://127.0.0.1:4200", "http://localhost:4200"]
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": CLIENT_ADDR}})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
