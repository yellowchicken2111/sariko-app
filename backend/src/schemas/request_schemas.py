from typing import (
    List,
    Union,
    Optional
)
from pydantic import BaseModel, Field


# Cart API
class RequestReadCartItems(BaseModel):
    cart_id: Optional[str] = None
    seller_id: Optional[str] = None
    
class RequestAddCartItem(BaseModel):
    seller_id: str
    food_item_id: str
    quantity: Optional[int] = 1

class RequestUpdateCartItem(BaseModel):
    food_item_id: str
    quantity: int = Field(gt=0)

# Order API
class RequestCreateOrder(BaseModel):
    delivery_method: str  # "pickup" or "delivery"
    delivery_address: Optional[str] = None
    note: Optional[str] = None