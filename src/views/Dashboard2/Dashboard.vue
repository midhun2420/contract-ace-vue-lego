<template>
    <div>
        <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px;">
            <loading-animation />
            <span style="vertical-align: super"> Loading details....</span>
        </div>

        <div v-if="!loading && currentUser.features.dashboard">
            <div class="full-height">

                <!-- COUNTERS - NOW USING aggregatedCounts -->
                <div v-if="details.success" class="row counters-row">
                    <div class="col-md-2 counter-wrapper">
                        <div class="counter bgc-primary-400 card fl-y-c bs-11">
                            <div class="fl-te-c h-100p">
                                <div class="fl-y-l pr-1 h-100p">
                                    <span>Tenders Created</span>
                                    <b class="text-3x lh-1 mt-auto">{{ aggregatedCounts.tenders }}</b>
                                </div>
                                <img width="40" height="40" src="../../assets/images/tenders_image.png" />
                            </div>
                        </div>
                    </div>

                    <div class="col-md-2 counter-wrapper">
                        <div class="counter bgc-primary-300 card fl-y-c bs-11">
                            <div class="fl-te-c h-100p">
                                <div class="fl-y-l pr-1 h-100p">
                                    <span>Tenders Issued</span>
                                    <b class="text-3x lh-1 mt-auto">{{ aggregatedCounts['tender-issued'] }}</b>
                                </div>
                                <img width="40" height="40" src="../../assets/images/tenders_issued.png" />
                            </div>
                        </div>
                    </div>

                    <div class="col-md-2 counter-wrapper">
                        <div class="counter bgc-primary-400 card fl-y-c bs-11">
                            <div class="fl-te-c h-100p">
                                <div class="fl-y-l pr-1 h-100p">
                                    <span>Tenders Finalized</span>
                                    <b class="text-3x lh-1 mt-auto">{{ aggregatedCounts['tender-finalized'] }}</b>
                                </div>
                                <img width="40" height="40" src="../../assets/images/tenders_finalise.png" />
                            </div>
                        </div>
                    </div>

                    <div class="col-md-2 counter-wrapper">
                        <div class="counter bgc-primary-400 card fl-y-c bs-11">
                            <div class="fl-te-c h-100p">
                                <div class="fl-y-l pr-1 h-100p">
                                    <span>Bid Requests</span>
                                    <b class="text-3x lh-1 mt-auto">{{ aggregatedCounts.bids }}</b>
                                </div>
                                <img width="40" height="40" src="../../assets/images/bids_image.png" />
                            </div>
                        </div>
                    </div>

                    <div class="col-md-2 counter-wrapper">
                        <div class="counter bgc-primary-400 card fl-y-c bs-11">
                            <div class="fl-te-c h-100p">
                                <div class="fl-y-l pr-1 h-100p">
                                    <span>Bids Submitted</span>
                                    <b class="text-3x lh-1 mt-auto">{{ aggregatedCounts['bids-submitted'] }}</b>
                                </div>
                                <img width="40" height="40" src="../../assets/images/bids_submitted_image.png" />
                            </div>
                        </div>
                    </div>

                    <div class="col-md-2 counter-wrapper">
                        <div class="counter bgc-primary-300 card fl-y-c bs-11">
                            <div class="fl-te-c h-100p">
                                <div class="fl-y-l pr-1 h-100p">
                                    <span>Bids Finalized</span>
                                    <b class="text-3x lh-1 mt-auto">{{ aggregatedCounts['bids-finalized'] }}</b>
                                </div>
                                <img width="40" height="40" src="../../assets/images/bids_finalized_image.png" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- PROJECT SELECT -->
                <div class="row my-3">
                    <div class="col-md-4 ml-2">
                        <label class="mb-1"><b>Projects</b></label>
                        <select
                            class="form-control"
                            style="background-color: white !important;"
                            v-model="selectedProject"
                            @change="openProjectModal"
                        >
                            <option value="">All Projects</option>
                            <option v-for="p in projects" :key="p.id" :value="p.id">
                                {{ p.name }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- ✅ FIXED ALIGNMENT: Notifications and Calendar in equal columns -->
                <div v-if="details" class="row content-row">
                    <!-- NOTIFICATIONS (ONLY SHOW WHEN FEATURED = FALSE) -->
                    <div v-if="!isFeaturedNotification" class="col-md-6 content-col">
                        <div class="card bs-5 content-card">
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
                    </div>

                    <!-- PROJECT DASHBOARD (ONLY SHOW WHEN FEATURED = TRUE) -->
                    <div v-if="isFeaturedNotification" class="col-md-6 content-col">
                        <div class="card bs-5 content-card">
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
                    </div>

                    <!-- CALENDAR -->
                    <div class="col-md-6 content-col">
                        <div class="card bs-5 content-card">
                            <h4 class="text-left">Calendar</h4>
                            <FullCalendar ref="fullCalendar" :options="calendarOptions"/>
                        </div>
                    </div>
                </div>

                <p v-if="!details.success">Dashboard currently unavailable.</p>
            </div>
        </div>

        <div v-if="!loading && !currentUser.features.dashboard" class="card text-center bg-primary">
            Sorry, You don't have permission to view this page.
        </div>

        <!-- PROJECT DETAILS MODAL -->
        <modal
            no-close-on-backdrop
            :title="selectedProjectData.name"
            ref="projectModal"
            width="60r"
            header-color="primary"
            @closed="onModalClose"
        >
            <div v-if="selectedProjectData.id">
                <div class="section-title">Tenders</div>
                <div class="row mb-4">
                    <div class="col-md-4">
                        <div class="modal-counter bgc-primary-400" @click="redirectToTenderList('created')">
                            <div class="modal-counter-label">Tenders Created</div>
                            <div class="modal-counter-value">{{ selectedProjectData.tenders_created || 0 }}</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="modal-counter bgc-primary-300" @click="redirectToTenderList('issued')">
                            <div class="modal-counter-label">Tenders Issued</div>
                            <div class="modal-counter-value">{{ selectedProjectData.tenders_issued || 0 }}</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="modal-counter bgc-primary-400" @click="redirectToTenderList('finalized')">
                            <div class="modal-counter-label">Tenders Finalized</div>
                            <div class="modal-counter-value">{{ selectedProjectData.tenders_finalized || 0 }}</div>
                        </div>
                    </div>
                </div>

                <div class="section-title">Bids</div>
                <div class="row">
                    <div class="col-md-4">
                        <div class="modal-counter bgc-primary-400"  @click="redirectToTenderList('created')">
                            <div class="modal-counter-label">Bid Requests</div>
                            <div class="modal-counter-value">{{ selectedProjectData.bids_requests || 0 }}</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="modal-counter bgc-primary-400"  @click="redirectToTenderList('created')">
                            <div class="modal-counter-label">Bids Submitted</div>
                            <div class="modal-counter-value">{{ selectedProjectData.bids_submitted || 0 }}</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="modal-counter bgc-primary-300" @click="redirectToTenderList('created')">
                            <div class="modal-counter-label">Bids Finalized</div>
                            <div class="modal-counter-value">{{ selectedProjectData.bids_finalized || 0 }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
import '@fullcalendar/core/vdom';
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import axios from 'secure-axios';
import urls from '../../data/urls';
import { mapGetters } from 'vuex';

export default {
    name       : 'ConsumerHome',
    components : { FullCalendar },

    data () {
        return {
            loading : false,
            details : {
                success       : false,
                notifications : []
            },

            // ✅ Aggregated counts calculated from projects
            aggregatedCounts : {
                tenders            : 0,
                'tender-issued'    : 0,
                'tender-finalized' : 0,
                bids               : 0,
                'bids-submitted'   : 0,
                'bids-finalized'   : 0
            },

            projects            : [],
            selectedProject     : '',
            selectedProjectData : {
                id                : '',
                name              : '',
                tenders_created   : 0,
                tenders_issued    : 0,
                tenders_finalized : 0,
                bids_requests     : 0,
                bids_submitted    : 0,
                bids_finalized    : 0
            },

            calendarOptions : {
                plugins       : [interactionPlugin, dayGridPlugin, listPlugin],
                initialView   : 'dayGridMonth',
                headerToolbar : {
                    left   : 'prev,next today',
                    center : 'title',
                    right  : 'dayGridMonth,listMonth'
                },
                events : []
            },

            fields : [
                { name : 'message', title : 'Message' },
                { name : 'created_on', title : 'Date' }
            ]
        };
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

    mounted () {
        this.loadDetails();
        this.fetchProjects();
    },

    watch : {
        '$route' () {
            this.loadDetails();
            this.fetchProjects();
        }
    },

    methods : {
        // ✅ Load notifications and calendar only
        // ✅ Load dashboard details and use the counts from API
        redirectToTenderList (type) {
            const projectId = this.selectedProjectData.id;
            const projectName = this.selectedProjectData.name;

            this.$router.push({
                path  : `/app/project/${projectId}/details/`,
                query : {
                    name   : projectName,
                    status : type // optional filter
                }
            });
        },
        loadDetails () {
            this.loading = true;
            axios.get(urls.Admin.DashBoard.details)
                .then(res => {
                    if (res.data && res.data.error === false) {
                        this.details = {
                            success       : res.data.success || true,
                            notifications : res.data.notifications || []
                        };

                        // ✅ Use counts directly from API response
                        this.aggregatedCounts = {
                            tenders            : res.data['tender-created'] || res.data.tenders || 0,
                            'tender-issued'    : res.data['tender-issued'] || 0,
                            'tender-finalized' : res.data['tender-finalized'] || 0,
                            bids               : res.data.bids || res.data['bids-received'] || 0,
                            'bids-submitted'   : res.data['bids-submitted'] || 0,
                            'bids-finalized'   : res.data['bids-finalized'] || 0
                        };

                        this.calendarOptions.events = res.data.events?.data || [];
                    }
                })
                .catch(err => {
                    console.error('Error loading dashboard details:', err);
                    this.details = {
                        success       : false,
                        notifications : []
                    };
                    this.resetAggregates();
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // ✅ Fetch projects and calculate aggregates
        async fetchProjects () {
            try {
                const res = await axios.get(urls.Consumer.Projects.list);

                this.projects = (res.data.data || []).map(p => ({
                    id                : p.id,
                    name              : p.name,
                    tenders_created   : Number(p.tenders_created) || 0,
                    tenders_issued    : Number(p.tenders_issued) || 0,
                    tenders_finalized : Number(p.tenders_finalized) || 0,
                    bids_requests     : Number(p.bids_requests) || 0,
                    bids_submitted    : Number(p.bids_submitted) || 0,
                    bids_finalized    : Number(p.bids_finalized) || 0
                }));

                // ✅ Calculate totals from projects
                this.calculateAggregates();
            } catch (err) {
                console.error('Error loading projects:', err);
                this.projects = [];
                this.resetAggregates();
            }
        },

        // ✅ Calculate aggregate counts from all projects
        calculateAggregates () {
            this.aggregatedCounts = this.projects.reduce((acc, project) => {
                acc.tenders += project.tenders_created;
                acc['tender-issued'] += project.tenders_issued;
                acc['tender-finalized'] += project.tenders_finalized;
                acc.bids += project.bids_requests;
                acc['bids-submitted'] += project.bids_submitted;
                acc['bids-finalized'] += project.bids_finalized;
                return acc;
            }, {
                tenders            : 0,
                'tender-issued'    : 0,
                'tender-finalized' : 0,
                bids               : 0,
                'bids-submitted'   : 0,
                'bids-finalized'   : 0
            });
        },

        // ✅ Reset aggregates to zero
        resetAggregates () {
            this.aggregatedCounts = {
                tenders            : 0,
                'tender-issued'    : 0,
                'tender-finalized' : 0,
                bids               : 0,
                'bids-submitted'   : 0,
                'bids-finalized'   : 0
            };
        },

        // ✅ Open modal with correct project data
        openProjectModal () {
            if (!this.selectedProject) return;

            const project = this.projects.find(p => p.id === this.selectedProject);
            if (!project) return;

            // ✅ Properly map all properties including bids_requests
            this.selectedProjectData = {
                id                : project.id,
                name              : project.name,
                tenders_created   : project.tenders_created,
                tenders_issued    : project.tenders_issued,
                tenders_finalized : project.tenders_finalized,
                bids_requests     : project.bids_requests,
                bids_submitted    : project.bids_submitted,
                bids_finalized    : project.bids_finalized
            };

            this.$refs.projectModal.show();
        },
        onModalClose () {
            this.selectedProject = '';
        }
    }
};
</script>

<style scoped>
.counters-row {
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

.form-control {
    background-color: white !important;
    width: 48.5rem;
    border-radius: 9px;
}

/* ✅ FIXED: Proper alignment for content row */
.content-row {
    margin: 0;
    display: flex;
    align-items: stretch;
}

.content-col {
    padding: 0 0.75rem;
    margin-bottom: 1.5rem;
    display: flex;
}

.content-card {
    width: 100%;
    margin: 0 !important;
    display: flex;
    flex-direction: column;
}

.section-title {
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #e5e7eb;
}

.modal-counter {
    padding: 24px 20px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    transition: all 0.3s ease;
}

.modal-counter:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.modal-counter-label {
    font-size: 13px;
    font-weight: 600;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
}

.modal-counter-value {
    font-size: 36px;
    font-weight: 700;
    color: #ffffff;
    line-height: 1;
}

.bgc-primary-400 {
    background-color: #526985;
}

.bgc-primary-300 {
    background-color: #6b7fa0;
}
</style>
