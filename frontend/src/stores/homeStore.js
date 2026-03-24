import { defineStore } from "pinia";
import { categories } from "@/stores/data.js";
import { menus } from "@/stores/data.js"

export const useHomeStore = defineStore('homeStore', {
    state: () => {
        return {
            // search bax
            searchQuery: '',

            // selected catergories
            categories: categories,
            selectedCategory: null,

            // featured dishes
            featuredDishes: menus['Lutong Bahay'].slice(0, 6)
        }   
    }
})