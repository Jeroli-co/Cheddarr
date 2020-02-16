import os
from server import create_app

app = create_app()

if __name__ == "__main__":
    if os.environ.get("ENV") == "dev":
        os.environ["FLASK_DEBUG"] = "true"
    app.run(host="127.0.0.1", port=5000, debug=True)
