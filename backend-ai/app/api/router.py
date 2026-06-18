from fastapi import APIRouter
from .endpoints import intel, training, interview, eval, chatbot, evaluation, mock_tests, gto_progress, pi_interview, reports, olq_tracker
from app.middleware import rate_limiter
from .brigadier_router import router as brigadier_router

api_router = APIRouter()

api_router.include_router(intel.router, prefix="/intel", tags=["Intelligence"])
api_router.include_router(training.router, prefix="/training", tags=["Training"])
api_router.include_router(interview.router, prefix="/interview", tags=["Virtual Interview"])
api_router.include_router(eval.router, prefix="/eval", tags=["AI Evaluation"])
api_router.include_router(chatbot.router, prefix="/chatbot", tags=["AI Chatbot"])
api_router.include_router(evaluation.router, prefix="/evaluate", tags=["Test Evaluation"])
api_router.include_router(mock_tests.router, prefix="/mock-test", tags=["Mock Tests"])
api_router.include_router(gto_progress.router, tags=["GTO Progress"])
api_router.include_router(rate_limiter.router, prefix="/security", tags=["Security & Telemetry"])
api_router.include_router(brigadier_router, tags=["Brigadier AI"])
api_router.include_router(pi_interview.router, tags=["Personal Interview"])
api_router.include_router(reports.router, tags=["Assessment Reports"])
api_router.include_router(olq_tracker.router, tags=["OLQ Tracking"])
