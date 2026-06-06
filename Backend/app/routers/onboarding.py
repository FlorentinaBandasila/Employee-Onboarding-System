from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import OnboardingTicket
from app.schemas import OnboardingCreate, OnboardingResponse, StatusUpdate

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])

# Create a new onboarding ticket
@router.post("/Tickets", response_model=OnboardingResponse)
def create_ticket(body: OnboardingCreate, db: Session = Depends(get_db)):
    ticket = OnboardingTicket(
        employee_name=body.employee_name,
        role=body.role,
        start_date=body.start_date,
        hardware_tier=body.hardware_tier
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket

# Get all onboarding tickets
@router.get("/Tickets", response_model=list[OnboardingResponse])
def get_tickets(db: Session = Depends(get_db)):
    return db.query(OnboardingTicket).all()

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
    elif body.status == "Rejected":
        ticket.status = "Needs Rework"

    db.commit()
    db.refresh(ticket)
    return ticket