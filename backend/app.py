from flask import Flask
from flask_cors import CORS
from db_config import db
from routes.auth import auth_bp
from routes.transactions import trans_bp

app = Flask(__name__)  
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:123456789@localhost/personal_finance'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

app.register_blueprint(auth_bp)
app.register_blueprint(trans_bp)

@app.route('/')
def home():
    return {"message": "Finance Tracker API is running!"}

if __name__ == '__main__':
    app.run(debug=True)
