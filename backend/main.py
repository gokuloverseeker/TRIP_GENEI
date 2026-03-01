"""
TripGenie AI — FastAPI Backend (AMD Edition)
Main application entry point
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import plan, rebalance

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

app = FastAPI(
    title="TripGenie AI API",
    description="AMD-Powered Intelligent Travel Optimization Engine",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS — allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(plan.router, prefix="/api", tags=["Trip Planning"])
app.include_router(rebalance.router, prefix="/api", tags=["Rebalancing"])


@app.get("/health", tags=["Health"])
async def health():
    return {
        "status": "healthy",
        "service": "TripGenie AI",
        "powered_by": "AMD ROCm",
        "version": "1.0.0"
    }


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "🚀 TripGenie AI — AMD-Powered Travel Optimization Engine",
        "docs": "/docs",
        "health": "/health"
    }
