<template>
    <div>
        <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px;">
            <loading-animation/>
            <span style="vertical-align: super"> Loading details....</span>
        </div>
        <div v-if="!loading">
            <div class="full-height">
                <!-- Check if user is admin -->
                <div v-if="currentUser && currentUser.admin === true">
                    <!-- ADMIN DASHBOARD CONTENT -->
                    <div v-if="details.success" class="row counters-row">
                        <div class="col-md-2 counter-wrapper">
                            <div class="counter bgc-primary-400 card  bs-11">
                                <div class="fl-te-c h-100p">
                                    <div class="fl-y-l pr-1 h-100p">
                                        <span>Users</span>
                                        <b v-if="details.users!==''" class="text-3x lh-1 mt-auto">{{ details.users }}</b>
                                        <b v-else class="text-3x lh-1 mt-auto">0</b>
                                    </div>
                                    <img width="40" height="40" src="../../assets/images/users_image.png"/>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2 counter-wrapper">
                            <div class="counter bgc-primary-300 card fl-y-c bs-11">
                                <div class="fl-te-c h-100p">
                                    <div class="fl-y-l pr-1 h-100p">
                                        <span>Tenders Created</span>
                                        <b v-if="details.tenders!==''" class="text-3x lh-1 mt-auto">{{ details.tenders }}</b>
                                        <b v-else class="text-3x lh-1 mt-auto">0</b>
                                    </div>
                                    <img width="40" height="40" src="../../assets/images/tenders_image.png"/>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2 counter-wrapper">
                            <div class="counter bgc-primary-400 card fl-y-c bs-11">
                                <div class="fl-te-c h-100p">
                                    <div class="fl-y-l pr-1 h-100p">
                                        <span>Bid Requests</span>
                                        <b v-if="details.bids!==''" class="text-3x lh-1 mt-auto">{{ details.bids }}</b>
                                        <b v-else class="text-3x lh-1 mt-auto">0</b>
                                    </div>
                                    <img width="40" height="40" src="../../assets/images/bids_image.png"/>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2 counter-wrapper">
                            <div class="counter bgc-primary-300 card fl-y-c bs-11">
                                <div class="fl-te-c h-100p">
                                    <div class="fl-y-l pr-1 h-100p">
                                        <span>Bids Submitted</span>
                                        <b v-if="details['bids-submitted']!==''"
                                           class="text-3x lh-1 mt-auto">{{ details['bids-submitted'] }}</b>
                                        <b v-else class="text-3x lh-1 mt-auto">0</b>
                                    </div>
                                    <img width="40" height="40" src="../../assets/images/bids_submitted_image.png"/>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2 counter-wrapper">
                            <div class="counter bgc-primary-400 card fl-y-c bs-11">
                                <div class="fl-te-c h-100p">
                                    <div class="fl-y-l pr-1 h-100p">
                                        <span>Bids Received</span>
                                        <b v-if="details['bids-received']!==''"
                                           class="text-3x lh-1 mt-auto">{{ details['bids-received'] }}</b>
                                        <b v-else class="text-3x lh-1 mt-auto">0</b>
                                    </div>
                                    <img width="40" height="40" src="../../assets/images/bids_received_image.png"/>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2 counter-wrapper">
                            <div class="counter bgc-primary-300 card fl-y-c bs-11">
                                <div class="fl-te-c h-100p">
                                    <div class="fl-y-l pr-1 h-100p">
                                        <span>Bids Finalized</span>
                                        <b v-if="details['bids-finalized']!==''"
                                           class="text-3x lh-1 mt-auto">{{ details['bids-finalized'] }}</b>
                                        <b v-else class="text-3x lh-1 mt-auto">0</b>
                                    </div>
                                    <img width="40" height="40" src="../../assets/images/bids_finalized_image.png"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="details" class="row">
                        <div class="col card bs-5 m-3">
                            <h4 class="text-left">Notifications</h4>
                            <simple-table v-if="details.notifications && details.notifications.length!==0"
                                          hide-if-no-data
                                          :data="details.notifications"
                                          :fields="fields"
                                          ref="table"/>
                            <p v-else>No Notifications yet.</p>
                        </div>
                        <div class="col card bs-5 m-3">
                            <div class="row mb-3">
                                <div class="col text-left">
                                    <h4>Calendar{{ date }}</h4>
                                </div>
                            </div>
                            <FullCalendar ref="fullCalendar" :options="calendarOptions"/>
                        </div>
                    </div>
                </div>

                <!-- USER DASHBOARD CONTENT -->
                <div v-else>
                    <h3>User Dashboard</h3>
                    <p>User dashboard content here</p>
                </div>

                <p v-if="details && !details.success">Dashboard currently unavailable.</p>

                <modal no-close-on-backdrop title="Add Event" ref="addModal" width="45r" header-color="primary">
                    <b-form ref="form" :save-url="addEventUrl" @success="formSuccess" v-slot="{loading}"
                            :save-params="model">
                        <textarea-input label="Title" v-model="model.title" :rules="{required:true}"
                                        :disabled="loading"/>
                        <save-btn text="Save" icon="" color="primary" size="sm" :disabled="loading">
                            <span v-if="loading"><loading-animation/><span
                                style="vertical-align: super"> Saving...</span></span>
                        </save-btn>
                    </b-form>
                </modal>

                <modal no-close-on-backdrop title="Edit Event" ref="editModal" width="45r" header-color="primary">
                    <b-form ref="form" :save-url="addEventUrl" @success="formSuccess" v-slot="{loading}"
                            :save-params="model">
                        <textarea-input label="Title" v-model="model.title" :rules="{required:true}"
                                        :disabled="loading"/>
                        <div class="btn-group">
                            <save-btn text="Save" icon="" color="primary" size="sm" :disabled="loading">
                                <span v-if="loading"><loading-animation/><span
                                    style="vertical-align: super"> Saving...</span></span>
                            </save-btn>
                            <delete-btn @click="deleteEvent" type="button" text="Delete" icon="" size="sm"
                                        :disabled="loading"/>
                        </div>
                    </b-form>
                </modal>

                <delete-modal ref="deleteModal" :url="deleteUrl" :params="deletingItem" @response="formSuccess">
                    <p>You are about to delete the Event. Are you sure?</p>
                    <template #loading>
                        <loading-animation/>
                        Please wait while we delete <b v-html="deletingItem && deletingItem.title"></b>.
                    </template>
                </delete-modal>
            </div>
        </div>
    </div>
