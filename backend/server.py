from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import httpx
import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Google Places API config
GOOGLE_PLACES_API_KEY = os.environ.get('GOOGLE_PLACES_API_KEY', '')
GOOGLE_PLACE_ID = os.environ.get('GOOGLE_PLACE_ID', '')

# Sanity config
SANITY_PROJECT_ID = os.environ.get('SANITY_PROJECT_ID', '')
SANITY_DATASET = os.environ.get('SANITY_DATASET', 'production')
SANITY_API_TOKEN = os.environ.get('SANITY_API_TOKEN', '')

# Resend config
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
NOTIFICATION_EMAIL = os.environ.get('NOTIFICATION_EMAIL', 'support@dfwhvac.com')
resend.api_key = RESEND_API_KEY

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class GoogleReviewsResponse(BaseModel):
    rating: float
    review_count: int
    business_name: str
    updated_at: str


class LeadSubmission(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str
    serviceAddress: str
    numSystems: str = ""
    problemDescription: str


class LeadResponse(BaseModel):
    success: bool
    message: str
    lead_id: Optional[str] = None

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


@api_router.post("/leads", response_model=LeadResponse)
async def submit_lead(lead: LeadSubmission):
    """Submit a lead form and send email notification"""
    lead_id = str(uuid.uuid4())
    
    try:
        # Save lead to database
        lead_doc = {
            "id": lead_id,
            "firstName": lead.firstName,
            "lastName": lead.lastName,
            "email": lead.email,
            "phone": lead.phone,
            "serviceAddress": lead.serviceAddress,
            "numSystems": lead.numSystems,
            "problemDescription": lead.problemDescription,
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "status": "new"
        }
        await db.leads.insert_one(lead_doc)
        logger.info(f"Lead saved to database: {lead_id}")
        
        # Send email notification
        if RESEND_API_KEY:
            try:
                email_html = f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #003153; color: white; padding: 20px; text-align: center;">
                        <h1 style="margin: 0;">New Lead Received!</h1>
                    </div>
                    
                    <div style="padding: 20px; background-color: #f9f9f9;">
                        <h2 style="color: #FF0000; margin-top: 0;">⚡ Action Required</h2>
                        <p style="font-size: 16px;">A potential customer has submitted a service request. Call them back promptly!</p>
                        
                        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #003153; margin-top: 0;">Contact Information</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{lead.firstName} {lead.lastName}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                                        <a href="tel:{lead.phone}" style="color: #FF0000; font-weight: bold; font-size: 18px;">{lead.phone}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                                        <a href="mailto:{lead.email}">{lead.email}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Service Address:</strong></td>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{lead.serviceAddress}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>HVAC Systems:</strong></td>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{lead.numSystems or 'Not specified'}</td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style="background-color: white; padding: 20px; border-radius: 8px;">
                            <h3 style="color: #003153; margin-top: 0;">Service Request Details</h3>
                            <p style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 0;">
                                {lead.problemDescription}
                            </p>
                        </div>
                        
                        <div style="margin-top: 20px; padding: 15px; background-color: #e8f5e9; border-radius: 8px; text-align: center;">
                            <p style="margin: 0; color: #2e7d32;">
                                <strong>Lead ID:</strong> {lead_id}<br>
                                <small>Submitted: {datetime.now(timezone.utc).strftime('%B %d, %Y at %I:%M %p UTC')}</small>
                            </p>
                        </div>
                    </div>
                    
                    <div style="background-color: #003153; color: white; padding: 15px; text-align: center; font-size: 12px;">
                        <p style="margin: 0;">DFW HVAC Lead Notification System</p>
                    </div>
                </div>
                """
                
                resend.Emails.send({
                    "from": "DFW HVAC Leads <leads@dfwhvac.com>",
                    "to": [NOTIFICATION_EMAIL],
                    "subject": f"🔥 New Lead: {lead.firstName} {lead.lastName} - {lead.phone}",
                    "html": email_html
                })
                logger.info(f"Email notification sent for lead: {lead_id}")
                
            except Exception as email_error:
                logger.error(f"Failed to send email notification: {email_error}")
                # Don't fail the whole request if email fails
        
        return LeadResponse(
            success=True,
            message="Thank you! We'll call you within 2 business hours.",
            lead_id=lead_id
        )
        
    except Exception as e:
        logger.error(f"Error processing lead: {e}")
        return LeadResponse(
            success=False,
            message="Something went wrong. Please try again or call us directly."
        )


@api_router.get("/google-reviews", response_model=GoogleReviewsResponse)
async def get_google_reviews():
    """Fetch current Google rating and review count"""
    if not GOOGLE_PLACES_API_KEY or not GOOGLE_PLACE_ID:
        return GoogleReviewsResponse(
            rating=5.0,
            review_count=129,
            business_name="DFW HVAC",
            updated_at=datetime.now(timezone.utc).isoformat()
        )
    
    async with httpx.AsyncClient() as http_client:
        response = await http_client.get(
            "https://maps.googleapis.com/maps/api/place/details/json",
            params={
                "place_id": GOOGLE_PLACE_ID,
                "fields": "name,rating,user_ratings_total",
                "key": GOOGLE_PLACES_API_KEY
            }
        )
        data = response.json()
        
        if data.get("status") == "OK":
            result = data["result"]
            return GoogleReviewsResponse(
                rating=result.get("rating", 5.0),
                review_count=result.get("user_ratings_total", 0),
                business_name=result.get("name", "DFW HVAC"),
                updated_at=datetime.now(timezone.utc).isoformat()
            )
        else:
            logger.error(f"Google Places API error: {data}")
            return GoogleReviewsResponse(
                rating=5.0,
                review_count=129,
                business_name="DFW HVAC",
                updated_at=datetime.now(timezone.utc).isoformat()
            )


@api_router.post("/sync-google-reviews")
async def sync_google_reviews_to_sanity():
    """Fetch Google reviews and update Sanity CMS"""
    if not GOOGLE_PLACES_API_KEY or not SANITY_API_TOKEN:
        return {"error": "Missing API keys"}
    
    # Fetch from Google
    async with httpx.AsyncClient() as http_client:
        response = await http_client.get(
            "https://maps.googleapis.com/maps/api/place/details/json",
            params={
                "place_id": GOOGLE_PLACE_ID,
                "fields": "name,rating,user_ratings_total",
                "key": GOOGLE_PLACES_API_KEY
            }
        )
        google_data = response.json()
        
        if google_data.get("status") != "OK":
            return {"error": "Failed to fetch Google data", "details": google_data}
        
        result = google_data["result"]
        rating = result.get("rating", 5.0)
        review_count = result.get("user_ratings_total", 0)
        
        # Update Sanity
        sanity_mutations = {
            "mutations": [
                {
                    "patch": {
                        "id": "companyInfo",
                        "set": {
                            "googleRating": rating,
                            "googleReviews": review_count
                        }
                    }
                }
            ]
        }
        
        sanity_response = await http_client.post(
            f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/{SANITY_DATASET}",
            json=sanity_mutations,
            headers={
                "Authorization": f"Bearer {SANITY_API_TOKEN}",
                "Content-Type": "application/json"
            }
        )
        
        sanity_result = sanity_response.json()
        
        return {
            "success": True,
            "google_rating": rating,
            "google_reviews": review_count,
            "sanity_updated": sanity_result,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()