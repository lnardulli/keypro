from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Level(Base):
    __tablename__ = "levels"
    id = Column(Integer, primary_key=True, index=True)
    program_id = Column(Integer, ForeignKey("programs.id"))
    title = Column(String) # ej: "Navegación Esencial"
    order = Column(Integer) # El nivel 1, 2, etc.

    program = relationship("Program", back_populates="levels")
    shortcuts = relationship("Shortcut", back_populates="level")