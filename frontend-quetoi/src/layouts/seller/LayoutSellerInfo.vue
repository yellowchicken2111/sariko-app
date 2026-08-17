<script>
</script>

<template>

    <div class="background">

        <div class="main">
            
            <div class="seller-avatar">
                <slot name="SellerAvatar" />
            </div>

            <div class="seller-info-group">

                <div class="seller-name">
                    <slot name="SellerName" />
                </div>

                <div class="seller-address">
                    <slot name="SellerAddress" />
                </div>

                <div class="seller-tags">
                    <slot name="SellerTags" />
                </div>

            </div>

        </div>

    </div>

</template>

<style scoped>

.background {
    width: 100%;
}

.main {
    display: flex;
    /* justify-content: center;  */
    align-items: center;
}

.seller-avatar {
    margin-right: 20px;
}

.seller-info-group {
    display: flex;
    flex-direction: column;
    align-items: self-start;
}

</style>