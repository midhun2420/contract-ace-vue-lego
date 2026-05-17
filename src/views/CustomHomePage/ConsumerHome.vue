<template>
    <div>
        <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px;">
            <loading-animation/>
            <span style=" vertical-align: super"> Loading details....</span>
        </div>
        <div v-if="!loading && currentUser.features.dashboard">
            <div class="full-height">
                <div v-if="details.success" class="cards-container">
                    <div class="counter-wrapper">
                        <div class="counter bgc-primary-400 card fl-y-c bs-11">
                            <div class="card-content fl-te-c">
                                <div class="fl-y-l pr-1">
                                    <span class="card-label">Tenders Created</span>
                                    <b v-if="details.tenders!==''" class="text-3x lh-1 mt-auto">{{ details.tenders }}</b>
                                    <b v-else class="text-3x lh-1 mt-auto">0</b>
                                </div>
                                <img sizes="sm" width="40" height="40" src="../../assets/images/tenders_image.png"/>
                            </div>
                        </div>
                    </div>
                    <div class="counter-wrapper">
                        <div class="counter bgc-primary-300 card fl-y-c bs-11">
                            <div class="card-content fl-te-c">
                                <div class="fl-y-l pr-1">
                                    <span class="card-label">Tenders Issued</span>
                                    <b v-if="details['tender-issued']!==''" class="text-3x lh-1 mt-auto">{{
                                            details['tender-issued']
                                        }}</b>
                                    <b v-else class="text-3x lh-1 mt-auto">0</b>
                                </div>
                                <img sizes="sm" width="40" height="40" src="../../assets/images/tenders_issued.png"/>
                            </div>
                        </div>
                    </div>
                    <div class="counter-wrapper">
                        <div class="counter bgc-primary-400 card fl-y-c bs-11">
                            <div class="card-content fl-te-c">
                                <div class="fl-y-l pr-1">
                                    <span class="card-label">Tenders Finalized</span>
                                    <b v-if="details['tender-finalized']!==''"
                                       class="text-3x lh-1 mt-auto">{{ details['tender-finalized'] }}</b>
                                    <b v-else class="text-3x lh-1 mt-auto">0</b>
                                </div>
                                <img sizes="sm" width="40" height="40" src="../../assets/images/tenders_finalise.png"/>
                            </div>
                        </div>
                    </div>
                    <div class="counter-wrapper">
                        <div class="counter bgc-primary-300 card fl-y-c bs-11">
                            <div class="card-content fl-te-c">
                                <div class="fl-y-l pr-1">
                                    <span class="card-label">Bid Requests</span>
                                    <b v-if="details['bids']!==''" class="text-3x lh-1 mt-auto">{{ details['bids'] }}</b>
                                    <b v-else class="text-3x lh-1 mt-auto">0</b>
                                </div>
                                <img sizes="sm" width="40" height="40" src="../../assets/images/bids_image.png"/>
                            </div>
                        </div>
                    </div>
                    <div class="counter-wrapper">
                        <div class="counter bgc-primary-400 card fl-y-c bs-11">
                            <div class="card-content fl-te-c">
                                <div class="fl-y-l pr-1">
                                    <span class="card-label">Bids Submitted</span>
                                    <b v-if="details['bids-submitted']!==''"
                                       class="text-3x lh-1 mt-auto">{{ details['bids-submitted'] }}</b>
                                    <b v-else class="text-3x lh-1 mt-auto">0</b>
                                </div>
                                <img sizes="sm" width="40" height="40" src="../../assets/images/bids_submitted_image.png"/>
                            </div>
                        </div>
                    </div>
                    <div class="counter-wrapper">
                        <div class="counter bgc-primary-300 card fl-y-c bs-11">
                            <div class="card-content fl-te-c">
                                <div class="fl-y-l pr-1">
                                    <span class="card-label">Bids Finalized</span>
                                    <b v-if="details['bids-finalized']!==''"
                                       class="text-3x lh-1 mt-auto">{{ details['bids-finalized'] }}</b>
                                    <b v-else class="text-3x lh-1 mt-auto">0</b>
                                </div>
                                <img sizes="sm" width="40" height="40" src="../../assets/images/bids_finalized_image.png"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="details" class="row">
                    <!-- NOTIFICATIONS (ONLY SHOW WHEN FEATURED = FALSE) -->
                    <div v-if="!isFeaturedNotification" class="col card bs-5 m-3">
                        <h4 class="text-left">Notifications</h4>

                        <simple-table
                            v-if="details.notifications.length!==0"
                            hide-if-no-data
                            :data="details.notifications"
                            :fields="fields"
                            ref="table"
                        />

                        <p v-else>No Notifications yet.</p>
                    </div>

                    <!-- PROJECT DASHBOARD (ONLY SHOW WHEN FEATURED = TRUE) -->
                    <div v-if="isFeaturedNotification" class="col card bs-5 m-3">
                        <h4 class="text-left">Notifications</h4>

                        <div v-if="Object.keys(groupedProjectMessages).length">
                            <div
                                v-for="(items, projectName) in groupedProjectMessages"
                                :key="projectName"
                                class="mb-3 pt-4"
                            >
                                <h5 class="mb-1">{{ projectName }}</h5>
                                <simple-table
                                    :data="items"
                                    :fields="fields"
                                    hide-if-no-data
                                />
                            </div>
                        </div>

                        <p v-else>No project messages yet.</p>
                    </div>

                    <div class="col card bs-5 m-3">
                        <h4 class="text-left">Calendar</h4>
                        <FullCalendar ref="fullCalendar" :options="calendarOptions"/>
                    </div>
                </div>

                <p v-if="!details.success">Dashboard currently unavailable.</p>

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
                    <p>You are about to delete the Event. Are you
                        sure ?</p>

                    <template #loading>
                        <loading-animation/>
                        Please wait while we delete <b v-html="deletingItem && deletingItem.title"></b>.
                    </template>
                </delete-modal>
            </div>
        </div>
        <div v-if="!loading && !currentUser.packages.dashboard" class="card text-center bg-primary">
            Sorry, You don't have permission to view this page. Kindly contact your Owner.
        </div>
    </div>
