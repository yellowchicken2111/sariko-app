from typing import (
    List,
    Union,
    Optional
)
from pydantic import BaseModel


# Cart API
class RequestReadCartItems(BaseModel):
    cart_id: Optional[str] = None
    seller_id: Optional[str] = None
    
class RequestAddCartItem(BaseModel):
    seller_id: str
    food_item_id: str
    quantity: Optional[int] = 1