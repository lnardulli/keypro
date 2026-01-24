from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Shortcut(Base):
    __tablename__ = "shortcuts"
    id = Column(Integer, primary_key=True, index=True)
    level_id = Column(Integer, ForeignKey("levels.id"))

    key_combination = Column(String) # ej: "ctrl+shift+a"
    display_label = Column(String)    # ej: "Find Action"
    description = Column(String)      # ej: "Busca cualquier comando por nombre"
    order = Column(Integer)           # Orden dentro del nivel (1, 2, 3...)

    level = relationship("Level", back_populates="shortcuts")