from pathlib import Path
from fastapi import UploadFile, HTTPException

from sqlalchemy.orm import Session
from model import FileMetaData
from chat.create_embedding import create_embeddings


UPLOAD_DIR = Path() / 'uploads'
async def upload_file(file:UploadFile):
  data = await file.read()
  save_to = UPLOAD_DIR / file.filename
  with open(save_to, 'wb') as f:
    f.write(data)
  return str(save_to)



async def create_file_metadata(db:Session,file_id:int, filename:str, filepath:str)-> FileMetaData:
  print(f"{filename}: {filepath}")
  db_file_metadata = FileMetaData(fileid= file_id,filename=filename, filepath=filepath)
  db.add(db_file_metadata)
  db.commit()
   # Convert the FileMetaData instance to a dictionary
  metadata_dict = {
      "id": db_file_metadata.fileid,
      "filename": db_file_metadata.filename,
      "filepath": db_file_metadata.filepath,
    }
    
  return metadata_dict

async def getAllfilesInfo(db:Session):
  return db.query(FileMetaData).all()

async def get_file_url_service(file_id:int, db:Session):
  file_meta = db.query(FileMetaData).filter(FileMetaData.fileid == file_id).first()
  if not file_meta:
    raise HTTPException(status_code=404, detail="File not found")
  
  normalized_path = file_meta.filepath.replace('\\','/')
  
  document_url = f"/{normalized_path}"
  return document_url


def process_embedding(file_id, file_path, filename):
  print("Called embeddings")
  create_embeddings(doc_id=file_id, doc_path=file_path, doc_name=filename)
  

  
