<template>
    <div class="card bs-5 p-4">
        <div class="row ">
            <div class="col text-left">
                <h3 style="font-size: 20px;">Packages</h3>
            </div>
            <!-- <div class="col text-right mb-3">
                <btn color="primary" class="mr-2" icon="fa fa-plus" size="sm" @click="$refs.addModal.show()"
                     text="Add Package"/>
                <btn color="primary" class="mr-2" icon="fa fa-plus" size="sm" @click="$refs.addFeatureModal.show()"
                     text="Add Features"/>
            </div> -->
        </div>

        <div v-if="loading" class="text-center p-5">
            <i class="fa fa-spinner fa-spin fa-3x"></i>
            <p class="mt-3">Loading packages...</p>
        </div>

        <div v-else class="p-4">
            <div class="table-wrapper" style="max-height: 70vh;">
                <table id="package" class="table table-bordered" ref="table">
                    <thead>
                    <tr>
                        <th>Features / Packages</th>
                        <th class="package-header" v-for="(packageItem) in packages" :key="packageItem.id">
                            <div class="package-header-content">
                                <div class="package-name">
                                    {{ packageItem.name }}
                                    <div class="package-amount">
                                        Rs. {{ packageItem.amount_in_rs }} / AED. {{ packageItem.amount_in_aed || 0 }}
                                    </div>
                                </div>
                                <div class="action-boxes">
                                    <div class="fl-x fl-a-c">
                                        <edit-btn text="" class="ml-1" color="info" @click="setEdit(packageItem)"/>
                                    </div>
                                    <div class="action-box toggle-box" @click="togglePackage(packageItem.id)" title="Toggle">
                                        <label class="switch">
                                            <input type="checkbox" :checked="!packageItem.delete_flag" readonly>
                                            <span class="slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr v-for="(feature, index) in features" :key="index">
                        <td>
                            <div class="feature-row">
                                {{ feature }}
                            </div>
                        </td>
                    <td v-for="(packageItem) in packages" :key="packageItem.id">
        <div class="td">
            <div class="checkbox-wrapper">
                <input
                    type="checkbox"
                    :id="packageItem.id + '_' + feature"
                    v-model="packageItem.features[getFeatureKey(feature)].value"
                    :disabled="updatingPermission"
                    @change="handleFeatureChange(packageItem, feature)"
                    style="width: 12px; height: 12px; cursor: pointer;"
                />
            <span v-if="packageItem.features[getFeatureKey(feature)].value &&
                packageItem.features[getFeatureKey(feature)].userCount &&
                getFeatureKey(feature) === 'user_count'"
        class="user-count-badge mr-3">
        {{ packageItem.features[getFeatureKey(feature)].userCount }} users
    </span>
            </div>
        </div>
    </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <modal no-close-on-backdrop title="Add Package" ref="addModal" width="30r" header-color="primary">
            <b-form :save-url="addEditUrl" @success="formSuccess" @failure="formFailure" v-slot="{model, loading}">
                <validated-input label="Package Name" v-model="model.name" :disabled="loading"
                   :rules="{required: true}"/>
                <validated-input label="Amount in Rs" v-model="model.amount_in_rs" :disabled="loading"
                    type="number" :rules="{required: true}"/>
                <validated-input label="Amount in AED" v-model="model.amount_in_aed" :disabled="loading"
                    type="number"/>
                <save-btn text="Add Package" color="primary" size="sm" :disabled="loading">
                    <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Saving...</span></span>
                </save-btn>
            </b-form>
        </modal>

        <modal no-close-on-backdrop title="Edit Package" ref="editModal" width="30r" header-color="primary">
            <b-form :save-url="addEditUrl" @success="formSuccess" @failure="formFailure" v-slot="{model, loading}"
                :initial-data="editingItem" >
                <validated-input label="Package Name" v-model="model.name" :disabled="loading"
                    :rules="{required: true}"/>
                <validated-input label="Amount in Rs" v-model="model.amount_in_rs" :disabled="loading"
                    input-type="number" :rules="{required: true}"/>
                <validated-input label="Amount in AED" v-model="model.amount_in_aed" :disabled="loading"
                    input-type="number"/>
                <save-btn text="Update Package" color="primary" size="sm" :disabled="loading">
                    <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Updating...</span></span>
                </save-btn>
            </b-form>
        </modal>

        <modal no-close-on-backdrop title="Add Feature" ref="addFeatureModal" width="30r" header-color="primary">
            <b-form :save-url="featureAddUrl" @success="formSuccess" @failure="formFailure" v-slot="{model, loading}">
                <validated-input label="Feature Name" v-model="model.feature" :disabled="loading"
                    :rules="{required: true}"/>
                <div class="form-group">
                    <label class="d-flex align-items-center">
                        <input type="checkbox" v-model="model.show_separate" class="mr-2"/>
                        Show as separate section
                    </label>
                </div>
                <save-btn text="Add Feature" color="primary" size="sm" :disabled="loading">
                    <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Adding...</span></span>
                </save-btn>
            </b-form>
        </modal>

        <modal no-close-on-backdrop title="User Count" ref="userCountModal" width="30r" header-color="primary">
            <div class="p-3">
                <p>Feature: <strong>{{ selectedFeature }}</strong></p>
                <p>Package: <strong>{{ selectedPackage?.name }}</strong></p>
                <validated-input
                    label="Number of Users"
                    v-model="userCount"
                    input-type="number"
                    :rules="{required: true, min: 1}"
                />
                <div class="mt-3">
                    <btn color="primary" size="sm" @click="saveUserCount" text="Save"/>
                    <btn color="primary" size="sm" @click="cancelUserCount" text="Cancel" class="ml-2"/>
                </div>
            </div>
        </modal>

        <delete-modal ref="deleteFeatureModal" :url="featureDeleteUrl" :params="deletingFeature" @response="deleteComplete">
            <p>You are about to delete the feature <b v-html="deletingFeature && deletingFeature.feature"></b>. Are you sure?</p>
            <template #loading>
                <loading-animation/>
                Please wait while we delete <b v-html="deletingFeature && deletingFeature.feature"></b>.
            </template>
        </delete-modal>

        <!-- Dashboard tick  Warning Modal -->
        <modal no-close-on-backdrop title="Warning" ref="dashboardWarningModal" width="30r" header-color="warning">
    <div class="p-3 text-left">
        <p class="mt-2" style="font-size: 15px;">
            Please enable <strong>"Projectwise Tender Tab"</strong> before enabling <strong>"Dashboard"</strong>.
        </p>
        <div class="mt-4 text-right">
            <btn color="warning" size="sm" @click="$refs.dashboardWarningModal.close()" text="OK"/>
        </div>
    </div>
