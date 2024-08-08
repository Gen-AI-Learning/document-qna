from langchain_openai import AzureOpenAIEmbeddings
import os
from dotenv import load_dotenv


load_dotenv()


embeddings = AzureOpenAIEmbeddings(
  azure_deployment=os.environ['AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME'],
  openai_api_version="2023-05-15"
)