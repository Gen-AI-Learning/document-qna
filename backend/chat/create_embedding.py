
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from chat.vector_stores.pinecone import vector_store
from chat.vector_stores import chroma
import os

def create_embeddings(doc_id: int, doc_path:str, doc_name:str, appid:str):

  # temp solution, use a file storage
  cur_dir = os.path.dirname(os.path.abspath(__file__))
  upload_dir = os.path.dirname(cur_dir)

  filepath = os.path.join(upload_dir, doc_path)
  text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
  loader = PyPDFLoader(file_path=filepath)
  docs = loader.load_and_split(text_splitter=text_splitter)

  processed_docs = []
  for doc in docs:
    # processed_doc = {
    #   "page_content":doc.page_content,
    #   "metadata":{
    #     "page": doc.metadata["page"],
    #     "doc_id": doc_id,
    #     "doc_name": doc_name
    #   }
    # }
    # processed_docs.append(processed_doc)
    doc.metadata = {
      "page": doc.metadata["page"],
      "text":doc.page_content,
      "doc_id": doc_id,
      "doc_name": doc_name,
      "appid":appid
    }
  
  chroma.vector_store.add_documents(documents=docs)
  # vector_store.add_documents(documents=docs)


  

# create_embeddings(1,'sadas','asddsa')


  