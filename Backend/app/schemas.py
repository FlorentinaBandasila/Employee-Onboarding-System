from typing import Optional

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
    manager_status: Optional[str]
    finance_status: Optional[str]
    it_status: Optional[str]
    notes: Optional[str]

    class Config:
        from_attributes = True

class StatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None