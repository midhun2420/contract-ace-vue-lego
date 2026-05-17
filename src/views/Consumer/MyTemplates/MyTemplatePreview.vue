<template>
    <div>
        <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px;">
            <loading-animation/>
            <span style=" vertical-align: super"> Loading details....</span>
        </div>
        <div v-if="!loading && permission" class="container card bs-5">

            <div class="row text-right mb-3">
                <div class="col text-left"><h4>{{ details.name }}</h4></div>
                <div class="col">
                    <btn type="button" color="warning" class="mr-2" size="sm" @click="printClicked" text="Print"/>
                    <btn v-if="currentUser.features.create_new_tender" type="button" color="success" size="sm"
                         @click="createTender(details)" text="Create Tender"/>
                    <btn type="button" color="primary" class="ml-2" size="sm"
                         @click="$router.push('/app/my-template/')" text="Back"/>
                </div>
            </div>

            <!--            Template Edit Form           -->

            <div v-if="details">
                <BidView class="" :json="initial_json" :variable-json="variablesJson"
                         :title="details.name + ' # ' + details.id"/>
            </div>
        </div>
        <div v-if="!permission" class="card text-center bg-primary">Page not found!</div>

        <!--            Form Modals           -->

        <modal title="Create Tender" ref="addModal" width="30r" header-color="primary" no-close-on-backdrop>
            <!-- Project Dropdown (ONLY for projectwise tender users) -->
<validated-select
    v-if="isProjectwiseTender"
    label="Project"
    v-model="selectedProjectId"
    :options="projectOptions"
    option-label="label"
    option-value="value"
    :rules="{ required: true }"
    :disabled="loadingProjects || createLoading"
    placeholder="Select a project..."
    @input="onProjectChange"
/>

            <!-- Show loading message while fetching projects -->
            <div v-if="isProjectwiseTender && loadingProjects" class="text-muted mb-3">
                <loading-animation/> Loading projects...
            </div>

            <!-- Show message if no projects found -->
            <div v-if="isProjectwiseTender && !loadingProjects && projects.length === 0" class="alert alert-warning mb-3">
                No projects found. Please create a project first.
            </div>

            <validated-input
                label="Tender Name"
                v-model="tenderModel.name"
                :rules="rules.name"
                :disabled="createLoading"
                ref="tenderNameInput"/>

            <validated-input
                label="Tender Number"
                v-model="tenderModel.tender_number"
                :rules="rules.tender_number"
                :disabled="createLoading"
                ref="tenderNumberInput"/>

            <btn
                text="Create"
                color="primary"
                size="sm"
                :disabled="createLoading || loadingProjects || (isProjectwiseTender && !selectedProjectId)"
                @click="handleCreateTender">
                <span v-if="createLoading"><loading-animation/><span style="vertical-align: super"> Creating...</span></span>
            </btn>
        </modal>
    </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';
import { mapGetters } from 'vuex';
import BidView from '@/component/Bidder/BidView';
// import OneBid from '@/data/Samples/OneBid';