</modal>
    </div>
</template>

<script>
import axios from 'secure-axios';
import urls from '../../../data/urls';

export default {
    name : 'PackageManagement',
    data () {
        return {
            packages             : [],
            features             : [],
            listUrl              : urls.Admin.MasterData.Package.list,
            addEditUrl           : urls.Admin.MasterData.Package.addEdit,
            enableDisableUrl     : urls.Admin.MasterData.Package.enableDisable,
            featureAddUrl        : urls.Admin.MasterData.Package.featureAdd,
            featureDeleteUrl     : urls.Admin.MasterData.Package.featureDelete,
            editingItem          : null,
            deletingFeature      : null,
            loading              : false,
            updatingPermission   : false,
            selectedFeature      : null,
            selectedPackage      : null,
            userCount            : '',
            pendingFeatureChange : null,
            togglingPackage      : false
        };
    },
    mounted () {
        this.loadFeatures().then(() => {
            this.loadPackages();
        });
    },
    methods : {
        async loadPackages () {
            this.loading = true;

            try {
                const response = await axios.get(this.listUrl);

                if (response.data.success || response.data.status) {
                    this.packages = response.data.data.map(pkg => {
                        const normalizedFeatures = {};

                        if (pkg.features && typeof pkg.features === 'object') {
                            Object.keys(pkg.features).forEach(key => {
                                const featureData = pkg.features[key];
                                const featureValue = featureData.value !== undefined
                                    ? featureData.value
                                    : featureData.enabled;

                                const isEnabled = featureValue === true ||
                                                featureValue === 1 ||
                                                featureValue === '1' ||
                                                String(featureValue).toLowerCase() === 'true';

                                normalizedFeatures[key] = {
                                    label     : featureData.label || key.replace(/_/g, ' '),
                                    value     : isEnabled,
                                    userCount : featureData.userCount || null
                                };
                            });
                        }

                        this.features.forEach(feature => {
                            const key = this.getFeatureKey(feature);
                            if (!normalizedFeatures[key]) {
                                normalizedFeatures[key] = {
                                    label     : feature,
                                    value     : false,
                                    userCount : null
                                };
                            }
                        });

                        return {
                            ...pkg,
                            features : normalizedFeatures
                        };
                    });
                }
            } catch (e) {
                console.error('Error loading packages:', e);
                this.$notify({
                    type : 'error',
                    text : 'Failed to load packages'
                });
            } finally {
                this.loading = false;
            }
        },

        async loadFeatures () {
            try {
                const response = await axios.get(urls.Admin.MasterData.Package.featureList);

                if (response.data.success === true || response.data.status === true) {
                    this.features = response.data.data;
                    return Promise.resolve();
                }
            } catch (error) {
                console.error('Error loading features:', error);
                this.$notify({
                    type : 'error',
                    text : 'Failed to load features'
                });
                return Promise.reject(error);
            }
        },

        getFeatureKey (feature) {
            return feature.toLowerCase().replace(/\s+/g, '_');
        },
        handleFeatureChange (packageItem, feature) {
            const featureKey = this.getFeatureKey(feature);
            const newValue = packageItem.features[featureKey].value;

            if (!newValue && featureKey === 'projectwise_tendertab') {
                const dashboardEnabled = packageItem.features.dashboard?.value;
                if (dashboardEnabled) {
                    packageItem.features.dashboard.value = false;
                }
                this.changePermission(packageItem, feature);
                return;
            }

            if (newValue && featureKey === 'dashboard') {
                const projectwiseEnabled = packageItem.features.projectwise_tendertab?.value;
                if (!projectwiseEnabled) {
                    this.$nextTick(() => {
                        packageItem.features[featureKey].value = false;
                    });
                    this.$refs.dashboardWarningModal.show();
                    return;
                }
            }

            if (newValue && featureKey === 'user_count') {
                this.selectedFeature = feature;
                this.selectedPackage = packageItem;
                this.userCount = packageItem.features[featureKey].userCount || '';
                this.pendingFeatureChange = { packageItem, feature, featureKey };
                this.$refs.userCountModal.show();
            } else {
                this.changePermission(packageItem, feature);
            }
        },
        async saveUserCount () {
            if (!this.userCount || this.userCount < 1) {
                this.$notify({
                    type : 'error',
                    text : 'Please enter a valid user count'
                });
                return;
            }

            const { packageItem, feature, featureKey } = this.pendingFeatureChange;

            packageItem.features[featureKey].userCount = parseInt(this.userCount);

            this.$refs.userCountModal.close();

            await this.changePermission(packageItem, feature);

            this.resetUserCountModal();
        },

        cancelUserCount () {
            if (this.pendingFeatureChange) {
                const { packageItem, featureKey } = this.pendingFeatureChange;
                packageItem.features[featureKey].value = false;
            }

            this.$refs.userCountModal.close();
            this.resetUserCountModal();
        },

        resetUserCountModal () {
            this.selectedFeature = null;
            this.selectedPackage = null;
            this.userCount = '';
            this.pendingFeatureChange = null;
        },

        async changePermission (packageItem, feature) {
            if (this.updatingPermission) {
                return;
            }

            const featureKey = this.getFeatureKey(feature);
            const newValue = packageItem.features[featureKey].value;
            const originalValue = !newValue;
            const originalUserCount = packageItem.features[featureKey].userCount;

            this.updatingPermission = true;

            try {
                const featuresPayload = {};

                Object.keys(packageItem.features).forEach(key => {
                    const featureObj = {
                        label   : packageItem.features[key].label,
                        enabled : packageItem.features[key].value ? 'true' : 'false'
                    };

                    if (packageItem.features[key].userCount) {
                        featureObj.userCount = packageItem.features[key].userCount;
                    }

                    featuresPayload[key] = featureObj;
                });

                const payload = {
                    id            : packageItem.id,
                    name          : packageItem.name,
                    amount_in_rs  : packageItem.amount_in_rs,
                    amount_in_aed : packageItem.amount_in_aed || 0,
                    delete_flag   : packageItem.delete_flag,
                    features      : JSON.stringify(featuresPayload)
                };

                const response = await axios.form(this.addEditUrl, payload);
                const data = response.data;

                if (data.success === true || data.error === false) {
                    const message = data.msg || data.message || 'Package updated successfully';
                    this.$notify({
                        type  : 'success',
                        title : message
                    });
                } else {
                    packageItem.features[featureKey].value = originalValue;
                    packageItem.features[featureKey].userCount = originalUserCount;

                    if (data.errors && typeof data.errors === 'object') {
                        Object.keys(data.errors).forEach(key => {
                            this.$notify({
                                type : 'error',
                                text : data.errors[key]
                            });
                        });
                    } else {
                        const errorMessage = data.msg || data.message || 'Failed to update';
                        this.$notify({
                            type : 'error',
                            text : errorMessage
                        });
                    }
                }
            } catch (error) {
                console.error('Error updating permission:', error);

                packageItem.features[featureKey].value = originalValue;
                packageItem.features[featureKey].userCount = originalUserCount;

                if (error.response?.data) {
                    const data = error.response.data;

                    if (data.errors && typeof data.errors === 'object') {
                        Object.keys(data.errors).forEach(key => {
                            this.$notify({
                                type : 'error',
                                text : data.errors[key]
                            });
                        });
                    } else {
                        const errorMessage = data.msg || data.message || 'Failed to update permission';
                        this.$notify({
                            type : 'error',
                            text : errorMessage
                        });
                    }
                } else {
                    this.$notify({
                        type : 'error',
                        text : 'Network error occurred'
                    });
                }
            } finally {
                this.updatingPermission = false;
            }
        },

        formSuccess (response) {
            this.$refs.addModal.close();
            this.$refs.editModal.close();
            this.$refs.addFeatureModal.close();
            this.editingItem = null;
            const message = response.data?.msg || response.data?.message;
            if (message && message !== 'Package Updated Successfully') {
                this.$notify({
                    type  : 'success',
                    title : message
                });
            }

            this.loadFeatures().then(() => {
                this.loadPackages();
            });
        },
        formFailure (error) {
            const refs = this.$refs;
            refs.addModal.close();
            refs.editModal.close();

            const response = error.response?.data;

            if (response) {
                if (response.errors && typeof response.errors === 'object') {
                    Object.keys(response.errors).forEach(field => {
                        const errorMessage = response.errors[field];

                        this.$notify(
                            errorMessage,
                            'Error',
                            { type : 'danger' }
                        );
                    });
                } else {
                    const errorMessage = response.message ||
                       response.msg ||
                       'Failed to save package';

                    this.$notify(
                        errorMessage,
                        'Error',
                        { type : 'danger' }
                    );
                }
            } else {
                this.$notify(
                    'This Package already exists.',
                    'Error',
                    { type : 'danger' }
                );
            }

            this.editingItem = null;
        },

        setEdit (item) {
            this.editingItem = {
                id            : item.id,
                name          : item.name,
                amount_in_rs  : item.amount_in_rs,
                amount_in_aed : item.amount_in_aed === null || item.amount_in_aed === '' ? 0 : item.amount_in_aed
            };
            this.$nextTick(() => {
                this.$refs.editModal.show();
            });
        },

        async togglePackage (packageId) {
            if (this.togglingPackage) {
                return;
            }

            this.togglingPackage = true;

            try {
                const response = await axios.form(this.enableDisableUrl, { id : packageId });

                if (response.data.error === false || response.data.success === true) {
                    const pkg = this.packages.find(p => p.id === packageId);
                    if (pkg) {
                        pkg.delete_flag = !pkg.delete_flag;

                        const action = pkg.delete_flag ? 'Disabled' : 'Enabled';
                        const message = `${pkg.name} has been ${action}`;

                        this.$notify({
                            type  : 'success',
                            title : message
                        });
                    }
                } else {
                    this.$notify({
                        type : 'error',
                        text : response.data.message || 'Action failed'
                    });
                }
            } catch (e) {
                console.error('Error toggling package:', e);
                this.$notify({
                    type : 'error',
                    text : e.response?.data?.message || 'Action failed'
                });
            } finally {
                setTimeout(() => {
                    this.togglingPackage = false;
                }, 500);
            }
        },

        deleteComplete () {
            this.deletingFeature = null;
            this.$refs.deleteFeatureModal.close();

            this.$notify({
                type  : 'success',
                title : 'Feature deleted successfully'
            });

            this.loadFeatures().then(() => {
                this.loadPackages();
            });
        },

        beforeSubmit (data) {
            if (data.amount_in_aed === null || data.amount_in_aed === '' || data.amount_in_aed === undefined) {
                data.amount_in_aed = 0;
            }
            return data;
        }
    }
};
</script>

