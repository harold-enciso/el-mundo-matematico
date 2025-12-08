from sqlalchemy.orm import Session
from models import User
from models import Notifications
from schemas.noti_schema import NotificationCreate, NotificationResponse
#Manejo de errores
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError


def create_notification_service(data: NotificationCreate, db: Session):
    
    #Ubicamos al usuario
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404,detail="Usuario no encontrado")

    new_notification = Notifications(
        user_id = user.id,
        title = data.title,
        message = data.message,
        link = data.link,
        image_url = data.image_url,
        file_url = data.file_url,
        file_name = data.file_name,
        file_type = data.file_type,
        file_size = data.file_size
    )

    db.add(new_notification)
    try:
        db.commit()
        db.refresh(new_notification)
        return new_notification

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


def get_notification_service(db:Session,user:User):
    #Ubicamos las notificaciones por el usuario actual
    notifications = db.query(Notifications).filter(Notifications.user_id == user.id).all()

    notifications_list = [{
        "id": n.id,
        "title": n.title,
        "message": n.message,
        "created_at": n.created_at
    } for n in notifications]

    return notifications_list

def delete_notification_service(noti_id:int,db:Session):
    notification = db.query(Notifications).filter(Notifications.id == noti_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="No encontrada")
    db.delete(notification)
    db.commit()
    return {"detail":"Notificación eliminada"}