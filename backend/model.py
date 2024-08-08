from sqlalchemy import String, Integer, Column, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone

class FileMetaData(Base):
  __tablename__="files_metadata"

  id = Column(Integer, index=True, primary_key=True)
  filename= Column(String, index=True)
  filepath = Column(String, index=True)

class Conversation(Base):
  __tablename__="conversation_details"
  
  id= Column(Integer, index=True, primary_key=True)
  doc_id = Column(Integer, ForeignKey('files_metadata.id'), index=True, nullable=True)

  chat_history = relationship('ConversationHistory', back_populates='conversation',  cascade="all, delete-orphan")

class ConversationHistory(Base):
    __tablename__ = "conversation_history"
    id = Column(Integer, primary_key=True, index=True)
    conversationid = Column(String, ForeignKey('conversation_details.id') ,index=True)
    userquestion = Column(String)
    airesponse = Column(String)
    timestamp = Column(DateTime, default=datetime.now(timezone.utc))
    conversation = relationship('Conversation', back_populates='chat_history')