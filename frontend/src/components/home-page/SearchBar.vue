<script>
import { mapWritableState } from 'pinia';
import { useHomeStore } from '@/stores/homeStore';
import { Search } from 'lucide-vue-next';

export default {

    components: {
        Search
    },

    computed: {
        ...mapWritableState(useHomeStore, [
            "searchQuery"
        ])
    }
}
</script>

<template>

    <div class="search-box">
        <Search size="14px" style="color: rgba(255, 255, 255, 0.5);"/>
        <q-input
        class="input-search"
        dense
        placeholder="Search food, services, more..."
        />
    </div>

</template>

<style lang="scss" scoped>
.search-box {
    display: flex;
    align-items: center;
    background-color: #151b2a;
    padding-left: 15px;
    border-radius: .75rem;
    border: solid 1px rgba(255, 255, 255, 0.15);
}

.input-search {
    margin-left: 10px;
    width: 100%;
}

:deep(.q-field__native::placeholder) {
    font-family: $sariko-font-family-secondary; 
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
}

:deep(.q-field__native) {
    color: #fff;
}
</style>