from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from typing import Annotated
from sqlalchemy.orm import Session
from pathlib import Path
from services import file_service
from db_session import get_db
import uuid


router = APIRouter(tags=["upload"])


db_dependency = Annotated[Session, Depends(get_db)]

# health check endpoint
@router.get("/healthcheck")
async def health_check():
  
  return "Success"


#Upload a file
@router.post("/upload")
async def upload_file(db:db_dependency,file: UploadFile = File(...)):

  if not file:
    return {"message":" No upload file"}
  
  file_location = await file_service.upload_file(file)
  
  file_info = await file_service.create_file_metadata(db=db, file_id=str(uuid.uuid4()), filename=file.filename, filepath=file_location )
  print(f"final response: {file_info}")

  # For embedding
  file_service.process_embedding(file_info.get("id"), file_info.get("filepath"), file_info.get('filename'))
  
  return file_info

@router.get("/files")
async def get_files_metadata(db:db_dependency):
  response = await file_service.getAllfilesInfo(db)
  return response

@router.get("/files/{file_id}")
async def get_file_url(file_id:str, db: db_dependency):
  print(f'File ID is {file_id}')
  # Fetch the metadata from the database
  response = await file_service.get_file_url_service(file_id=file_id, db=db)
  return {"url":response}


