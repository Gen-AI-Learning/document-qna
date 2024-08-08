# Project Name

## Setup Instructions

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone will update
cd your-repository



### 2. Set Up the Virtual Environment
Using pipenv:
If you're using pipenv, set up the virtual environment with:

pipenv install
pipenv shell

Using venv and requirements.txt:

If you're using a requirements.txt file, set up the virtual environment with:

python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
pip install -r requirements.txt


3. Create a .env File
Create a .env file in the root of your project directory and add the following environment variables:



SQLALCHEMY_DATABASE_URL=sqlite:///./filedatabase.db
AZURE_OPENAI_API_VERSION=
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_CHAT_DEPLOYMENT_NAME=
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME=

PINECONE_API_KEY=
PINECONE_ENV_NAME=
PINECONE_INDEX_NAME=
```

4. Run the Application
   To run the application, ensure the virtual environment is activated and execute:

uvicorn main:app --reload
