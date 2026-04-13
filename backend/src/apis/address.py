"""
Address search & reverse geocode — proxies Goong.io REST API.
Keeps GOONG_API_KEY server-side, never exposed to frontend.

Goong docs:
  - Autocomplete: https://docs.goong.io/rest/place  (GET /Place/AutoComplete)
  - Place Detail: https://docs.goong.io/rest/place  (GET /Place/Detail)
  - Geocode:      https://docs.goong.io/rest/geocode (GET /Geocode)
"""
import os
import logging

import httpx
from fastapi import APIRouter, HTTPException, Depends, Query

from core.auth import verify_token

router = APIRouter(prefix="/address")
logger = logging.getLogger(__name__)

GOONG_API_KEY = os.getenv("GOONG_API_KEY", "")
GOONG_BASE_URL = "https://rsapi.goong.io"


def _require_key():
    if not GOONG_API_KEY:
        raise HTTPException(status_code=503, detail="Address service not configured (missing GOONG_API_KEY)")


@router.get("/search")
def search_address(q: str = Query(..., min_length=2), user=Depends(verify_token)):
    """
    Autocomplete address search via Goong Places API.
    GET /rest/v1/address/search?q=nguyen+hue

    Returns list of predictions with place_id (use /detail to get lat/lon).
    """
    _require_key()
    try:
        with httpx.Client(timeout=5.0) as client:
            res = client.get(f"{GOONG_BASE_URL}/Place/AutoComplete", params={
                "api_key": GOONG_API_KEY,
                "input": q,
                "location": "10.7769,106.7009",  # HCMC bias
                "radius": 50,
                "more_compound": "true",
            })
            res.raise_for_status()
            data = res.json()

        predictions = data.get("predictions", [])
        results = []
        for p in predictions:
            sf = p.get("structured_formatting", {})
            results.append({
                "place_id": p.get("place_id", ""),
                "label": p.get("description", ""),
                "main_text": sf.get("main_text", ""),
                "secondary_text": sf.get("secondary_text", ""),
            })

        return {"success": True, "results": results}

    except httpx.HTTPStatusError as e:
        logger.error(f"Goong autocomplete error: {e.response.status_code} {e.response.text}")
        raise HTTPException(status_code=502, detail="Address search failed")
    except Exception as e:
        logger.exception(f"Address search error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/detail")
def get_place_detail(place_id: str = Query(...), user=Depends(verify_token)):
    """
    Get lat/lon + formatted address for a place_id via Goong Place Detail API.
    GET /rest/v1/address/detail?place_id=xxx
    """
    _require_key()
    try:
        with httpx.Client(timeout=5.0) as client:
            res = client.get(f"{GOONG_BASE_URL}/Place/Detail", params={
                "api_key": GOONG_API_KEY,
                "place_id": place_id,
            })
            res.raise_for_status()
            data = res.json()

        result = data.get("result", {})
        location = result.get("geometry", {}).get("location", {})
        lat = location.get("lat")
        lng = location.get("lng")
        address = result.get("formatted_address", "")

        if lat is None or lng is None:
            raise HTTPException(status_code=404, detail="Place not found")

        return {
            "success": True,
            "lat": lat,
            "lon": lng,
            "address": address,
            "name": result.get("name", ""),
        }

    except HTTPException:
        raise
    except httpx.HTTPStatusError as e:
        logger.error(f"Goong detail error: {e.response.status_code} {e.response.text}")
        raise HTTPException(status_code=502, detail="Place detail failed")
    except Exception as e:
        logger.exception(f"Place detail error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/reverse")
def reverse_geocode(
    lat: float = Query(...),
    lon: float = Query(...),
    user=Depends(verify_token),
):
    """
    Reverse geocode lat/lon → address via Goong Geocoding API.
    GET /rest/v1/address/reverse?lat=10.77&lon=106.70
    """
    _require_key()
    try:
        with httpx.Client(timeout=5.0) as client:
            res = client.get(f"{GOONG_BASE_URL}/Geocode", params={
                "api_key": GOONG_API_KEY,
                "latlng": f"{lat},{lon}",
            })
            res.raise_for_status()
            data = res.json()

        results = data.get("results", [])
        if not results:
            return {"success": True, "address": None}

        return {
            "success": True,
            "address": results[0].get("formatted_address", ""),
        }

    except httpx.HTTPStatusError as e:
        logger.error(f"Goong reverse error: {e.response.status_code} {e.response.text}")
        raise HTTPException(status_code=502, detail="Reverse geocode failed")
    except Exception as e:
        logger.exception(f"Reverse geocode error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
