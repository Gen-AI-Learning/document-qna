from langchain_chroma import Chroma
from chat.embeddings.openai_embeddings import embeddings
from dotenv import load_dotenv
import os

from pathlib import Path

load_dotenv()

parent_dir = Path(__file__).resolve().parent.parent.parent

print("Hi",os.environ["CHROMA_DIR"])
persistent_dir = parent_dir / "chromadb"/ Path(os.environ["CHROMA_DIR"])

print(persistent_dir)


vector_store = Chroma(collection_name="doc_collections",
                      embedding_function= embeddings,
                      persist_directory=str(persistent_dir)
                      )

def build_chroma_retriever(doc_id):
  return vector_store.as_retriever(
    search_type="mmr",
    search_kwargs={"k":2, "fetch_k":5, 'filter':{'doc_id': doc_id} if doc_id else {}}
  )



print(persistent_dir)