from datetime import datetime
from typing import (
    List,
    Literal,
    Union,
    Optional
)
from pydantic import BaseModel, Field, model_validator


class RequestUploadImage(BaseModel):
    image_base64: str
    content_type: Optional[str] = None


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

# Chat API
class RequestCreateConversation(BaseModel):
    seller_slug: str

class RequestSetPinned(BaseModel):
    pinned: bool

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
    delivery_appointment: Optional[datetime] = None

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

# Seller Menu — Categories
class RequestCreateCategory(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    sort_order: Optional[int] = 0

class RequestUpdateCategory(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None

# Seller Menu — Food Items
class RequestCreateFoodItem(BaseModel):
    category_id: Optional[str] = None
    name: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    price: float = Field(gt=0)
    unit_label: Optional[str] = None
    min_quantity: Optional[int] = Field(default=1, ge=1)
    quantity_step: Optional[int] = Field(default=1, ge=1)
    preorder_day: Optional[int] = Field(default=0, ge=0)
    is_available: Optional[bool] = True
    is_featured: Optional[bool] = False
    image_url: Optional[str] = None

class RequestUpdateFoodItem(BaseModel):
    category_id: Optional[str] = None
    name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = None
    price: Optional[float] = Field(default=None, gt=0)
    unit_label: Optional[str] = None
    min_quantity: Optional[int] = Field(default=None, ge=1)
    quantity_step: Optional[int] = Field(default=None, ge=1)
    preorder_day: Optional[int] = Field(default=None, ge=0)
    is_available: Optional[bool] = None
    is_featured: Optional[bool] = None
    image_url: Optional[str] = None