</template>

<script>
import '@fullcalendar/core/vdom';
import urls from '../../data/urls';
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import axios from 'secure-axios';
import { mapGetters } from 'vuex';

export default {
    name       : 'Dashboard',
    components : { FullCalendar },
    data () {
        const that = this;
        return {
            date            : null,
            details         : '',
            loading         : false,
            saving          : false,
            calendarOptions : {
                plugins     : [interactionPlugin, dayGridPlugin, listPlugin],
                initialView : 'dayGridMonth',
                selectable  : true,
                dateClick   : function (info) {
                    that.handleDateClick(info);
                },
                eventClick : function (info) {
                    that.handleEventClick(info);
                },
                editable      : true,
                headerToolbar : {
                    left   : 'prev,next today',
                    center : 'title',
                    right  : 'dayGridMonth,listMonth'
                },
                events : []
            },
            model : {
                id    : '',
                title : '',
                date  : ''
            },
            deletingItem : {
                id    : '',
                title : ''
            },
            detailsUrl  : urls.Admin.DashBoard.details,
            addEventUrl : urls.Admin.DashBoard.addEvent,
            deleteUrl   : urls.Admin.DashBoard.deleteEvent,
            fields      : [
                {
                    name      : 'message',
                    sortField : 'message',
                    title     : 'Message'
                },
                {
                    name      : 'created_on',
                    sortField : 'created_on',
                    title     : 'Date'
                },
                {
                    name       : '__slot:actions',
                    title      : '',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
                }
            ]
        };
    },
    mounted () {
        // Only load admin dashboard data if user is admin
        if (this.currentUser && this.currentUser.admin === true) {
            this.loadDetails();
        }
    },
    computed : {
        ...mapGetters(['currentUser'])
    },
    methods : {
        loadDetails () {
            const that = this;
            that.loading = true;
            axios.get(urls.Admin.DashBoard.details).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.details = json;
                    if (json.events && json.events.data) {
                        that.calendarOptions.events = json.events.data;
                    }
                    that.loading = false;
                }
            }).catch(function (error) {
                console.error('Dashboard load error:', error);
                that.loading = false;
            });
        },
        handleEventClick (item) {
            this.model = {};
            this.model.id = item.event.id;
            this.model.title = item.event.title;
            this.model.date = item.event.startStr;
            this.deletingItem.id = item.event.id;
            this.deletingItem.title = item.event.title;
            this.$refs.editModal.show();
        },
        handleDateClick (item) {
            this.model = {};
            this.model.date = item.dateStr;
            this.$refs.addModal.show();
        },
        deleteEvent () {
            this.$refs.editModal.close();
            this.$refs.deleteModal.show();
            this.model = {};
        },
        formSuccess (response) {
            this.model = {};
            if (response.data && response.data.events && response.data.events.data) {
                this.calendarOptions.events = response.data.events.data;
            }
            this.$refs.addModal.close();
            this.$refs.editModal.close();
            this.$refs.deleteModal.close();
        }
    }
};
</script>

<style scoped>
/* Card row layout */
.counters-row {
    margin: 0 -0.5rem;
}

.counter-wrapper {
    padding: 0 0.5rem;
    margin-bottom: 1rem;
}

.counter {
    height: 120px;
    margin: 0;
    width: 100% !important;
}

/* Color classes */
.bgc-primary-400 {
    background-color: #526985;
}

.bgc-primary-300 {
    background-color: #6b7fa0;
}

/* Height utility */
.h-100p {
    height: 100%;
}

/* Flex utilities */
.fl-te-c {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    /* justify-content: center; */
}

.fl-y-l {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.fl-y-c {
    display: flex;
    align-items: center;
}

/* Text styles */
.text-3x {
    font-size: 2.5rem;
}

.lh-1 {
    line-height: 1;
}

.mt-auto {
    margin-top: auto;
}

.pr-1 {
    padding-right: 0.5rem;
}

.count {
    font-size: 30px;
    font-weight: bolder;
    padding-top: .7rem;
}

.tenders_finalized {
    background-image: url('../../assets/images/tenders_issued.png');
}
.tenders_issued {
    background-image: url('../../assets/images/tenders_image.png');
}
.bids_image {
    background-image: url('../../assets/images/bids_image.png');
}
.users_image {
    background-image: url('../../assets/images/users_image.png');
}
.bids_submitted_image {
    background-image: url('../../assets/images/bids_submitted_image.png');
}
.bids_received_image {
    background-image: url('../../assets/images/bids_received_image.png');
}
.bids_finalized_image {
    background-image: url('../../assets/images/bids_finalized_image.png');
}
</style>
