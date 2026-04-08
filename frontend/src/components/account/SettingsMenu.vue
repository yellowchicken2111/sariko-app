<script>
import { User, MapPin, Globe, ChevronRight } from 'lucide-vue-next';

export default {
    components: { User, MapPin, Globe, ChevronRight }
}
</script>

<template>
    <div>
        <h3 class="section-title">Settings</h3>

        <router-link to="/onboarding" class="menu-item">
            <div class="menu-icon"><User size="18" /></div>
            <span class="menu-label">Edit Profile</span>
            <ChevronRight size="16" class="menu-arrow" />
        </router-link>

        <router-link to="/onboarding" class="menu-item">
            <div class="menu-icon"><MapPin size="18" /></div>
            <span class="menu-label">Delivery Address</span>
            <ChevronRight size="16" class="menu-arrow" />
        </router-link>

        <router-link to="/onboarding" class="menu-item">
            <div class="menu-icon"><Globe size="18" /></div>
            <span class="menu-label">Language</span>
            <ChevronRight size="16" class="menu-arrow" />
        </router-link>
    </div>
</template>

<style scoped>
.section-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    padding-left: 4px;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: var(--bg-surface);
    border-radius: 12px;
    margin-bottom: 4px;
    cursor: pointer;
    text-decoration: none;
    color: var(--text-primary);
    transition: background 0.15s ease;
}

.menu-item:hover {
    background: var(--bg-card-hover);
}

.menu-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    flex-shrink: 0;
}

.menu-label {
    flex: 1;
    font-size: 15px;
    font-weight: 500;
}

.menu-arrow {
    color: var(--text-muted);
}
</style>
