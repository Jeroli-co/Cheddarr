from server import create_app
import os

app = create_app()

if os.environ.get("ENV") == "dev":
    os.environ["FLASK_DEBUG"] = "true"


if __name__ == "__main__":
    app.run(host="0.0.0.0")
