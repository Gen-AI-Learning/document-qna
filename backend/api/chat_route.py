from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Annotated, Optional
from sqlalchemy.orm import Session
from db_session import get_db
from services import chat_service
from model import Conversation
from pydantic import BaseModel

router = APIRouter(tags=["chat"])


db_dependency = Annotated[Session, Depends(get_db)]

class MessageRequest(BaseModel):
    conversation_id: int
    question: str
    doc_id: Optional[str] = None
                      

@router.post('/chat')
async def create_conversation(db:db_dependency,doc_id:Optional[int]= Query(None)):
  conversation_data = chat_service.create_conversation(db=db, doc_id=doc_id)
  return conversation_data

@router.post('/chat/message')
async def ask_question(db:db_dependency,request:MessageRequest):
  print(request)
  answer= chat_service.qa_with_history(
     conversation_id=request.conversation_id,
     doc_id=request.doc_id,
     question=request.question,
     db=db
     )
  print(answer)
  
  return {"answer": answer}



        


