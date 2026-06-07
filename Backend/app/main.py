from fastapi import FastAPI
from app.db import Base, engine
from app import models
from app.routers import onboarding, users

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Employee Onboarding System")

app.include_router(onboarding.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {"status": "ok"}