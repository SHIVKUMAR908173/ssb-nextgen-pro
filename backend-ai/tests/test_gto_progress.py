import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock
from main import app
import json

client = TestClient(app)

@pytest.fixture
def mock_db_pool(monkeypatch):
    # Create a mock connection
    mock_conn = AsyncMock()
    
    # Mock acquire context manager
    mock_acquire = AsyncMock()
    mock_acquire.__aenter__.return_value = mock_conn
    mock_acquire.__aexit__.return_value = None
    
    # Create the pool mock
    mock_pool = MagicMock()
    mock_pool.acquire.return_value = mock_acquire
    
    # Patch the app state
    app.state.db_pool = mock_pool
    
    return mock_conn

def test_save_gto_progress_unauthorized():
    # Should fail without auth header
    response = client.post("/api/v1/api/gto/progress/save", json={
        "level_id": 1,
        "level_type": "PGT"
    })
    assert response.status_code == 401

def test_save_gto_progress_success(mock_db_pool):
    # Mock the return value for the SELECT query after save
    mock_db_pool.fetchrow.return_value = {
        "level_id": 1,
        "level_type": "PGT",
        "completed": True,
        "stars": 3,
        "best_score": 100,
        "time_taken": 120,
        "attempts": 1,
        "best_completion": None
    }
    
    response = client.post(
        "/api/v1/api/gto/progress/save", 
        json={
            "level_id": 1,
            "level_type": "PGT",
            "completed": True,
            "stars": 3,
            "best_score": 100,
            "time_taken": 120
        },
        headers={"Authorization": "Bearer test_user_id"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["progress"]["level_id"] == 1
    assert data["progress"]["stars"] == 3

def test_get_gto_progress(mock_db_pool):
    mock_db_pool.fetchrow.return_value = {
        "level_id": 5,
        "level_type": "HGT",
        "completed": False,
        "stars": 0,
        "best_score": 0,
        "time_taken": None,
        "attempts": 2,
        "best_completion": None
    }
    
    response = client.get(
        "/api/v1/api/gto/progress/5",
        headers={"Authorization": "Bearer test_user_id"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["progress"]["level_id"] == 5
    assert data["progress"]["level_type"] == "HGT"
    assert data["progress"]["attempts"] == 2

def test_get_gto_stats(mock_db_pool):
    # Mock the returned rows for get_all_gto_progress
    mock_db_pool.fetch.return_value = [
        {
            "level_id": 1,
            "level_type": "PGT",
            "completed": True,
            "stars": 3,
            "best_score": 95,
            "time_taken": 300
        },
        {
            "level_id": 2,
            "level_type": "HGT",
            "completed": True,
            "stars": 2,
            "best_score": 85,
            "time_taken": 400
        }
    ]
    
    response = client.get(
        "/api/v1/api/gto/progress",
        headers={"Authorization": "Bearer test_user_id"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["total_stars"] == 5
    assert data["total_score"] == 180
    assert data["total_levels_completed"] == 2
    assert data["levels_by_type"]["PGT"] == 1
    assert data["levels_by_type"]["HGT"] == 1
