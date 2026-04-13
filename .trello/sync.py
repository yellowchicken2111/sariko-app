#!/usr/bin/env python3
"""
Trello board sync for Sariko MVP.

Usage:
    1. Get your API key: https://trello.com/app-key
    2. Get your token from that same page
    3. Run: python .trello/sync.py

Or set env vars:
    TRELLO_API_KEY=... TRELLO_TOKEN=... python .trello/sync.py
"""

import json
import os
import sys
import requests
import dotenv
dotenv.load_dotenv()

API_KEY = os.environ.get("TRELLO_API_KEY") or input("Trello API Key: ").strip()
TOKEN   = os.environ.get("TRELLO_TOKEN")   or input("Trello Token: ").strip()
ORG_ID  = os.environ.get("TRELLO_ORG_ID", "sarisarikoto")  # workspace short name from trello.com/org/sarisarikoto
BASE    = "https://api.trello.com/1"


def api(method, path, **kwargs):
    params = kwargs.pop("params", {})
    params.update({"key": API_KEY, "token": TOKEN})
    r = requests.request(method, f"https://api.trello.com/1{path}", params=params, **kwargs)
    r.raise_for_status()
    return r.json()

def list_orgs():
    """List all workspaces you belong to — run this first to find your org short name."""
    orgs = api("GET", "/members/me/organizations")
    print("\nYour Trello Workspaces:")
    for o in orgs:
        print(f"  short name: {o['name']}  |  display name: {o['displayName']}  |  id: {o['id']}")
    return orgs

def create_board(name, desc, org_id):
    print(f"Creating board: {name} (org: {org_id})")
    board = api("POST", "/boards/", params={
        "name": name,
        "desc": desc,
        "idOrganization": org_id,
        "defaultLists": "false",
        "prefs_background": "blue",
    })
    print(f"  ✅ Board created: {board['shortUrl']}")
    return board["id"]

def create_label(board_id, name, color):
    label = api("POST", "/labels", params={
        "name": name,
        "color": color,
        "idBoard": board_id,
    })
    return label["id"]

def create_list(board_id, name):
    lst = api("POST", "/lists", params={
        "name": name,
        "idBoard": board_id,
    })
    return lst["id"]

def create_card(list_id, name, desc, label_ids):
    card = api("POST", "/cards", params={
        "name": name,
        "desc": desc,
        "idList": list_id,
        "idLabels": ",".join(label_ids),
    })
    return card["id"]

def main():
    with open(os.path.join(os.path.dirname(__file__), "board.json")) as f:
        config = json.load(f)

    board_id = create_board(
        config["board"]["name"],
        config["board"]["desc"],
        ORG_ID,
    )

    # Pre-create labels from board.json config
    label_map = {}
    for key, lbl in config["labels"].items():
        label_map[key] = create_label(board_id, lbl["name"], lbl["color"])

    # Create lists + cards
    for lst in config["lists"]:
        print(f"\nCreating list: {lst['name']}")
        list_id = create_list(board_id, lst["name"])
        for card in lst.get("cards", []):
            label_ids = [label_map[l] for l in card.get("labels", []) if l in label_map]
            create_card(list_id, card["name"], card.get("desc", ""), label_ids)
            print(f"  + {card['name']}")

    print(f"\n🎉 Board ready!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nCancelled.")
        sys.exit(0)
    except requests.HTTPError as e:
        print(f"Trello API error: {e.response.status_code} — {e.response.text}")
        sys.exit(1)
