import os
from server import create_app

if os.environ.get("FLASK_ENV") == "development":
    os.environ["FLASK_DEBUG"] = "true"

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0")
