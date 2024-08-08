
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from chat.vector_stores.pinecone import vector_store
import os

def create_embeddings(doc_id: int, doc_path:str, doc_name:str):

  # temp solution, use a file storage
  cur_dir = os.path.dirname(os.path.abspath(__file__))
  upload_dir = os.path.dirname(cur_dir)

  filepath = os.path.join(upload_dir, doc_path)
  text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
  loader = PyPDFLoader(file_path=filepath)
  docs = loader.load_and_split(text_splitter=text_splitter)

  for doc in docs:
    doc.metadata = {
      "page": doc.metadata["page"],
      "text":doc.page_content,
      "doc_id": doc_id
    }
  
  vector_store.add_documents(documents=docs)


  

# create_embeddings(1,'sadas','asddsa')


  