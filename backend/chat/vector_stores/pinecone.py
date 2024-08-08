from langchain_pinecone import PineconeVectorStore
from chat.embeddings.openai_embeddings import embeddings
from dotenv import load_dotenv

import os

load_dotenv()

vector_store = PineconeVectorStore.from_existing_index(
  embedding=embeddings, 
  index_name=os.environ['PINECONE_INDEX_NAME'],
  namespace=os.environ['PINECONE_ENV_NAME'],
  )

def build_retreiver(doc_id):
  # search_kwargs = {'filter': {'doc_id': doc_id}, 'k': 10} i
  print(doc_id)
  return vector_store.as_retriever(
    search_type="mmr",
    search_kwargs={'filter':{'doc_id': int(doc_id)} if doc_id else {}}
  )

