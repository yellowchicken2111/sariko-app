<script>
</script>

<template>
    <header class="header">
        <div class="header-left">
            <span class="location-label">Current Location</span>
            <div class="location-selector">
                <h1 class="agency-name">Manila, Philippines</h1>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
        </div>
        <div class="header-right">
            <button class="icon-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </button>
        </div>
    </header>
</template>

<style scoped>

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.header-left {
    display: flex;
    flex-direction: column;
}

.location-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 2px;
}

.location-selector {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
}

.agency-name {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}

.icon-btn {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: var(--bg-surface);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--color-accent);
    transition: background 0.2s ease;
    box-shadow: var(--shadow-card);
}

.icon-btn:hover {
    background: var(--bg-card-hover);
}
</style>