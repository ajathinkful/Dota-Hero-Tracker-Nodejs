from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
import requests

# Create FastAPI instance
app = FastAPI()

# SQLAlchemy Database URL (replace with your ElephantSQL URL)
SQLALCHEMY_DATABASE_URL = "postgres://svhapqwh:rPT_DF_OpvGMaaZKvj6DtnxYIrxm0SoG@jelani.db.elephantsql.com/svhapqwh"

# Create SQLAlchemy engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# SessionLocal for database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Base class for SQLAlchemy models
Base = declarative_base()

# SQLAlchemy model for matches table
class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer)
    player_id = Column(String)
    won = Column(Boolean)
    hero_id = Column(Integer)
    kills = Column(Integer)
    deaths = Column(Integer)
    assists = Column(Integer)
    gpm = Column(Integer)

# Create all tables in the database
Base.metadata.create_all(bind=engine)

# Endpoint to fetch recent matches from OpenDota API and store in database
@app.get("/store-recent-matches")
def store_recent_matches(db: Session = Depends(get_db)):
    try:
        player_id = "124197337"  # Your specific player ID
        response = requests.get(f"https://api.opendota.com/api/players/{player_id}/recentMatches")
        recent_matches = response.json()[:5]  # Limit to 5 recent matches

        # Filter and store only ranked all pick matches
        for match in recent_matches:
            if match["lobby_type"] == 7:  # Filter for ranked all pick matches
                db_match = Match(
                    match_id=match["match_id"],
                    player_id=player_id,
                    won=match["radiant_win"] == (match["player_slot"] < 128),
                    hero_id=match["hero_id"],
                    kills=match["kills"],
                    deaths=match["deaths"],
                    assists=match["assists"],
                    gpm=match["gold_per_min"]
                )
                db.add(db_match)
        db.commit()

        return {"message": "Recent matches stored successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
