from dao.dao_seller_profiles import DAOSellerProfiles
from dao.dao_food_items import DAOFoodItems


def get_seller_full_menu(slug_name: str):
    dao_seller_profiles = DAOSellerProfiles()
    seller = dao_seller_profiles.read_seller_by_slug_name(slug=slug_name)
    if not seller:
        return None

    dao_food_items = DAOFoodItems()
    food_items = dao_food_items.read_food_items_by_seller_id(seller_id=seller["id"])

    return {"seller": seller, "menus": food_items}