# import os
# from dotenv import load_dotenv

# load_dotenv()

# class Config:
#     # General
#     SECRET_KEY                  = os.getenv('SECRET_KEY', 'fallback-secret-key-must-be-at-least-32-characters-long-123')
#     DEBUG                       = False
#     TESTING                     = False

#     # Database
#     SQLALCHEMY_TRACK_MODIFICATIONS = False
#     SQLALCHEMY_ECHO             = False

#     # JWT
#     JWT_SECRET_KEY              = os.getenv('JWT_SECRET_KEY', 'fallback-jwt-secret-key-must-be-at-least-32-characters-long-456')
#     JWT_ACCESS_TOKEN_EXPIRES    = 3600        # 1 hour
#     JWT_REFRESH_TOKEN_EXPIRES   = 86400 * 7   # 7 days

#     # CORS
#     CORS_ORIGINS                = ["http://localhost:5173"]  # React Vite port


# class DevelopmentConfig(Config):
#     DEBUG = True
#     SQLALCHEMY_DATABASE_URI = os.getenv(
#         'DEV_DATABASE_URL',
#         'mysql+pymysql://root:rohit%403004@localhost:3306/room_occupancy'
#     )
#     SQLALCHEMY_ECHO = True   # prints SQL queries in terminal

# print("DB URL:", os.getenv('DEV_DATABASE_URL'))

# # class ProductionConfig(Config):
# #     DEBUG = False
# #     SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
#     # DATABASE_URL will be your AWS RDS connection string


# # class TestingConfig(Config):
# #     TESTING = True
# #     SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

# class TestingConfig(Config):
#     TESTING                     = True
#     SQLALCHEMY_DATABASE_URI     = 'sqlite:///:memory:'
#     JWT_SECRET_KEY              = 'test-secret-key-must-be-32-bytes-long!!'
#     SECRET_KEY                  = 'test-secret-key-must-be-32-bytes-long!!'
#     JWT_ACCESS_TOKEN_EXPIRES    = 3600
#     JWT_REFRESH_TOKEN_EXPIRES   = 86400


# config = {
#     'development': DevelopmentConfig,
#     # 'production':  ProductionConfig,
#     'testing':     TestingConfig,
#     'default':     DevelopmentConfig
# }








import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    SECRET_KEY             = os.getenv('SECRET_KEY',
        'roomos-super-secret-key-minimum-32-characters-long-12345')
    DEBUG                  = False
    TESTING                = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO        = False
    JWT_SECRET_KEY         = os.getenv('JWT_SECRET_KEY',
        'roomos-jwt-secret-key-minimum-32-characters-long-67890')
    JWT_ACCESS_TOKEN_EXPIRES  = 3600
    JWT_REFRESH_TOKEN_EXPIRES = 86400 * 7
    CORS_ORIGINS           = ["http://localhost:5173"]


class DevelopmentConfig(Config):
    DEBUG = True
    # Uses local MySQL
    SQLALCHEMY_DATABASE_URI = os.getenv('DEV_DATABASE_URL')
    SQLALCHEMY_ECHO = True


class ProductionConfig(Config):
    DEBUG = False
    # Uses AWS RDS
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_ECHO = False


class TestingConfig(Config):
    TESTING                  = True
    SQLALCHEMY_DATABASE_URI  = 'sqlite:///:memory:'
    JWT_SECRET_KEY           = 'test-secret-key-must-be-32-bytes-long!!'
    SECRET_KEY               = 'test-secret-key-must-be-32-bytes-long!!'
    JWT_ACCESS_TOKEN_EXPIRES = 3600
    JWT_REFRESH_TOKEN_EXPIRES= 86400


config = {
    'development': DevelopmentConfig,
    'production':  ProductionConfig,
    'testing':     TestingConfig,
    'default':     DevelopmentConfig
}