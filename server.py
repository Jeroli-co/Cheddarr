if __name__ == "__main__":
    import os
    from server import create_app

    if os.environ.get("ENV") == "dev":
        os.environ["FLASK_DEBUG"] = "true"

    app = create_app()
    app.run()
