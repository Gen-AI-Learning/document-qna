from sqlalchemy import String, Integer, Column, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone
import uuid

class FileMetaData(Base):
  __tablename__="files_metadata"

  id = Column(Integer, index=True, primary_key=True)
  fileid = Column(String, index=True, unique=True)
  filename= Column(String, index=True)
  filepath = Column(String, index=True)
  appid = Column(String, ForeignKey('app_details.id'), index=True)

class Conversation(Base):
  __tablename__="conversation_details"
  
  id= Column(Integer, index=True, primary_key=True)
  doc_id = Column(String, ForeignKey('files_metadata.id'), index=True, nullable=True)

  chat_history = relationship('ConversationHistory', back_populates='conversation',  cascade="all, delete-orphan")

class ConversationHistory(Base):
    __tablename__ = "conversation_history"
    id = Column(Integer, primary_key=True, index=True)
    conversationid = Column(Integer, ForeignKey('conversation_details.id') ,index=True)
    userquestion = Column(String)
    airesponse = Column(String)
    timestamp = Column(DateTime, default=datetime.now(timezone.utc))
    conversation = relationship('Conversation', back_populates='chat_history')

class App(Base):
   __tablename__ ="app_details"
   id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
   appname= Column(String)
   domain= Column(String)