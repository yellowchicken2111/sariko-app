import os
import logging
from logging.handlers import TimedRotatingFileHandler
import sys
import time

from dotenv import load_dotenv
env = os.environ.get("ENV", "local")
load_dotenv(dotenv_path=f"environments/.env.{env}")
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from lifespan import lifespan