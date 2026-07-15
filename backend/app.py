"""Development entry point for the ThreatWatch OT API."""

from app import create_app

app = create_app()


if __name__ == "__main__":
    app.run(host=app.config["FLASK_HOST"], port=app.config["FLASK_PORT"], debug=True)