export default {
    name       : 'MyTemplateDetailsPage',
    components : { BidView },
    data () {
        return {
            my_template       : '',
            permission        : true,
            loading           : false,
            loadingProjects   : false,
            createLoading     : false,
            id                : this.$route.params.id,
            addUrl            : urls.Consumer.Tender.create,
            initial_json      : null,
            json              : '',
            variablesJson     : '',
            details           : [],
            projects          : [],
            projectsKey       : 0,
            selectedProjectId : null,
            projectTenders    : [],
            tenderModel       : {
                name          : '',
                tender_number : ''
            },
            editingItem : {
                id : this.$route.params.id
            },
            rules : {
                name : {
                    required : true
                },
                tender_number : {
                    required : true
                }
            }
        };
    },
    computed : {
        ...mapGetters(['currentUser']),

        isProjectwiseTender () {
            return (
                this.currentUser &&
                this.currentUser.packages &&
                (
                    this.currentUser.packages.projectwise_tendertab === true ||
                    this.currentUser.packages.projectwise_tendertab === 'true'
                )
            );
        },

        projectOptions () {
            return this.projects.map(p => ({
                value : p.id,
                label : p.name
            }));
        }
    },
    beforeMount () {
        this.loadDetails();
    },
    methods : {
        printClicked () {
            const baseData = [{ tabName : 'First Tab', data : [] }];
            const currentJson = JSON.parse(JSON.stringify(this.details.json));
            if (JSON.stringify(baseData) !== JSON.stringify(currentJson)) {
                this.printScreen();
            } else {
                this.$notify('Not enough content to generate pdf.', 'Message', {
                    type : 'info'
                });
            }
        },
        printScreen () {
            const that = this;
            that.loading = true;

            axios.form(urls.Consumer.Tender.Print, { template_id : that.id })
                .then(function (response) {
                    const json = response.data;

                    if (json.url) {
                        that.$notify('Pdf generated successfully', 'Success', {
                            type : 'success'
                        });
                        window.open(json.url);
                    } else {
                        // ✅ Use backend message
                        that.$notify(
                            json.message || 'Pdf generation failed',
                            'Error',
                            { type : 'danger' }
                        );
                    }
                })
                .catch(function (error) {
                    console.error(error);

                    // optional: backend error message if available
                    const msg =
                error?.response?.data?.message ||
                'Something went wrong while generating PDF';

                    that.$notify(msg, 'Error', {
                        type : 'danger'
                    });
                })
                .finally(() => {
                    that.loading = false;
                });
        },
        async loadProjects () {
            if (!this.isProjectwiseTender) return;

            this.loadingProjects = true;
            this.projects = [];

            try {
                const response = await axios.get(urls.Consumer.Projects.SelectView);

                console.log('Projects API Response:', response.data);

                let projectsData = [];

                if (response.data) {
                    if (response.data.status === true && Array.isArray(response.data.data)) {
                        projectsData = response.data.data;
                    } else if (Array.isArray(response.data.data)) {
                        projectsData = response.data.data;
                    } else if (Array.isArray(response.data)) {
                        projectsData = response.data;
                    }
                }

                this.projects = projectsData.map(p => ({
                    id   : p.value,
                    name : p.label
                }));

                this.projectsKey++;

                console.log('Loaded projects:', this.projects);
                console.log('Project options:', this.projectOptions);

                if (this.projects.length === 0) {
                    this.$notify('No projects found. Please create a project first.', 'Warning', {
                        type : 'warning'
                    });
                }
            } catch (error) {
                console.error('Error loading projects:', error);
                this.$notify('Failed to load projects. Please try again.', 'Error', {
                    type : 'error'
                });
                this.projects = [];
            } finally {
                this.loadingProjects = false;
            }
        },
        async loadProjectTenders (projectId) {
            if (!projectId) return;

            try {
                const response = await axios.get(urls.Consumer.Tender.list, {
                    params : { project : projectId }
                });

                console.log('Project Tenders Response:', response.data);

                let tendersData = [];

                if (response.data) {
                    if (response.data.status === true && Array.isArray(response.data.data)) {
                        tendersData = response.data.data;
                    } else if (Array.isArray(response.data.data)) {
                        tendersData = response.data.data;
                    } else if (Array.isArray(response.data)) {
                        tendersData = response.data;
                    }
                }

                this.projectTenders = tendersData;

                console.log('Loaded tenders for project:', this.projectTenders);
            } catch (error) {
                console.error('Error loading project tenders:', error);
                this.projectTenders = [];
            }
        },
        onProjectChange (projectId) {
            this.selectedProjectId = projectId;

            const selected = this.projects.find(p => p.id === projectId);

            if (selected) {
                this.loadProjectTenders(projectId);
            } else {
                this.projectTenders = [];
            }
        },
        checkDuplicateTender (tenderName, tenderNumber) {
            if (!tenderName || !tenderNumber) {
                return null;
            }

            const nameLower = tenderName.trim().toLowerCase();
            const numberLower = tenderNumber.trim().toLowerCase();

            if (this.isProjectwiseTender && this.selectedProjectId) {
                const duplicateName = this.projectTenders.find(
                    tender => tender.name && tender.name.trim().toLowerCase() === nameLower
                );

                const duplicateNumber = this.projectTenders.find(
                    tender => tender.tender_number && tender.tender_number.trim().toLowerCase() === numberLower
                );

                if (duplicateName || duplicateNumber) {
                    let message = 'A tender with ';
                    if (duplicateName) {
                        message += `the name "${duplicateName.name}"`;
                    }
                    if (duplicateNumber) {
                        if (duplicateName) {
                            message += ' and ';
                        }
                        message += `the number "${duplicateNumber.tender_number}"`;
                    }
                    message += ' already exists in this project.';
                    return message;
                }
            }

            return null;
        },
        async handleCreateTender () {
            if (!this.tenderModel.name || !this.tenderModel.tender_number) {
                this.$notify('Please fill all required fields', 'Error', {
                    type : 'danger'
                });
                return;
            }

            if (this.isProjectwiseTender && !this.selectedProjectId) {
                this.$notify('Please select a project', 'Error', {
                    type : 'danger'
                });
                return;
            }

            const duplicateError = this.checkDuplicateTender(
                this.tenderModel.name,
                this.tenderModel.tender_number
            );

            if (duplicateError) {
                this.$notify(duplicateError, 'Warning', {
                    type : 'warning'
                });
                return;
            }

            this.createLoading = true;

            try {
                const params = {
                    name          : this.tenderModel.name,
                    tender_number : this.tenderModel.tender_number,
                    json          : this.json,
                    my_template   : this.my_template
                };

                if (this.isProjectwiseTender && this.selectedProjectId) {
                    params.project = this.selectedProjectId;
                    params.project_id = this.selectedProjectId;
                }

                console.log('Creating tender with params:', params);

                const response = await axios.form(this.addUrl, params);

                console.log('Tender creation response:', response.data);

                if (response.data.error === false) {
                    this.$notify('Tender Created Successfully', 'Success', {
                        type : 'success'
                    });

                    this.tenderModel.name = '';
                    this.tenderModel.tender_number = '';
                    this.selectedProjectId = null;
                    this.projectTenders = [];

                    this.$refs.addModal.close();
                } else {
                    this.$notify(response.data.msg || 'Failed to create tender', 'Error', {
                        type : 'danger'
                    });
                }
            } catch (error) {
                console.error('Error creating tender:', error);
                this.$notify('Failed to create tender. Please try again.', 'Error', {
                    type : 'danger'
                });
            } finally {
                this.createLoading = false;
            }
        },
        createTender (details) {
            this.selectedProjectId = null;
            this.projectTenders = [];
            this.tenderModel.name = '';
            this.tenderModel.tender_number = '';
            this.json = JSON.stringify(details.json);

            if (this.isProjectwiseTender) {
                this.loadProjects().then(() => {
                    this.$refs.addModal.show();
                });
            } else {
                this.$refs.addModal.show();
            }
        },
        onSave (json) {
            this.editingItem.json = json;
            const that = this;
            axios.form(urls.Consumer.MyTemplate.create, that.editingItem).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.$notify('My template saved', 'Success',
                        {
                            type : 'success'
                        }
                    );
                    that.formSuccess();
                }
            });
        },
        loadDetails () {
            const that = this;
            that.loading = true;
            axios.form(urls.Consumer.MyTemplate.details, { id : this.id }).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.details = json.template;
                    that.my_template = json.template.id;
                    that.variablesJson = JSON.stringify(json.template.json);
                    that.initial_json = JSON.stringify(json.template.json);
                    that.loading = false;
                } else if (json.permission === false) {
                    that.permission = json.permission;
                    that.loading = false;
                } else if (json.error === true) {
                    that.permission = json.permission;
                    that.loading = false;
                }
            });
        },
        formSuccess (response) {
            this.details = response.data.details;
        },
        formSuccess1 (response) {
            this.$refs.addModal.close();
        }
    }
}
;
</script>

<style scoped>
.text-small {
    font-weight: 500;
}

.form-control {
    border-radius: 5px;
}
</style>
