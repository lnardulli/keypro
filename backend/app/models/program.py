from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base

class Program(Base):
    __tablename__ = "programs"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True) # ej: "IntelliJ IDEA"
    slug = Column(String, unique=True) # ej: "intellij-idea"

    levels = relationship("Level", back_populates="program")