</template>
<script>
import '@fullcalendar/core/vdom';
// import { Calendar } from '@fullcalendar/core';
import urls from '../../data/urls';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/vue';
import listPlugin from '@fullcalendar/list';
import axios from 'secure-axios';
import { mapGetters } from 'vuex';

export default {
    name       : 'ConsumerHome',
    components : { FullCalendar },
    data () {
        const that = this;
        return {
            date            : '',
            details         : '',
            loading         : false,
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
            deletingItem : {
                id    : '',
                title : ''
            },
            model : {
                id    : '',
                title : '',
                date  : ''
            },
            addEventUrl : urls.Admin.DashBoard.addEvent,
            deleteUrl   : urls.Admin.DashBoard.deleteEvent,
            detailsUrl  : urls.Consumer.DashBoard.details,
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
        this.loadDetails();
    },
    computed : {
        ...mapGetters(['currentUser']),

        isFeaturedNotification () {
            return this.currentUser?.packages?.featured_notifications === 'true';
        },

        groupedProjectMessages () {
            if (!this.details || !this.details.notifications) return {};

            // Filter only notifications with project_name
            const projectNotifications = this.details.notifications.filter(n => n.project_name);

            return projectNotifications.reduce((acc, n) => {
                const project = n.project_name;
                if (!acc[project]) acc[project] = [];
                acc[project].push(n);
                return acc;
            }, {});
        },

        // Get only non-project notifications (General notifications)
        generalNotifications () {
            if (!this.details || !this.details.notifications) return [];

            // Return only notifications without project_name
            return this.details.notifications.filter(n => !n.project_name);
        }
    },
    methods : {
        loadDetails () {
            const that = this;
            that.loading = true;
            axios.get(urls.Admin.DashBoard.details).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.details = json;
                    that.calendarOptions.events = json.events.data;
                    that.loading = false;
                }
            });
        },
        handleDateClick (item) {
            this.model = {};
            this.model.date = item.dateStr;
            this.$refs.addModal.show();
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
        deleteEvent () {
            this.$refs.editModal.close();
            this.$refs.deleteModal.show();
            this.model = {};
        },
        formSuccess (response) {
            this.model = {};
            this.calendarOptions.events = response.data.events.data;
            this.$refs.addModal.close();
            this.$refs.editModal.close();
            this.$refs.deleteModal.close();
        }
    }
};
</script>

<style scoped>
.count {
    font-size: 30px;
    font-weight: bolder;
    padding-top: .7rem;
}

.cards-container {
    margin: 0;
    display: flex;
    align-items: stretch;
}

.counter-wrapper {
    padding: 0 0.5rem;
    margin-bottom: 1rem;
    display: flex;
    flex: 1;
}

.counter {
    width: 100% !important;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 125px !important;
}

.card-content {
    padding: 1rem;
    height: 100%;
    box-sizing: border-box;
}

.card-label {
    font-size: 0.875rem;
}

@media (max-width: 1400px) {
    .cards-container {
        flex-wrap: wrap;
    }
}

@media (max-width: 768px) {
    .cards-container {
        flex-wrap: wrap;
    }
}

@media (max-width: 576px) {
    .cards-container {
        flex-wrap: wrap;
    }
}

/* Fix table alignment for project dashboard */
::v-deep .vuetable-th-message {
    width: 75% !important;
}

::v-deep .vuetable-th-created_on {
    width: 25% !important;
    text-align: right !important;
}

::v-deep .vuetable-td-created_on {
    text-align: right !important;
}
</style>
