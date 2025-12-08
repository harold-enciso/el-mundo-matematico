from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from models import Notifications
from schemas.noti_schema import NotificationCreate, NotificationResponse
from services.noti_service import create_notification_service,get_notification_service,delete_notification_service
from dependencies.auth import get_current_user
from typing import List

router = APIRouter(prefix="/noti",tags=["Notifications"])

@router.post("/create",response_model=NotificationResponse)
def create_notifications(data: NotificationCreate, db: Session = Depends(get_db)):
    noti_data = create_notification_service(data,db)
    return noti_data

@router.get("/me")
def my_notifications(current_user = Depends(get_current_user),db: Session = Depends(get_db)):
    notifications = get_notification_service(db,current_user)
    return notifications

@router.delete("/delete/{noti_id}",status_code=204)
def delete_notification(noti_id:int,db: Session = Depends(get_db)):
    delete_notification_service(noti_id,db)
    return 