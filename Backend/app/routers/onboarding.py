from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import OnboardingTicket
from app.schemas import OnboardingCreate, OnboardingResponse, OnboardingUpdate, StatusUpdate
import json
from pathlib import Path

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])

JOB_DESCRIPTIONS = json.loads(Path("app/routers/job_descriptions.json").read_text())

# Create a new onboarding ticket
@router.post("/Tickets", response_model=OnboardingResponse)
def create_ticket(body: OnboardingCreate, db: Session = Depends(get_db)):
    ticket = OnboardingTicket(
        employee_name=body.employee_name,
        role=body.role,
        start_date=body.start_date,
        hardware_tier=body.hardware_tier,
        job_description=JOB_DESCRIPTIONS.get(body.role),
        notes=body.notes,
        finance_status="Not Required" if body.hardware_tier == "Standard" else None,
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket

# Get all onboarding tickets
@router.get("/Tickets", response_model=list[OnboardingResponse])
def get_tickets(db: Session = Depends(get_db)):
    return db.query(OnboardingTicket).order_by(OnboardingTicket.id.desc()).all()

# Get a onboarding ticket by ID
@router.get("/Tickets/{ticket_id}", response_model=OnboardingResponse)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = db.query(OnboardingTicket).filter(OnboardingTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

# Update onboarding ticket status
@router.patch("/Tickets/{ticket_id}/status", response_model=OnboardingResponse)
def update_status(ticket_id: int, body: StatusUpdate, db: Session = Depends(get_db)):
    ticket = db.query(OnboardingTicket).filter(OnboardingTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    ticket.status = body.status

    if body.notes:
        ticket.notes = body.notes

    db.commit()
    db.refresh(ticket)
    return ticket

@router.delete("/Tickets/{ticket_id}", status_code=204)
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = db.query(OnboardingTicket).filter(OnboardingTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    db.delete(ticket)
    db.commit()

# Update manager approval status
@router.patch("/Tickets/{ticket_id}/manager-status", response_model=OnboardingResponse)
def update_manager_status(ticket_id: int, body: StatusUpdate, db: Session = Depends(get_db)):
    ticket = db.query(OnboardingTicket).filter(OnboardingTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    ticket.manager_status = body.status
    if body.notes:
        ticket.notes = body.notes

    if body.status == "Approved":
        ticket.status = "Waiting Finance" if ticket.hardware_tier == "Premium" else "Waiting IT"
    elif body.status == "Rejected":
        ticket.status = "Needs Rework"

    db.commit()
    db.refresh(ticket)
    return ticket

# Update finance approval status
@router.patch("/Tickets/{ticket_id}/finance-status", response_model=OnboardingResponse)
def update_finance_status(ticket_id: int, body: StatusUpdate, db: Session = Depends(get_db)):
    ticket = db.query(OnboardingTicket).filter(OnboardingTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    ticket.finance_status = body.status
    if body.notes:
        ticket.notes = body.notes

    if body.status == "Approved":
        ticket.status = "Waiting IT"
    elif body.status == "Rejected":
        ticket.status = "Needs Rework"

    db.commit()
    db.refresh(ticket)
    return ticket

# Update IT approval status
@router.patch("/Tickets/{ticket_id}/it-status", response_model=OnboardingResponse)
def update_it_status(ticket_id: int, body: StatusUpdate, db: Session = Depends(get_db)):
    ticket = db.query(OnboardingTicket).filter(OnboardingTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    ticket.it_status = body.status
    if body.notes:
        ticket.notes = body.notes

    if body.status == "Approved":
        ticket.status = "Completed"

        # Generate company credentials
        name_parts = ticket.employee_name.strip().lower().split()
        first_name = name_parts[0]
        last_name = name_parts[-1] if len(name_parts) > 1 else ""
        email = f"{first_name}.{last_name}@company.com" if last_name else f"{first_name}@company.com"
        password = "Welcome123!"

        credentials_note = (
            f"\n\n--- Account credentials ---\n"
            f"Laptop configuration is DONE\n"
            f"Email: {email}\n"
            f"Temporary password: {password}\n"
            f"Note: The password must be changed on first login."
        )
        ticket.notes = (ticket.notes or "") + credentials_note

    elif body.status == "Rejected":
        ticket.status = "Needs Rework"

    db.commit()
    db.refresh(ticket)
    return ticket

@router.patch("/Tickets/{ticket_id}/resubmit", response_model=OnboardingResponse)
def resubmit_ticket(ticket_id: int, body: OnboardingUpdate, db: Session = Depends(get_db)):
    ticket = db.query(OnboardingTicket).filter(OnboardingTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if ticket.status != "Needs Rework":
        raise HTTPException(status_code=400, detail="Only tickets with 'Needs Rework' status can be resubmitted")

    if body.employee_name:
        ticket.employee_name = body.employee_name
    if body.role:
        ticket.role = body.role
    if body.start_date:
        ticket.start_date = body.start_date
    if body.hardware_tier:
        ticket.hardware_tier = body.hardware_tier

    ticket.status = "Waiting Manager"
    ticket.manager_status = None
    ticket.finance_status = None
    ticket.it_status = None
    ticket.notes = None

    db.commit()
    db.refresh(ticket)
    return ticket