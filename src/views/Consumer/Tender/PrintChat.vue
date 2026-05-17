<template>
    <div>
        <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px;">
            <loading-animation/>
            <span style=" vertical-align: super"> Loading details....</span>
        </div>
        <div v-if="!loading" class="card bs-4 mt-4 full-height container">
            <h5 class="mb-4">Messages</h5>
            <div class="row mb-4">
                <div class="col-md-2 font-weight-bold">
                    User
                </div>
                <div class="col-md-7 font-weight-bold">
                    Messages
                </div>
                <div class="col-md-3 font-weight-bold">
                    Time
                </div>
            </div>
            <div class="row mb-4" v-for="(record) in  chat" v-bind:key="record.id">
                <div class="col-md-2">
                    <span v-if="record.user">{{ record.user }}</span>
                    <span v-else>Bidder</span>
                </div>
                <div class="col-md-7">
                    {{ record.message }}
                </div>
                <div class="col-md-3">
                    {{ record['created-date'] }} - {{ record['created-time'] }}
                </div>
            </div>
            <p v-if="chat.length==0">No Messages Yet!</p>
        </div>
    </div>
</template>

<script>
import axios from 'secure-axios';
import urls from '@/data/urls';
import { mapGetters } from 'vuex';

export default {
    name : 'PrintChat',
    data () {
        return {
            id      : this.$route.params.id,
            loading : false,
            chat    : null
        };
    },
    mounted () {
        this.loadDetails();
    },
    computed : {
        ...mapGetters(['currentUser'])
    },
    methods : {
        printChat () {
            alert('print');
        },
        loadDetails () {
            const that = this;
            that.loading = true;
            axios.form(urls.Consumer.MyBid.chat, { bid_id : that.id }).then(function (response) {
                const json = response.data;
                that.chat = json.data;
                that.loading = false;
                that.loading = false;
            });
        }
    }
};
</script>

<style scoped>
.text-small {
    font-weight: 500;
}

.form-control {
    border-radius: 5px;
}

.ps {
    height: 500px;
}

p {
    text-align: center;
    line-height: 100%;
}

.time {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.5);
}
</style>
