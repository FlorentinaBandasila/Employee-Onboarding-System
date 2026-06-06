from pydantic import BaseModel
from datetime import date
from enum import Enum

class HardwareTier(str, Enum):
    STANDARD = "Standard"
    PREMIUM = "Premium"

class OnboardingCreate(BaseModel):
    employee_name: str
    role: str
    start_date: date
    hardware_tier: HardwareTier

class OnboardingResponse(BaseModel):
    id: int
    employee_name: str
    role: str
    start_date: date
    hardware_tier: str
    status: str

    class Config:
        from_attributes = True