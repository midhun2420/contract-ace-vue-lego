<template>
    <div class="page page-normal">
        <notifications/>
        <lego-nav-bar shadow="5" drop-down-animation="bounce" sticky colored
                      hover-effect="basic-3" :items="menu" has-separator>
            <template slot="logo">
                <div class="fl-eq" @click="$router.push('/app/')">
                    <img alt="contractAce" src="../assets/images/CA black 1 (2).png">
                </div>
            </template>
        </lego-nav-bar>
        <div class="page-content px-3">
            <transition enter-active-class="animated backInDown" leave-active-class="animated backOutUp" mode="out-in">
                <router-view>

                </router-view>
            </transition>
        </div>
<!--        <div class="bgc-primary-900 p-3">-->
<!--            Powered by Xeoscript Technologies-->
<!--        </div>-->
    </div>
</template>

<script>
import LegoNavBar from 'lego-framework/src/components/NavBar';
import menu from '@/data/menu';

export default {
    components : {
        LegoNavBar
    },
    data () {
        return {
            menu : menu()
        };
    },
    // metaInfo : {
    //     title         : 'Contract Ace',
    //     titleTemplate : 'Contract Ace - %s',
    //     htmlAttrs     : {
    //         lang : 'en',
    //         amp  : true
    //     }
    // },
    name : 'MainLayout'
};
</script>
<style scoped>
  :deep(ul.nav-sub-menu.bs-5) {
  right: 0 !important;
  left: auto !important;
  transform: none !important;
}
</style>
