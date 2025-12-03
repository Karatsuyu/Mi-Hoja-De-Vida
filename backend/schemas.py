from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class MessageCreate(BaseModel):
    username: str = Field(..., min_length=2, max_length=100, description="Nombre del usuario")
    email: EmailStr = Field(..., description="Email válido del usuario")
    message: str = Field(..., min_length=10, max_length=2000, description="Mensaje del usuario")

class MessageResponse(BaseModel):
    id: int
    username: str
    email: str
    message: str
    created_at: datetime
    read_status: str

    class Config:
        from_attributes = True

class ContactResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    detail: Optional[str] = None