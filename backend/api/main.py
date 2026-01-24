from fastapi import FastAPI
from loguru import logger

# Initialize FastAPI app
app = FastAPI()


@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"Hello": "World"}

# Placeholder for other routes
# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: str | None = None):
#     logger.debug(f"Item endpoint accessed with id: {item_id} and query: {q}")
#     return {"item_id": item_id, "q": q}
