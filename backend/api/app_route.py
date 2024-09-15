from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from typing import Annotated, List
from sqlalchemy.orm import Session
from db_session import get_db
import uuid
from pydantic import BaseModel
from model import App

router = APIRouter(prefix="/apps",tags=["app"])

db_dependency = Annotated[Session, Depends(get_db)]

class AppRequest(BaseModel):
  appName:str
  appDomain:str

# health check endpoint
@router.get("/healthcheck")
async def health_check():
  return "Success"

# Add application to DB
@router.post("/create", response_model=dict)
async def add_application(db:db_dependency,app:AppRequest):
  app_details = App(appname=app.appName, domain= app.appDomain)
  db.add(app_details)
  db.commit()
  db.refresh(app_details)
  return {"id": app_details.id, "appName": app_details.appname, "appDomain": app_details.domain}

@router.get("/", response_model=List[dict])
async def get_all_applications(db:db_dependency):
  apps =  db.query(App).all()
  return [{"id": app.id, "appName": app.appname, "appDomain": app.domain} for app in apps]


@router.get("/{app_id}", response_model=dict)
async def get_app_details(app_id:int|str,db:db_dependency):
  app = db.query(App).filter(App.id == app_id).first()
  if app is None:
    raise HTTPException(status_code=404, detail="App not found")
  return {"id": app.id, "appName": app.appname, "appDomain": app.domain}


