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
from langchain.schema import Document
from database import engine

def create_conversation(db:Session, doc_id:str = None):
  new_conversation = Conversation(doc_id=doc_id)
  db.add(new_conversation)
  db.commit()
  db.refresh(new_conversation)
  return new_conversation


def qa_with_history(question:str,conversation_id:int, db:Session, doc_id:Optional[str]=None, app_id: Optional[str]= None):
  chat_history =  get_conversation_history(db=db,conversation_id=conversation_id)

  print(f"chat_history: {chat_history}")
  formatted_history = []
  for entry in chat_history:
    formatted_history.append(HumanMessage(content=entry.userquestion))
    formatted_history.append(AIMessage(content=entry.airesponse))

   # Create the QA chain with doc_id filter
  qa_chain = create_qa_chain(doc_id=doc_id, app_id = app_id)

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

def create_qa_chain(doc_id=None, app_id = None):
  llm = azure_openai.llm

  # retriever = build_retreiver(doc_id=doc_id)
  retriever = chroma.build_chroma_retriever(doc_id=doc_id, app_id=app_id)
  # retrieved_docs = retriever.invoke("Who created more spice")
  # print(f"Retrieved docs: {retrieved_docs}")

   # Create a prompt for retrieval
  retriever_prompt = ChatPromptTemplate.from_messages([
    ('system', "Given a chat history and the latest user question "
    "which might reference context in the chat history, "
    "formulate a standalone question which can be understood "
    "without the chat history. Do NOT answer the question, "
    "just reformulate it if needed and otherwise return it as is."),
    MessagesPlaceholder(variable_name="chat_history"),
    ('human',"{input}"),
    

  ])

  # Create a history-aware retriever
  history_aware_retriever = create_history_aware_retriever(
    llm=llm,
    retriever=retriever,
    prompt= retriever_prompt
  )

  retrieved_docs = history_aware_retriever.invoke({
    "input":"hi",
    "chat_history":[]
  })
  print(f"Retrieved docs: {retrieved_docs}")


  # def retriever_with_fallback(query):
  #   retrieval_result = history_aware_retriever.invoke({
  #     "input": query,
  #     "chat_history": []
  #   })
  #   if retrieval_result and retrieval_result[0].page_content == "NO_QUERY":
  #    return [Document(page_content="This is a greeting or not a question. No specific information is available.")]
  #   return retrieval_result

  # Rest of the function remains the same...


  # prompt = ChatPromptTemplate(
  # [
  #   ("system", "You are a helpful AI assistant. Answer the user's question based only on the provided context. If there is no relevant context or the context indicates a greeting, politely state that you don't have specific information to respond."),
  #   ('human', "{input}"),
  #   ("human", "Here's some relevant context: {context}"),
  #   ("human", """
  #     If the context is 'NO_QUERY' or indicates a lack of specific information, respond with:
  #     'I don't have specific information to respond to that. Is there anything in particular you'd like to know about?'

  #     If context is available, respond appropriately in 3 to 4 sentences maximum.
  #     Always base your response solely on the provided context.
  #   """)
  # ] 

  # )

  system_prompt = (
      "You are an assistant for question-answering tasks. "
      "Use the following pieces of retrieved context to answer "
      "the question. If you don't know the answer, say that you "
      "don't know. Tryto answer in three or four sentences sentences maximum and keep the "
      "answer concise."
      "\n\n"
      "{context}"
  )
  qa_prompt = ChatPromptTemplate.from_messages(
      [
          ("system", system_prompt),
          MessagesPlaceholder("chat_history"),
          ("human", "{input}"),
      ]
  )

  document_chain = create_stuff_documents_chain(llm=llm , prompt=qa_prompt)
  return create_retrieval_chain(history_aware_retriever, document_chain)

 
            


  # return create_retrieval_chain(history_aware_retriever, document_chain)


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

