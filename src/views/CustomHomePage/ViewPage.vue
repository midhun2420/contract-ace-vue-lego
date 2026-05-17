<template>
    <div>
        <check-permission/>

        <!-- ADMIN (SUPERUSER) -->
        <div v-if="isSuperUser" class="home">
            <AdminHome/>
        </div>

        <!-- CONSUMER -->
        <div v-if="!isSuperUser && hasDashboardAccess" class="home">
            <ConsumerHome/>
        </div>

        <!-- NO PERMISSION -->
        <div v-if="!isSuperUser && !hasDashboardAccess"
             class="card text-center bg-primary">
            Sorry, You don't have permission to view this page. Kindly contact your Owner.
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AdminHome from './AdminHome';
import ConsumerHome from './ConsumerHome';

export default {
    name       : 'Home',
    components : { AdminHome, ConsumerHome },
    computed   : {
        ...mapGetters(['currentUser']),

        // 🔑 admin === superuser
        isSuperUser () {
            return this.currentUser?.admin === true;
        },

        hasDashboardAccess () {
            return this.currentUser?.packages?.dashboard === true;
        }
    }
};
</script>
