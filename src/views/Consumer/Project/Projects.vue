<template>
    <div>
        <check-permission/>
        <div class="page-header mb-4 fl-x fl-j-sb">
            <h2 class="mb-0">Projects</h2>
            <div class="fl-x" style="gap: 10px;">
                <btn
                    size="xs"
                    class="lv"
                    text="Card View"
                    icon="fa fa-th-large"
                    :color="viewType === 'card' ? 'primary' : 'secondary'"
                    @click="viewType = 'card'"
                />
                <btn
                    size="xs"
                    text="List View"
                    class="lv"
                    icon="fa fa-list"
                    :color="viewType === 'list' ? 'primary' : 'secondary'"
                    @click="viewType = 'list'"
                />
                <div class="search-box">
                    <input
                        type="text"
                        v-model="searchQuery"
                        @input="filterProjects"
                        placeholder="Search projects..."
                        class="form-control search-input"
                    />
                    <i class="fa fa-search search-icon"></i>
                </div>
                <btn color="primary" icon="fa fa-plus" size="sm" @click="openAddModal()" text="Add Project"/>
            </div>
        </div>

        <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px;">
            <loading-animation/>
            <span style="vertical-align: super"> Loading projects...</span>
        </div>

        <!-- CARD VIEW -->
        <div v-if="!loading && viewType === 'card'" class="row">
            <div v-if="filteredProjects.length === 0" class="col-12">
                <div class="card text-center p-5">
                    <p class="mb-0">{{ searchQuery ? 'No projects found matching your search' : 'No projects found' }}</p>
                </div>
            </div>

            <div v-for="project in filteredProjects" :key="project.id" class="col-md-6 col-lg-4 col-xl-3 mb-4">
                <div class="project-card" @click="viewProject(project)">
                    <div class="project-header">
                        <h5 class="project-title">{{ project.name }}</h5>
                        <div class="card-actions">
                            <button class="action-btn notification-btn" @click.stop="openNotificationModal(project)" title="">
                                <i class="fa fa-bell"></i>
                            </button>
                            <button class="action-btn view-btn" @click.stop="viewProject(project)" title="View">
                                <i class="fa fa-eye"></i>
                            </button>
                            <button v-if="project.name !== 'Unclassified Project'" class="action-btn edit-btn" @click.stop="editProject(project)" title="Edit">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button v-if="canArchiveTenders"  class="action-btn archive-btn" @click.stop="archiveTenders(project)" title="Archive">
                                <i class="fa fa-archive"></i>
                            </button>
                            <button v-if="project.name !== 'Unclassified Project'" class="action-btn delete-btn" @click.stop="deleteProject(project)" title="Delete">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </div>

                    <div class="card-body">
                        <div class="stats-row">
                            <div class="stat-box">
                                <div class="stat-box-label">Tenders Created</div>
                                <div class="stat-box-value">{{ project.tenders_created || 0 }}</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-box-label">Tenders Issued</div>
                                <div class="stat-box-value">{{ project.tenders_issued || 0 }}</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-box-label">Tenders Finalized</div>
                                <div class="stat-box-value">{{ project.tenders_finalized || 0 }}</div>
                            </div>
                        </div>

                        <div class="stats-row">
                            <div class="stat-box">
                                <div class="stat-box-label">Bid Requests</div>
                                <div class="stat-box-value">{{ project.bids_requests || 0 }}</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-box-label">Bids Submitted</div>
                                <div class="stat-box-value">{{ project.bids_submitted || 0 }}</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-box-label">Bids Finalized</div>
                                <div class="stat-box-value">{{ project.bids_finalized || 0 }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- TABLE LIST VIEW -->
        <div v-if="!loading && viewType === 'list'">
            <div v-if="filteredProjects.length === 0" class="card text-center p-5">
                <p class="mb-0">{{ searchQuery ? 'No projects found matching your search' : 'No projects found' }}</p>
            </div>

            <div v-else class="card bs-5">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Project Name</th>
                                    <th class="text-center">Tenders Created</th>
                                    <th class="text-center">Tenders Issued</th>
                                    <th class="text-center">Tenders Finalized</th>
                                    <th class="text-center">Bid Requests</th>
                                    <th class="text-center">Bids Submitted</th>
                                    <th class="text-center">Bids Finalized</th>
                                    <th class="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="project in filteredProjects" :key="project.id">
                                    <td>{{ project.name }}</td>
                                    <td class="text-center">{{ project.tenders_created || 0 }}</td>
                                    <td class="text-center">{{ project.tenders_issued || 0 }}</td>
                                    <td class="text-center">{{ project.tenders_finalized || 0 }}</td>
                                    <td class="text-center">{{ project.bids_requests || 0 }}</td>
                                    <td class="text-center">{{ project.bids_submitted || 0 }}</td>
                                    <td class="text-center">{{ project.bids_finalized || 0 }}</td>
<td class="text-right">
    <div class="btn-group-tight">
        <btn icon="fa fa-bell" color="success"
             @click="openNotificationModal(project)"
             size="xs"/>

        <btn icon="fa fa-eye" color="primary"
             @click="viewProject(project)"
             size="xs"/>

        <btn v-if="canArchiveTenders" icon="fa fa-archive" color="secondary"
             @click="archiveTenders(project)"
             size="xs"/>

        <btn v-if="project.name !== 'Unclassified Project'"
             icon="fa fa-edit" color="info"
             @click="editProject(project)"
             size="xs"/>

        <btn v-if="project.name !== 'Unclassified Project'"
             icon="fa fa-trash" color="danger"
             @click="deleteProject(project)"
             size="xs"/>
    </div>
</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <modal no-close-on-backdrop title="Add Project" ref="addModal" width="30r" header-color="primary" @close="resetAddForm" @hidden="resetAddForm">
            <div class="form-group">
                <label>Project Name</label>
                <input type="text" v-model="newProject.name" class="form-control" @keyup.enter="addProject" ref="addProjectInput"/>
            </div>
            <btn @click="addProject" color="primary" size="sm" :disabled="submitting">
                <span v-if="!submitting">Add Project</span>
                <span v-else><loading-animation/><span style="vertical-align: super"> Adding...</span></span>
            </btn>
        </modal>

        <modal no-close-on-backdrop title="Edit Project" ref="editModal" width="45r" header-color="primary">
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label>Project Name</label>
                        <input type="text" v-model="editingItem.name" class="form-control" @keyup.enter="updateProject"/>
                    </div>
                </div>
            </div>
            <btn @click="updateProject" class="btn btn-primary btn-sm" :disabled="submitting">
                <span v-if="!submitting">Update</span>
                <span v-else><loading-animation/><span style="vertical-align: super"> Updating...</span></span>
            </btn>
        </modal>

        <modal no-close-on-backdrop :title="'' + (selectedProject ? selectedProject.name : '')"
               ref="notificationModal" width="60r" header-color="primary">
            <div v-if="loadingNotifications" class="text-center p-4">
                <loading-animation/>
                <span style="vertical-align: super"> Loading notifications...</span>
            </div>

            <div v-else-if="projectNotifications.length === 0" class="text-center p-4">
                <p class="text-muted mb-0">No notifications found for this project</p>
            </div>

            <div v-else class="notifications-container">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th style="width: 70%;">Message</th>
                                <th style="width: 30%;">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="notification in projectNotifications" :key="notification.id">
                                <td>{{ notification.message }}</td>
                                <td>{{ notification.created_on }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </modal>

        <delete-modal ref="deleteModal" title="Delete Project" :params="deletingItem" :url="''"
                      @okClicked="confirmDelete" no-close-on-backdrop headerColor="danger"
                      okButton="Delete" cancelButton="Cancel">
            <p>You are about to delete the Project <b v-html="deletingItem && deletingItem.name"></b>. Are you sure?</p>
            <template #loading>
                <loading-animation/>
                Please wait while we delete <b v-html="deletingItem && deletingItem.name"></b>.
            </template>
        </delete-modal>
    </div>
</template>

<script>
import axios from 'secure-axios';
import urls from '@/data/urls';

export default {
    name : 'Projects',

    data () {
        return {
            viewType         : 'card',
            projects         : [],
            filteredProjects : [],
            searchQuery      : '',
            loading          : false,
            submitting       : false,

            newProject : { name : '' },

            editingItem : {
                id                : '',
                name              : '',
                tenders_created   : 0,
                tenders_issued    : 0,
                tenders_finalized : 0,
                bid_requests      : 0,
                bids_submitted    : 0,
                bids_finalized    : 0
            },

            deletingItem         : null,
            isDeleting           : false,
            selectedProject      : null,
            projectNotifications : [],
            loadingNotifications : false,
            allNotifications     : []
        };
    },

    mounted () {
        this.fetchProjects();
        this.fetchAllNotifications();
    },

    methods : {
        resetAddForm () {
            this.newProject.name = '';
            if (this.$refs.addProjectInput) {
                this.$refs.addProjectInput.value = '';
            }
        },

        openAddModal () {
            this.newProject.name = '';
            this.$refs.addModal.show();
        },

        fetchAllNotifications () {
            axios
                .get(urls.Consumer.Message.list + '?per_page=1000')
                .then(res => {
                    this.allNotifications = res.data.data || [];
                    console.log('All notifications:', this.allNotifications);
                })
                .catch(err => {
                    console.error('Error loading notifications:', err);
                });
        },

        filterProjects () {
            if (!this.searchQuery.trim()) {
                this.filteredProjects = [...this.projects];
                return;
            }

            const query = this.searchQuery.toLowerCase().trim();
            this.filteredProjects = this.projects.filter(project => {
                return project.name.toLowerCase().includes(query) ||
                       (project.id && project.id.toString().includes(query));
            });
        },

        openNotificationModal (project) {
            this.selectedProject = project;
            this.loadingNotifications = true;
            this.projectNotifications = [];
            this.$refs.notificationModal.show();

            // ✅ Filter from already loaded notifications
            this.projectNotifications = this.allNotifications.filter(n =>
                Number(n.project_id) === Number(project.id)
            );

            this.loadingNotifications = false;
        },
        fetchProjects () {
            this.loading = true;

            axios
                .get(urls.Consumer.Projects.list)
                .then(res => {
                    const response = res.data;

                    if (response && response.data && Array.isArray(response.data)) {
                        this.projects = response.data.map(p => ({
                            id                : p.id,
                            name              : p.name || 'Untitled Project',
                            tenders_created   : Number(p.tenders_created) || 0,
                            tenders_issued    : Number(p.tenders_issued) || 0,
                            tenders_finalized : Number(p.tenders_finalized) || 0,
                            bids_requests     : Number(p.bids_requests) || 0,
                            bids_submitted    : Number(p.bids_submitted) || 0,
                            bids_finalized    : Number(p.bids_finalized) || 0
                        }));
                        this.filteredProjects = [...this.projects];
                    } else {
                        this.projects = [];
                        this.filteredProjects = [];
                    }
                })
                .catch(err => {
                    console.error('Error loading projects:', err);
                    this.$notify('Failed to load projects', 'Error', { type : 'error' });
                    this.projects = [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        addProject () {
            if (!this.newProject.name.trim()) {
                this.$notify('Project name required', 'Warning', { type : 'warning' });
                return;
            }

            this.submitting = true;

            const formData = new FormData();
            formData.append('name', this.newProject.name);

            axios
                .post(urls.Consumer.Projects.addedit, formData)
                .then(res => {
                    if (res.data && (res.data.error === false || res.data.success === true)) {
                        this.$notify('Project added successfully', 'Success', { type : 'success' });
                        this.$refs.addModal.close();
                        this.newProject.name = '';
                        this.fetchProjects();
                    } else {
                        let errorMessage = 'Failed to add project';

                        if (res.data.errors && typeof res.data.errors === 'object') {
                            const firstError = Object.values(res.data.errors)[0];
                            errorMessage = firstError || errorMessage;
                        } else if (res.data.message) {
                            errorMessage = res.data.message;
                        }

                        this.$notify(errorMessage, 'Warning', { type : 'warning' });
                    }
                })
                .catch(err => {
                    console.error('Error adding project:', err);
                    this.$notify('Failed to add project', 'Error', { type : 'error' });
                })
                .finally(() => {
                    this.submitting = false;
                });
        },

        editProject (project) {
            this.editingItem = { ...project };
            this.$refs.editModal.show();
        },

        updateProject () {
            if (!this.editingItem.name.trim()) {
                this.$notify('Project name required', 'Warning', { type : 'warning' });
                return;
            }

            this.submitting = true;

            const formData = new FormData();
            Object.keys(this.editingItem).forEach(key => {
                formData.append(key, this.editingItem[key]);
            });

            axios
                .post(urls.Consumer.Projects.addedit, formData)
                .then(res => {
                    if (res.data && (res.data.error === false || res.data.success === true)) {
                        this.$notify('Project updated successfully', 'Success', { type : 'success' });
                        this.$refs.editModal.close();
                        this.fetchProjects();
                    } else {
                        let errorMessage = 'Failed to update project';

                        if (res.data.errors && typeof res.data.errors === 'object') {
                            const firstError = Object.values(res.data.errors)[0];
                            errorMessage = firstError || errorMessage;
                        } else if (res.data.message) {
                            errorMessage = res.data.message;
                        }

                        this.$notify(errorMessage, 'Warning', { type : 'warning' });
                    }
                })
                .catch(err => {
                    console.error('Error updating project:', err);
                    this.$notify('Failed to update project', 'Error', { type : 'error' });
                })
                .finally(() => {
                    this.submitting = false;
                });
        },

        deleteProject (project) {
            this.deletingItem = project;
            this.$refs.deleteModal.show();
        },

        confirmDelete () {
            if (this.isDeleting) {
                return Promise.reject(new Error('Already deleting'));
            }

            this.isDeleting = true;
            const formData = new FormData();
            formData.append('id', this.deletingItem.id);

            return axios
                .post(urls.Consumer.Projects.delete, formData)
                .then(res => {
                    if (res.data && (res.data.error === false || res.data.success === true)) {
                        this.$refs.deleteModal.close();
                        this.deletingItem = null;
                        this.isDeleting = false;
                        this.$notify('Project deleted successfully', 'Success', { type : 'success' });
                        this.fetchProjects();
                        return res;
                    } else {
                        let errorMessage = 'Failed to delete project';

                        if (res.data.errors && typeof res.data.errors === 'object') {
                            const firstError = Object.values(res.data.errors)[0];
                            errorMessage = firstError || errorMessage;
                        } else if (res.data.message) {
                            errorMessage = res.data.message;
                        }

                        this.$notify(errorMessage, 'Warning', { type : 'warning' });
                        this.$refs.deleteModal.close();
                        this.deletingItem = null;
                        this.isDeleting = false;
                        throw new Error(errorMessage);
                    }
                })
                .catch(err => {
                    if (err.message === 'Already deleting') {
                        throw err;
                    }

                    this.$refs.deleteModal.close();
                    this.deletingItem = null;
                    this.isDeleting = false;
                    console.error('Error deleting project:', err);

                    if (!err.message || err.message === 'Failed to delete project') {
                        const errorMessage = err.response?.data?.message || 'Failed to delete project';
                        this.$notify(errorMessage, 'Warning', { type : 'warning' });
                    }

                    throw err;
                });
        },

        viewProject (project) {
            this.$router.push({
                path  : '/app/project/' + project.id + '/details/',
                query : {
                    name : project.name
                }
            });
        },
        archiveTenders (project) {
            this.$router.push({
                path  : '/app/archived/tender/',
                query : {
                    project_id   : project.id,
                    project_name : project.name
                }
            });
        }
    },
    computed : {
        canArchiveTenders () {
            return this.$store.getters.currentUser?.packages?.archived_tenders === 'true';
        }
    },
    watch : {
        viewType () {
        // Clear search when switching views
            this.searchQuery = '';
            this.filteredProjects = [...this.projects];
            // Refresh table if switching to list view
            if (this.viewType === 'list') {
                this.$nextTick(() => {
                    if (this.$refs.table) {
                        this.$refs.table.refreshTable();
                    }
                });
            }
        }
    }
};
</script>

<style scoped>
.project-card {
    background: #ffffff;
    border: 2px solid #e0e4e9;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
}

.project-card:hover {
    border-color: #526985;
    box-shadow: 0 4px 12px rgba(82, 105, 133, 0.15);
    transform: translateY(-2px);
}

.project-header {
    padding: 8px 24px;
    background: #f8f9fa;
    border-bottom: 1px solid #e0e4e9;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.project-title {
    font-size: 17px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;              /* ← full width */
}

.card-actions {
    display: flex;
    gap: 6px;
    align-items: center;
}

.action-btn {
    width: 20px;
    height: 20px;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #6b7280;
    font-size: 13px;
    position: relative;
}

.action-btn:hover {
    background: #f3f4f6;
}

.notification-btn:hover {
    background: #fef3c7;
    border-color: #fbbf24;
    color: #d97706;
}

.view-btn:hover {
    background: #e0e7ff;
    border-color: #a5b4fc;
    color: #4f46e5;
}

.edit-btn:hover {
    background: #dbeafe;
    border-color: #93c5fd;
    color: #1e40af;
}

.delete-btn:hover {
    background: #fee2e2;
    border-color: #fca5a5;
    color: #dc2626;
}

.card-body {
    padding: 20px;
}

.stats-row {
    display: flex;
    gap: 12px;
    margin-bottom: 14px;
}

.stats-row:last-child {
    margin-bottom: 0;
}

.stat-box {
    flex: 1;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 14px 12px;
    text-align: center;
    transition: all 0.2s ease;
}

.stat-box:hover {
    background: #eff6ff;
    border-color: #93c5fd;
}

.stat-box-label {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    margin-bottom: 6px;
    line-height: 1.2;
}

.stat-box-value {
    font-size: 26px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1;
}

.notifications-container {
    max-height: 500px;
    overflow-y: auto;
}

.notifications-container .table {
    margin-bottom: 0;
}

.notifications-container .table td {
    vertical-align: middle;
    padding: 12px;
}

.search-box {
    position: relative;
    width: 280px;
}

.search-input {
    padding-right: 35px;
    height: 38px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
}

.search-input:focus {
    border-color: #526985;
    outline: none;
    box-shadow: 0 0 0 3px rgba(82, 105, 133, 0.1);
}

.search-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
    pointer-events: none;
}

.btn-group-tight {
    display: flex;
    gap: 4px;
}

@media (max-width: 768px) {
    .stat-box-value {
        font-size: 22px;
    }

    .stat-box-label {
        font-size: 10px;
    }

    .search-box {
        width: 200px;
    }

    .page-header .fl-x {
        flex-direction: column;
        align-items: stretch !important;
        gap: 10px !important;
    }

    .search-box {
        width: 100%;
    }
}
:deep(.lv){
    font-family: Montserrat, sans-serif !important;
    font-size: 13px !important;
    padding: 9px 14px !important;
}
.stat-box {
  flex: 1 1 auto !important;        /* Allow grow AND shrink */
  min-width: 80px !important;       /* Prevent over-squishing */
  max-width: 100% !important;
  box-sizing: border-box !important; /* Include padding/border in width calc */
}
</style>
