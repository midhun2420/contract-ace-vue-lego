<template>
    <div>
        <tabs v-if="currentUser.features.contacts_my_vendor" class="card bs-5">
            <tab title="Preferred Vendors">
                <MyContacts/>
            </tab>
            <tab title="All Vendors">
                <company/>
            </tab>
            <tab title="Invite Vendors">
                <InviteUsers/>
            </tab>
        </tabs>
        <div v-if="!currentUser.features.contacts_my_vendor" class="card text-center bg-primary">
            Sorry, You don't have permission to view this page. Kindly contact your Owner.
        </div>
    </div>
</template>

<script>
import Company from '../../Consumer/MyContacts/Company';
import MyContacts from '../../Consumer/MyContacts/MyContacts';
import { mapGetters } from 'vuex';
import InviteUsers from './InviteUsers';

export default {
    name       : 'MyContactViewPage',
    components : { InviteUsers, Company, MyContacts },
    computed   : {
        ...mapGetters(['currentUser'])
    }
};
</script>