<style scoped>
#package {
    font-size: 15px;
    font-family: Montserrat, sans-serif;
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
}

#package td, #package th {
    border: 1px solid #ddd;
    padding: 12px;
    vertical-align: middle;
    width: 14rem;
}

.form-check {
    justify-content: center !important;
    padding: 0 !important;
}

#package tr:nth-child(even) {
    background-color: #f2f2f2;
}

#package tr:hover {
    background-color: lightgrey;
}

#package th {
    padding: 12px 8px;
    text-align: center;
    text-transform: capitalize;
    background-color: rgb(39 68 102);
    color: white;
    white-space: nowrap;
}

.package-header {
    padding: 0 !important;
}

.package-header-content {
    display: flex;
    align-items: stretch;
    background-color: rgb(39 68 102);
    height: 100%;
}

.package-name {
    padding: 12px 16px;
    font-size: 16px;
    font-weight: bold;
    background-color: rgb(39 68 102);
    color: white;
    text-align: center;
    flex: 1;
    white-space: nowrap;
}

.package-amount {
    font-size: 12px;
    font-weight: normal;
    margin-top: 4px;
    opacity: 0.9;
    white-space: nowrap;
}

.action-boxes {
    display: flex;
    background-color: rgb(39 68 102);
}

.action-box {
    padding: 12px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.action-box:last-child {
    border-right: none;
}

.action-box:first-child {
    border-left: none;
}

.action-box i {
    font-size: 16px;
    color: white;
}

.switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 18px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 4px;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 24px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 15px;
    width: 16px;
    left: 2px;
    bottom: 1px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: #28a745;
}

input:checked + .slider:before {
    transform: translateX(20px);
}

.feature-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.checkbox-wrapper {
    display: flex;
    align-items: center;
    justify-content: left;
    gap: 6px;
}

.td {
    text-align: left;
}

.table-wrapper {
    overflow-x: auto;
    overflow-y: auto;
    max-height: 600px;
    position: relative;
}

/* Sticky header row */
#package thead tr th {
    position: sticky;
    top: 0;
    z-index: 3;
}

/* Sticky first column header cell (top-left corner) */
#package thead tr th:first-child {
    position: sticky;
    left: 0;
    top: 0;
    z-index: 4;
    background-color: rgb(39 68 102);
    min-width: 160px;
    box-shadow: 3px 0 5px -2px rgba(0, 0, 0, 0.3); /* ← add here too */
}
/* Sticky first column body cells */
#package tbody tr td:first-child {
    position: sticky;
    left: 0;
    z-index: 2;
    background-color: #ffffff;
    min-width: 160px;
}

/* Keep zebra stripe on sticky first column */
#package tbody tr:nth-child(even) td:first-child {
    background-color: #f2f2f2;
}

/* Keep hover on sticky first column */
#package tbody tr:hover td:first-child {
    background-color: lightgrey;
}
</style>
