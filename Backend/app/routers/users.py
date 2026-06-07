from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.user import User
from app.schemas import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])


# Create a new user
@router.post("/create-user", response_model=UserResponse)
def create_user(body: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == body.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="A user with this email already exists")

    user = User(
        full_name=body.full_name,
        email=body.email,
        department=body.department,
        role=body.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# Get all users
@router.get("/get-all-users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

# Get all users by department
@router.get("/by-department/{department}", response_model=list[UserResponse])
def get_users_by_department(department: str, db: Session = Depends(get_db)):
    users = db.query(User).filter(User.department == department).all()
    if not users:
        raise HTTPException(status_code=404, detail="No users found in department")
    return users

# Get a user by ID
@router.get("/get-user/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user