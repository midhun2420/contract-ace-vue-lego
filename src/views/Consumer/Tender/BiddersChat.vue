<template>
    <div>
        <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px;">
            <loading-animation/>
            <span style=" vertical-align: super"> Loading details....</span>
        </div>
        <div v-if="!loading" class="container card bs-5">
            <div class="row">
                <div class="col text-left mb-3">
                    <h4>Queries</h4>
                </div>
                <div class="col text-right mb-3">
                    <btn type="button" class="m-1" color="primary" size="xs"
                         @click="printChat" text="Print"/>
                    <btn type="button" class="m-1" color="primary" size="xs"
                         @click="$router.push('/app/tender/' + tender_id + '/details/')" text="Back"/>
                </div>
            </div>
            <p v-if="chat.length===0">No Messages Yet!</p>
            <perfect-scrollbar id="scroll">
                <div v-for="(record) in  chat" v-bind:key="record.id">
                    <div v-if="record['user-id']!==currentUser.id"
                         class="card w-65r row bgc-primary-100 p-2 m-2">
                        <div class="col time text-left text-capitalize">
                            <b v-if="record.user">{{ record.user }}</b>
                            <b v-else>Bidder</b></div>
                        <div class="col-12" style="color: black;">{{ record.message }}</div>
                        <br>
                        <div class="col-12 time text-right">{{ record['created-date'] }} -
                            {{ record['created-time'] }}
                        </div>
                    </div>
                    <div v-if="record['user-id']===currentUser.id" style="float: right;"
                         class="card w-65r row bgc-primary-100 p-2 m-2 mr-3">
                        <div class="col time text-left"><b>You</b></div>
                        <div class="col-12" style="color: black;">{{ record.message }}</div>
                        <br>
                        <div class="col-12 time text-right">{{ record['created-date'] }} -
                            {{ record['created-time'] }}
                        </div>
                    </div>
                </div>
            </perfect-scrollbar>
            <div v-if="is_submitted==='Published' || is_submitted==='Saved'">
                <b-form :save-url="addUrl" ref="form1" @success="formSuccess" v-slot="{model}"
                        :save-params="{bid: id, bid_id: id}">
                    <div class="row mt-3">
                        <div class="col-11">
                            <textarea-input v-model="model.message" placeholder="Write a message..."
                                            :rules="{required:false}"/>
                        </div>
                        <div class="col-1">
                            <save-btn text="" class="bgc-primary-300 mt-2" color="" size="md"
                                      icon="fa fa-paper-plane"/>
                        </div>
                    </div>
                </b-form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'secure-axios';
import urls from '@/data/urls';
import { PerfectScrollbar } from 'vue2-perfect-scrollbar';
import { mapGetters } from 'vuex';

export default {
    name       : 'BidderChat',
    components : { PerfectScrollbar },
    data () {
        return {
            scrollHeight : window.innerHeight,
            id           : this.$route.params.id,
            tender_id    : this.$route.params.t_id,
            addUrl       : urls.Consumer.Tender.sendMessage,
            loading      : false,
            is_submitted : '',
            chat         : null
        };
    },
    mounted () {
        this.loadDetails();
    },
    updated () {
        this.updateScroll();
    },
    computed : {
        ...mapGetters(['currentUser'])
    },
    methods : {
        printChat () {
            const that = this;
            that.loading = true;
            axios.form(urls.Consumer.MyBid.printChat, { bid_id : that.id }).then(function (response) {
                const json = response.data;
                if (json.url) {
                    that.$notify('Pdf generated successfully', 'Success', {
                        type : 'success'
                    });
                    window.open(json.url);
                    that.loading = false;
                } else {
                    that.$notify('Pdf generation failed', 'Error', {
                        type : 'danger'
                    });
                    that.loading = false;
                }
                that.loading = false;
            });
            that.loading = false;
        },
        updateScroll () {
            const element = document.getElementById('scroll');
            element.scrollTop = element.scrollHeight;
        },
        formSuccess (response) {
            this.$refs.form1.setModelValue('message', '');
            this.chat = response.data.chat.data;
        },
        loadDetails () {
            const that = this;
            that.loading = true;
            axios.form(urls.Consumer.MyBid.chat, { bid_id : that.id }).then(function (response) {
                const json = response.data;
                that.chat = json.data;
                that.is_submitted = json.is_submitted;
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
