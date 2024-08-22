from fastapi import HTTPException
from sqlalchemy.orm import Session
from model import Conversation, ConversationHistory
from typing import Optional
from langchain_core.messages import AIMessage, HumanMessage
from chat.llm import azure_openai
from chat.vector_stores.pinecone import build_retreiver
from chat.vector_stores import chroma
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains.history_aware_retriever import create_history_aware_retriever
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain
from database import engine

def create_conversation(db:Session, doc_id:str = None):
  new_conversation = Conversation(doc_id=doc_id)
  db.add(new_conversation)
  db.commit()
  db.refresh(new_conversation)
  return new_conversation


def qa_with_history(question:str,conversation_id:int,  db:Session, doc_id:Optional[str]=None):
  chat_history =  get_conversation_history(db=db,conversation_id=conversation_id)

  print(f"chat_history: {chat_history}")
  formatted_history = []
  for entry in chat_history:
    formatted_history.append(HumanMessage(content=entry.userquestion))
    formatted_history.append(AIMessage(content=entry.airesponse))

   # Create the QA chain with doc_id filter
  qa_chain = create_qa_chain(doc_id=doc_id)

  result = qa_chain.invoke({
    "input":question,
    "chat_history":formatted_history
  })

  answer = result['answer']
  add_to_history(db, conversation_id, question, answer)
  return answer
  


def get_conversation_history(db:Session, conversation_id:int, limit:int=5):
  query = db.query(ConversationHistory).filter(ConversationHistory.conversationid == conversation_id).order_by(ConversationHistory.id.desc()).limit(limit=limit)
  print(query.statement.compile(engine)) 

  print("inside history",conversation_id) 
  result= query.all()
  print("result", result)
  return result

def create_qa_chain(doc_id=None):
  llm = azure_openai.llm

  # retriever = build_retreiver(doc_id=doc_id)
  retriever = chroma.build_chroma_retriever(doc_id=doc_id)
  # retrieved_docs = retriever.invoke("Who created more spice")
  # print(f"Retrieved docs: {retrieved_docs}")

   # Create a prompt for retrieval
  retriever_prompt = ChatPromptTemplate.from_messages([
    MessagesPlaceholder(variable_name="chat_history"),
    ('human',"{input}"),
    ('human',"Given the above conversation, generate a search query to look up information relevant to the human's last question")
  ])

  # Create a history-aware retriever
  history_aware_retriever = create_history_aware_retriever(
    llm=llm,
    retriever=retriever,
    prompt= retriever_prompt
  )

  # retrieved_docs = history_aware_retriever.invoke({
  #   "input":"Who created more spice",
  #   "chat_history":[]
  # })
  # print(f"Retrieved docs: {retrieved_docs}")

  # Rest of the function remains the same...
  prompt = ChatPromptTemplate(
  [
    ("system", "You are a helpful AI assistant. Answer the user's question based only on the provided context and chat_history. If there is no relevant context, politely state that you cannot provide an answer."),
    ('human', "{input}"),
    ("human", "Here's some relevant context: {context}"),
    ("human", """
    If the context provided is empty, respond with:
    'I currently don't have enough information to answer that question based on the context provided. Could you provide more details?'

    If the context is available, respond appropriately in 3 to 4 sentences maximum. If the user is done or thanking you, a brief farewell is sufficient.
    """)
  ] 

  )

  document_chain = create_stuff_documents_chain(llm=llm , prompt=prompt)

  return create_retrieval_chain(history_aware_retriever, document_chain)


def add_to_history(db:Session, conversation_id, user_question, ai_response):


  new_entry = ConversationHistory(
    conversationid = conversation_id,
    userquestion = user_question,
    airesponse= ai_response
  )

  print(f"New history entry: {new_entry}")
  db.add(new_entry)
  db.commit()
  db.refresh(new_entry)
  return new_entry

