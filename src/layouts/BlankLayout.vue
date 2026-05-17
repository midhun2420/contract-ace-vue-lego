<template>
    <div class="full-height">
        <transition name="fade" mode="out-in">
            <router-view>

            </router-view>
        </transition>
    </div>
</template>
<script>

export default {
    components : {},
    data () {
        return {};
    },
    // metaInfo : {
    //     titleTemplate : '%s - Contract Ace',
    //     htmlAttrs     : {
    //         lang : 'en',
    //         amp  : true
    //     }
    // },
    name : 'MainLayout'
};
</script>
