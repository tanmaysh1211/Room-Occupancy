# import os
# from app import create_app
# # from flask_cors import CORS

# app = create_app(os.getenv('FLASK_ENV', 'development'))

# # CORS(app, origins=["http://localhost:5173"])

# if __name__ == '__main__':
#     app.run(
#         host='0.0.0.0',
#         port=5000,
#         debug=app.config['DEBUG']
#     )



import os
from app import create_app

# Switch via FLASK_ENV environment variable
env    = os.getenv('FLASK_ENV', 'development')
app    = create_app(env)

if __name__ == '__main__':
    print(f"Running in {env} mode")
    print(f"DB: {app.config['SQLALCHEMY_DATABASE_URI']}")
    app.run(
        host  = '0.0.0.0',
        port  = int(os.getenv('PORT', 5000)),
        debug = app.config['DEBUG']
    )