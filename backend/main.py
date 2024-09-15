from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from api import file_route,chat_route, app_route

from model import Base
from database import engine

Base.metadata.create_all(bind= engine)


# Configure CORS
origins = [
    "http://localhost:3000",  # React frontend
    "http://localhost:5173",
    "http://localhost"
    # Add other origins if needed
]


app = FastAPI()
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware, 
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    )

app.include_router(prefix="/api", router=file_route.router)
app.include_router(prefix="/api", router=chat_route.router)
app.include_router(prefix="/api", router=app_route.router)