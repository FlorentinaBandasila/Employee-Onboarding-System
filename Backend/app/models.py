from sqlalchemy import Column, Integer, String, Date, Text
from app.db import Base

class OnboardingTicket(Base):
    __tablename__ = "onboarding_tickets"

    id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    hardware_tier = Column(String, nullable=False)
    status = Column(String, nullable=False, default="Waiting Manager")
    manager_status = Column(String, nullable=True)
    finance_status = Column(String, nullable=True)
    it_status = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    job_description = Column(Text, nullable=True)