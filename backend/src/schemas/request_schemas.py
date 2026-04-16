from typing import (
    List,
    Literal,
    Union,
    Optional
)
from pydantic import BaseModel, Field, model_validator


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

# User Profile API
class RequestUpdateProfile(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    preferred_language: Optional[str] = None
    avatar_url: Optional[str] = None
    address: Optional[str] = None
    address_details: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None

# Order API
class RequestCreateOrder(BaseModel):
    delivery_method: Literal["pickup", "delivery"]
    delivery_address: Optional[str] = None
    delivery_lat: Optional[float] = None
    delivery_lon: Optional[float] = None
    delivery_fee: Optional[float] = None
    quotation_id: Optional[str] = None
    note: Optional[str] = None

    @model_validator(mode="after")
    def validate_delivery_fields(self):
        if self.delivery_method == "delivery":
            if not self.delivery_address or not self.delivery_address.strip():
                raise ValueError("delivery_address is required for delivery orders")
            if self.delivery_lat is None or self.delivery_lon is None:
                raise ValueError("delivery_lat and delivery_lon are required for delivery orders")
        return self

# Seller Order API
class RequestUpdateOrderStatus(BaseModel):
    status: Literal["confirmed", "ready", "done", "cancelled"]
    cancellation_reason: Optional[str] = None