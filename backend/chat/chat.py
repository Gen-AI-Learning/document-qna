from chat.vector_stores.pinecone import build_retreiver


def build_chat(chat_args):
  retreiver = build_retreiver(chat_args=chat_args)
