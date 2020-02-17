import argparse
import os
from server import create_app

if os.environ.get("ENV") == "dev":
    os.environ["FLASK_DEBUG"] = "true"

parser = argparse.ArgumentParser()
parser.add_argument(
    "-c",
    "--config",
    help="nom du fichier de configuration",
    type=str,
    dest="config_filename",
)
args = parser.parse_args()

app = create_app(config_filename=args.config_filename)

if __name__ == "__main__":
    app.run(host="0.0.0.0")
