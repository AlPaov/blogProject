from contextlib import asynccontextmanager
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()
Base = declarative_base()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, echo=False, future=True)

Session = sessionmaker(bind=engine)

@asynccontextmanager
async def session_scope():
    async_session = Session()
    if async_session:
        try:
            yield async_session
            async_session.commit()
        except Exception as e:
            async_session.rollback()
            raise e
        finally:
            async_session.close()

