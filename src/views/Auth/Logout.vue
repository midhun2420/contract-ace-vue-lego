<template>
    <div>
        Closing Session...
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';
import urls from '@/data/urls';

export default {
    name     : 'LogoutPage',
    computed : {
        ...mapGetters(['currentUser'])
    },
    beforeMount () {
        this.logout();
    },
    methods : {
        ...mapActions(['signOut']),
        logout (user) {
            this.signOut();
            axios.get(urls.auth.logout);
            this.$router.push('/auth/login/').catch(() => {});
        }
    }
};
</script>

<style scoped>

</style>
