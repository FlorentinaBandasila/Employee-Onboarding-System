from fastapi import FastAPI
from app.db import Base, engine
from app import models
from app.routers import onboarding, users
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Employee Onboarding System")

app.include_router(onboarding.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)