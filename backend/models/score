from sqlalchemy import Column, Integer, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    level_id = Column(Integer, ForeignKey("levels.id"))

    # El corazón del ranking: tiempo en segundos (ej: 1.25s)
    time_seconds = Column(Float, nullable=False)
    # Fecha en que se logró el récord
    achieved_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones para poder obtener el nombre del usuario fácilmente
    user = relationship("User")
    level = relationship("Level")