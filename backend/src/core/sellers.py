from dao.dao_menu_categories import DAOMenuCategories
from dao.dao_seller_profiles import DAOSellerProfiles
from dao.dao_food_items import DAOFoodItems

def get_seller_full_menu(slug_name: str):
    # get seller id
    dao_seller_profiles = DAOSellerProfiles()
    seller_id = dao_seller_profiles.read_seller_id_by_slug_name(slug=slug_name)
    
    # get food items
    dao_food_items = DAOFoodItems()
    food_items = dao_food_items.read_food_items_by_seller_id(seller_id=seller_id)
    
    return