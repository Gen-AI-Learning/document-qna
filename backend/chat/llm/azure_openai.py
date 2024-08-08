from langchain_openai import AzureChatOpenAI
from dotenv import load_dotenv
import os

load_dotenv()

llm = AzureChatOpenAI(
  azure_deployment= os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME"),
  api_version="2024-05-01-preview"
)

