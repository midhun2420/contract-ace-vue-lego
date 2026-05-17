<template>
    <div>
        <check-permission/>

        <!-- My Bids Table -->
        <vue-table-card
            v-if="currentUser.features.my_bids_views_and_update"
            title="My Bids"
            class="card bs-5"
            :url="listUrl"
            :fields="fields"
            :per-page="10"
            ref="table">

            <template #actions="{ rowData }">
                <div class="btn-group-tight">

                    <!-- Open -->
                    <btn
                        class="bgc-primary-400"
                        size="xs"
                        v-if="
                            (rowData.tender_status === 'Published' ||
                            (rowData.tender_status === 'Closed' && rowData.is_unlocked)) &&
                            (rowData.status === 'Published' || rowData.status === 'Saved')
                        "
                        @click="viewDetails(rowData)"
                        text="Open"
                    />

                    <!-- Preview -->
                    <btn
                        class="bgc-primary-600"
                        size="xs"
                        @click="preview(rowData)"
                        text="Preview"
                    />

                    <!-- ✅ Query (ONLY if chat_with_vendors package enabled) -->
                    <btn
                        class="bgc-primary-200"
                        size="xs"
                        v-if="canChatWithVendor"
                        @click="viewChat(rowData)"
                        text="Query"
                    />

                    <!-- ✅ Print (ONLY if printing_tenders package enabled) -->
                    <btn
                        color="secondary"
                        size="xs"
                        v-if="canPrintTender"
                        @click="print(rowData)"
                        text="Print"
                    />

                </div>
            </template>
        </vue-table-card>

        <!-- No Permission -->
        <div
            v-if="!currentUser.features.my_bids_views_and_update"
            class="card text-center bg-primary">
            Sorry, You don't have permission to view this page.
            Kindly contact your Owner.
        </div>
    </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';
import { mapGetters } from 'vuex';

export default {
    name : 'MyBids',

    data () {
        return {
            listUrl : urls.Consumer.MyBid.list,
            fields  : [
                { name : 'id', sortField : 'id', title : 'ID' },
                { name : 'name', sortField : 'name', title : 'Tender' },
                { name : 'created_by', sortField : 'created_by', title : 'Created By' },
                { name : 'created_date', sortField : 'created_date', title : 'Created Date' },
                { name : 'closed_date', sortField : 'closed_date', title : 'Closed Date' },
                { name : 'status', sortField : 'status', title : 'Bid Status' },
                { name : 'tender_status', sortField : 'tender_status', title : 'Tender Status' },
                {
                    name       : '__slot:actions',
                    title      : '',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
                }
            ]
        };
    },

    computed : {
        ...mapGetters(['currentUser']),

        /**
         * Helper to handle true / "true"
         */
        isEnabled () {
            return v => v === true || v === 'true';
        },

        /**
         * ✅ Query permission
         */
        canChatWithVendor () {
            const pkg = this.currentUser.packages || {};
            return this.isEnabled(pkg.chat_with_vendors);
        },

        /**
         * ✅ Print permission
         */
        canPrintTender () {
            const pkg = this.currentUser.packages || {};
            return (
                this.currentUser.role === 'owner' &&
                this.isEnabled(pkg.printing_tenders)
            );
        }
    },

    methods : {
        viewChat (rowData) {
            this.$router.push('/app/bidder/' + rowData.id + '/chat/');
        },

        viewDetails (rowData) {
            this.$router.push('/app/bid/' + rowData.id + '/details/');
        },

        preview (rowData) {
            this.$router.push('/app/bid/' + rowData.id + '/preview/');
        },

        print (item) {
            this.loading = true;

            axios
                .form(urls.Consumer.MyBid.Print, { bid_id : item.id })
                .then(response => {
                    const json = response.data;
                    if (json.url) {
                        this.$notify('Pdf generated successfully', 'Success', {
                            type : 'success'
                        });
                        window.open(json.url);
                    } else {
                        this.$notify('Pdf generation failed', 'Error', {
                            type : 'danger'
                        });
                    }
                })
                .catch(() => {
                    this.$notify('Pdf generation failed', 'Error', {
                        type : 'danger'
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>

<style scoped>
/* optional */
</style>
