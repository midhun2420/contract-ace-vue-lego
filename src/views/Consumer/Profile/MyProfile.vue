<template>
  <div>
    <check-permission />
    <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px">
      <loading-animation />
      <span style="vertical-align: super"> Loading details....</span>
    </div>
    <div v-if="!loading">
      <!-- PROFILE SECTION -->
      <div v-if="details" class="card bs-5">
        <div class="row">
          <div class="col">
            <b style="font-size: 18px">PROFILE</b>
          </div>
          <div class="col text-right">
            <btn color="primary" size="sm" @click="setEdit(details)" text="Edit Profile" />
          </div>
        </div>
        <modal no-close-on-backdrop title="Edit Profile" ref="editProfile" width="45r" header-color="primary">
          <b-form :save-url="editUrl" @success="formSuccess" v-slot="{ model, loading }" :initial-data="editingItem">
            <div class="row mb-2">
              <div class="col-md-4">
                <validated-input name="Name" :rules="rules.name" label="Name" :disabled="loading" v-model="model.name"></validated-input>
              </div>
              <div class="col-md-4">
                <validated-vue-select name="Address Type" :options="addressTypeOptions" label="Address Type" :disabled="loading" v-model="model.address_type"></validated-vue-select>
              </div>
              <div class="col-md-4">
                <checkbox-input class="mt-4" name="Is Primary Address" label="Is Primary Address" :disabled="loading" v-model="model.is_primary_address"></checkbox-input>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col">
                <label>Address</label>
                <textarea-input name="Address" v-model="model.address" />
              </div>
            </div>
            <save-btn icon="" text="Update" color="primary" size="sm" :disabled="loading">
              <span v-if="loading"><loading-animation /><span style="vertical-align: super"> Updating...</span></span>
            </save-btn>
          </b-form>
        </modal>
        <div class="m-3">
          <div class="row mb-3">
            <div class="col">
              <span>Name</span><br />
              <span class="text-primary font-weight-bold" v-if="details.name">{{ details.name }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
            <div class="col">
              <span>Username</span><br />
              <span class="text-primary font-weight-bold" v-if="details.username">{{ details.username }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
            <div class="col">
              <span>Contact Number</span><br />
              <span class="text-primary font-weight-bold" v-if="details.staff_phone_number">{{ details.staff_phone_number }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <span>E-Mail</span><br />
              <span class="text-primary font-weight-bold" v-if="details.email">{{ details.email }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
            <div class="col">
              <span>Role</span><br />
              <span class="text-primary font-weight-bold" v-if="details.role">{{ details.role }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
            <div class="col">
              <span>Company</span><br />
              <span class="text-primary font-weight-bold" v-if="details.company_name">{{ details.company_name }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <span>Address</span><br />
              <span class="text-primary font-weight-bold" v-if="details.address">{{ details.address }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4">
              <span>Address Type</span><br />
              <span class="text-primary font-weight-bold" v-if="details.address_type">{{ details.address_type }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
            <div class="col">
              <span>Is Primary Address</span><br />
              <span class="text-primary font-weight-bold" v-if="details.is_primary_address">
                <div v-if="details.is_primary_address === true">Yes</div>
              </span>
              <span class="text-primary font-weight-bold" v-else>No</span>
            </div>
          </div>
        </div>
      </div>

      <!-- COMPANY DETAILS SECTION -->
      <div class="card bs-5 mb-4" v-if="details">
        <div class="row mb-3">
          <div class="col text-left">
            <b style="font-size: 18px">COMPANY DETAILS</b>
          </div>
            <btn v-if="currentUser.role === 'owner'" color="primary" size="sm" @click="setCompanyEdit(details)" text="Edit Company" />
            <btn v-if="currentUser.role === 'owner'" color="primary" size="sm" class="mr-3 ml-2" text="Upload Document" @click="addDocument" />
        </div>
        <div class="m-3">
          <img alt="logo" v-if="details.company_logo" :src="details.company_logo" class="mb-3" style="max-height: 100px; object-fit: contain" />
          <div class="row mb-3">
            <div class="col">
              <span>Company Name</span><br />
              <span class="text-primary font-weight-bold" v-if="details.company_name">{{ details.company_name }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
            <div class="col">
              <span>Registration Number</span><br />
              <span class="text-primary font-weight-bold" v-if="details.company_registration_no">{{ details.company_registration_no }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
            <div class="col">
              <span>Contact Number</span><br />
              <span class="text-primary font-weight-bold" v-if="details.contact_number">{{ details.contact_number }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
          </div>
          <h6 class="font-weight-bold">Geographical Area of Operation</h6>
          <div class="row mb-3">
            <div class="col">
              <span>Country</span><br />
              <span class="text-primary font-weight-bold" v-if="details.country_name">{{ details.country_name }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
            <div class="col">
              <span>State</span><br />
              <span class="text-primary font-weight-bold" v-if="details.state_name">{{ details.state_name }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
            <div class="col">
              <span>District</span><br />
              <span class="text-primary font-weight-bold" v-if="details.district_name">{{ details.district_name }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <span>Industry</span><br />
              <span class="text-primary font-weight-bold" v-if="details.industry_name">{{ details.industry_name }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
            <div class="col">
              <span>Contact Person</span><br />
              <span class="text-primary font-weight-bold" v-if="details.contact_person">{{ details.contact_person }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
            <div class="col">
              <span>Category</span><br />
              <span class="text-primary font-weight-bold" v-if="details.category_name">{{ details.category_name }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <span>Service Provided</span><br />
              <span class="text-primary font-weight-bold" v-if="details.services_provided_name">{{ details.services_provided_name }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
            <div class="col">
              <span>E-Mail</span><br />
              <span class="text-primary font-weight-bold" v-if="details.contact_e_mail_id">{{ details.contact_e_mail_id }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
            <div class="col">
              <span>Value of the Biggest Project</span><br />
              <span class="text-primary font-weight-bold" v-if="details.value_of_biggest_project">{{ formatCurrency(details.value_of_biggest_project) }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <span>Average annual turnover in last year</span><br />
              <span class="text-primary font-weight-bold" v-if="details.average_annual_turnover_in_last_year">{{ formatCurrency(details.average_annual_turnover_in_last_year) }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
            <div class="col">
              <span>Average annual turnover in last 2 year</span><br />
              <span class="text-primary font-weight-bold" v-if="details.average_annual_turnover_in_last_two_years">{{ formatCurrency(details.average_annual_turnover_in_last_two_years) }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
            <div class="col">
              <span>Average annual turnover in last 3 year</span><br />
              <span class="text-primary font-weight-bold" v-if="details.average_annual_turnover_in_last_three_years">{{ formatCurrency(details.average_annual_turnover_in_last_three_years) }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
          </div>
          <div class="row pb-2">
            <div class="col-md-4">
              <span>Other details 1</span><br />
              <span class="text-primary font-weight-bold" v-if="details.other_details_1">{{ details.other_details_1 }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
            <div class="col-md-4">
              <span>Other details 2</span><br />
              <span class="text-primary font-weight-bold" v-if="details.other_details_2">{{ details.other_details_2 }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
            <div class="col-md-4">
              <span>Package</span><br />
              <span class="text-primary font-weight-bold" v-if="details.package && details.package.name">{{ details.package.name }}</span>
              <span class="text-primary font-weight-bold" v-else>Nil</span>
            </div>
          </div>
        </div>

        <!-- DOCUMENTS SECTION -->
        <div>
          <hr />
          <h6 class="font-weight-bold mb-3">Uploaded Documents</h6>
          <div v-if="documentsLoading" class="text-muted p-3">
            <loading-animation />
            <span style="vertical-align: super">Loading documents...</span>
          </div>
          <div v-else-if="documents.length === 0" class="text-muted p-3">No documents uploaded</div>
          <div v-else class="table-responsive">
            <table class="table table-striped table-hover table-sm">
              <thead class="table-light">
                <tr>
                  <th style="width: 32%; text-align: left">Document Name</th>
                  <th style="width: 58%; text-align: left">File Name</th>
                  <th style="width: 30%; text-align: center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="doc in documents" :key="doc.id">
                  <td style="vertical-align: middle; text-align: left">
                    <span class="font-weight-bold">{{ doc.name }}</span>
                  </td>
                  <td style="vertical-align: middle; text-align: left">
                    <small class="text-muted d-block text-truncate" :title="doc.document ? doc.document.split('/').pop() : 'N/A'">
                      {{ doc.document ? doc.document.split("/").pop() : "N/A" }}
                    </small>
                  </td>
                  <td style="vertical-align: middle; text-align: center; white-space: nowrap">
                    <btn size="xs" color="primary" text="View" class="mr-2" @click="viewDocument(doc)" />
                    <btn size="xs" color="primary" text="Delete" @click="confirmDeleteDocument(doc)" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Company Edit Modal -->
      <modal no-close-on-backdrop title="Company" ref="editCompany" width="70r" header-color="primary">
        <b-form :save-url="editCompanyUrl" @success="formCompanySuccess" v-slot="{ model, loading }" :initial-data="editingItem" ref="editForm">
          <div class="row mb-2">
            <div class="col-md-4">
              <validated-input name="Name" :rules="rules.company_name" label="Name" :disabled="loading" v-model="model.company_name" />
            </div>
            <div class="col-md-4">
              <validated-file-input name="Logo" label="Logo" :disabled="loading" v-model="model.company_logo" />
            </div>
            <div class="col-md-4">
              <validated-input name="Registration Number" :rules="rules.company_registration_no" label="Registration Number" :disabled="loading" v-model="model.company_registration_no" />
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-md-4">
              <validated-input name="Contact Number" :rules="rules.contact_number" label="Contact Number" :disabled="loading" v-model="model.contact_number" />
            </div>
            <div class="col-md-4">
              <validated-input name="E-Mail" :rules="rules.contact_e_mail_id" label="E-Mail" :disabled="loading" v-model="model.contact_e_mail_id" />
            </div>
            <div class="col-md-4">
              <validated-ajax-vue-select name="Vendor Category" multiple :url="vendorCategoryOptions" :rules="rules.category" label="Vendor Category" v-model="model.category" />
            </div>
          </div>
          <h6 class="font-weight-bold">Geographical Area of Operation</h6>
          <div class="row mb-2">
            <div class="col-md-4">
              <validated-ajax-vue-select name="Country" :url="countryOptions" @input="loadStateOptions(model.country)" :rules="rules.country" label="Country" v-model="model.country" />
            </div>
            <div class="col-md-4">
              <validated-vue-select name="State" :options="stateOptions" @input="loadDistrictOptions(model.state)" :rules="rules.state" label="State" v-model="model.state" />
            </div>
            <div class="col-md-4">
              <validated-vue-select name="District" :options="districtOptions" @input="checkIfNullValue(model.district)" :rules="rules.district" label="District" v-model="model.district" multiple />
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-md-4">
              <validated-ajax-vue-select name="Industry" :url="industryOptions" :rules="rules.industry" label="Industry" v-model="model.industry" />
            </div>
            <div class="col-md-4">
              <validated-input name="Contact Person" :rules="rules.contact_person" label="Contact Person" :disabled="loading" v-model="model.contact_person" />
            </div>
            <div class="col-md-4">
              <validated-ajax-vue-select name="Services Provided" :url="servicesOptions" multiple :rules="rules.services_provided" label="Services Provided" v-model="model.services_provided" />
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-md-4">
              <validated-input name="Value of the Biggest Project" :rules="rules.value_of_biggest_project" label="Value of the Biggest Project" :disabled="loading" v-model="model.value_of_biggest_project" type="text" @input="formatCurrencyInput($event, 'value_of_biggest_project')" @blur="validateDecimalField('value_of_biggest_project')" />
              <small class="text-muted">Enter amount in ₹ (e.g., 1000000.50)</small>
            </div>
            <div class="col-md-4">
              <validated-input name="Average Annual Turnover In Last Year" :rules="rules.average_annual_turnover_in_last_year" label="Average Annual Turnover In Last Year" :disabled="loading" type="text" v-model="model.average_annual_turnover_in_last_year" @input="formatCurrencyInput($event, 'average_annual_turnover_in_last_year')" @blur="validateDecimalField('average_annual_turnover_in_last_year')" />
              <small class="text-muted">Enter amount in ₹ (e.g., 500000.75)</small>
            </div>
            <div class="col-md-4">
              <validated-input name="Average Annual Turnover In Last 2 Years" :rules="rules.average_annual_turnover_in_last_two_years" label="Average Annual Turnover In Last 2 Years" :disabled="loading" type="text" v-model="model.average_annual_turnover_in_last_two_years" @input="formatCurrencyInput($event, 'average_annual_turnover_in_last_two_years')" @blur="validateDecimalField('average_annual_turnover_in_last_two_years')" />
              <small class="text-muted">Enter amount in ₹ (e.g., 750000.25)</small>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-md-4">
              <validated-input name="Average Annual Turnover In Last 3 Years" :rules="rules.average_annual_turnover_in_last_three_years" label="Average Annual Turnover In Last 3 Years" :disabled="loading" type="text" v-model="model.average_annual_turnover_in_last_three_years" @input="formatCurrencyInput($event, 'average_annual_turnover_in_last_three_years')" @blur="validateDecimalField('average_annual_turnover_in_last_three_years')" />
              <small class="text-muted">Enter amount in ₹ (e.g., 1000000.00)</small>
            </div>
            <div class="col-md-4">
              <validated-ajax-vue-select name="Package" :url="packageOptions" label="Package" disabled v-model="model.package" :clearable="true" :reduce="item => item?.id || ''" />
              <small class="text-muted">Select subscription package</small>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col">
              <label>Other Details 1</label>
              <textarea-input name="Other Details 1" v-model="model.other_details_1" />
            </div>
          </div>
          <div class="row mb-2">
            <div class="col">
              <label>Other Details 2</label>
              <textarea-input name="Other Details 2" v-model="model.other_details_2" />
            </div>
          </div>
          <save-btn text="Update" icon="" color="primary" size="sm" :disabled="loading">
            <span v-if="loading"><loading-animation /><span style="vertical-align: super"> Updating...</span></span>
          </save-btn>
        </b-form>
      </modal>

      <!-- DOCUMENT UPLOAD MODAL -->
      <modal ref="documentModal" title="Upload Company Document" width="45r" header-color="primary" no-close-on-backdrop @hidden="resetDocumentForm">
        <div class="p-3">
          <div class="mb-3">
            <label><strong>Document Name</strong></label>
            <input type="text" class="form-control" v-model="documentForm.name" placeholder="Enter document name" @keyup.enter="submitDocument" />
          </div>
          <div class="mb-3">
            <label><strong>Upload File</strong></label>
            <div class="input-group">
              <input ref="documentFileInput" type="file" class="form-control" @change="onDocumentFileChange" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
            </div>
            <small class="text-muted">Supported: PDF, DOC, DOCX, JPG, JPEG, PNG (Max: 10MB)</small>
          </div>
          <div class="d-flex gap-2">
            <btn color="primary" size="sm" text="Upload" :disabled="documentUploading" @click="submitDocument">
              <span v-if="documentUploading"><loading-animation /><span style="vertical-align: super">Uploading...</span></span>
            </btn>
            <btn color="secondary" size="sm" text="Cancel" :disabled="documentUploading" @click="closeDocumentModal" />
          </div>
        </div>
      </modal>

      <!-- PRODUCT CATALOGUE SECTION WITH VUE-TABLE-CARD -->
      <div v-if="canProductCatalogue" class="card bs-5 mb-4">
        <div class="row mb-3 align-items-center">
          <div class="col">
            <b style="font-size: 18px">PRODUCT CATALOGUE</b>
          </div>
          <div class="col text-right">
                        <btn color="primary" size="sm"  text="Add Catalogue" @click="addProduct" />
            <btn color="primary" size="sm" class="ml-2 mr-2" text="Upload Catalogue" @click="$refs.productUploadInput.click()" />

            <btn color="primary" size="sm" class="mr-2" text="Download Format" @click="downloadProductFormat" />
            <input type="file" ref="productUploadInput" accept=".xlsx,.xls" style="display: none" @change="uploadProductCatalogue" />
            <btn  color="primary" size="sm" class="ml-2 mr-2" text="Download Catalogue" @click="downloadProductCatalogue" />

          </div>
        </div>

        <!-- VUE-TABLE-CARD for Products -->
        <vue-table-card
          ref="productTable"
          class="bs-5"
          :fields="productFields"
          :url="productListUrl"
          :per-page="10"
        >
          <!-- Actions slot for View, Edit, Delete buttons -->
          <template #actions="{ rowData }">
  <div class="action-btns">
    <btn size="xs" color="primary" text="View" @click="viewProduct(rowData)" />
    <btn size="xs" color="primary" text="Edit" @click="editProduct(rowData)" />
    <btn size="xs" color="primary" text="Delete" @click="confirmDeleteProduct(rowData)" />
  </div>
</template>

        </vue-table-card>
      </div>
    </div>

    <!-- Product Add/Edit Modal -->
    <modal no-close-on-backdrop :title="editingProduct ? 'Edit Product' : 'Add Product'" ref="productModal" width="60r" header-color="primary">
      <b-form :save-url="productSaveUrl" @success="productFormSuccess" @failure="productFormError" v-slot="{ model, loading }" :initial-data="editingProduct" ref="productForm">
        <div class="row mb-2">
          <div class="col-md-6">
            <validated-input name="name" :rules="productRules.name" label="Product Name" :disabled="loading" v-model="model.name" />
          </div>
          <div class="col-md-6">
            <validated-input name="brand" label="Brand" :disabled="loading" v-model="model.brand" />
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-md-4">
<validated-input
  name="price"
  :rules="productRules.price"
  label="Price"
  :disabled="loading"
  v-model="model.price"
  type="text"
  inputmode="decimal"
  placeholder="0.00"
  @keydown="allowOnlyNumbers($event)"
/>
            <small class="text-muted">Enter price in ₹ (e.g., 150.50)</small>
          </div>
          <div class="col-md-4">
            <validated-input name="quantity" :rules="productRules.quantity" label="Quantity" :disabled="loading" type="number" inputmode="numeric" placeholder="0" v-model="model.quantity" @input="validateIntegerInput($event, 'quantity')" @blur="validateDecimalField('quantity', true)" />
            <small class="text-muted">Enter whole number only (e.g., 100)</small>
          </div>
          <div class="col-md-4">
            <validated-input name="unit" label="Unit (e.g., Kg, Pcs, Ltr)" :disabled="loading" v-model="model.unit" />
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-md-6">
            <validated-input name="location" label="Location" :disabled="loading" v-model="model.location" />
          </div>
          <div class="col-md-6">
            <validated-input name="price_valid_till"  :rules="productRules.price_valid_till" type="date" label="Price Valid Till" :disabled="loading" v-model="model.price_valid_till" />
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-md-4">
            <validated-input name="grade" label="Grade" :disabled="loading" v-model="model.grade" />
          </div>
          <!-- <div class="col-md-4">
            <validated-input name="rating" :rules="productRules.rating" label="Rating" :disabled="loading" type="text" inputmode="decimal" placeholder="0.0" v-model="model.rating" @input="validateRatingInput($event, 'rating')" @blur="validateDecimalField('rating', true)" />
            <small class="text-muted">Enter rating 1-10 (e.g., 4.5)</small>
          </div> -->
        </div>
        <div class="row mb-2">
          <div class="col">
            <label>Description</label>
            <textarea-input name="description" v-model="model.description" />
          </div>
        </div>
        <div class="row mb-2">
          <div class="col">
            <label>Specification</label>
            <textarea-input name="specification" v-model="model.specification" />
          </div>
        </div>
        <div class="row mb-2">
          <div class="col">
            <label>Remark 1</label>
            <textarea-input name="remark_1" v-model="model.remark_1" placeholder="Add any additional remarks or notes about this product" />
          </div>
          <div class="col">
            <label>Remark 2</label>
            <textarea-input name="remark_2" v-model="model.remark_2" placeholder="Add any additional remarks or notes about this product" />
          </div>
        </div>
        <save-btn :text="editingProduct ? 'Update' : 'Save'" icon="" color="primary" size="sm" :disabled="loading">
          <span v-if="loading"><loading-animation /><span style="vertical-align: super">{{ editingProduct ? "Updating..." : "Saving..." }}</span></span>
        </save-btn>
      </b-form>
    </modal>

    <!-- Product View Modal -->
    <modal title="Product details" ref="productViewModal" width="50r" header-color="primary">
      <div v-if="viewingProduct">
        <div class="row mb-2">
          <div class="col-md-6"><strong>Name:</strong> {{ viewingProduct.name }}</div>
          <div class="col-md-6" v-if="viewingProduct.brand"><strong>Brand:</strong> {{ viewingProduct.brand }}</div>
        </div>
        <div class="row mb-2">
          <div class="col-md-6"><strong>Price:</strong> ₹{{ formatDecimal(viewingProduct.price) }}</div>
          <div class="col-md-6"><strong>Quantity:</strong> {{ formatDecimal(viewingProduct.quantity) }}</div>
          <div class="col-md-6"><strong>Unit:</strong> {{ viewingProduct.unit || "N/A" }}</div>
        </div>
        <div class="row mb-2" v-if="viewingProduct.location || viewingProduct.price_valid_till">
          <div class="col-md-6" v-if="viewingProduct.location"><strong>Location:</strong> {{ viewingProduct.location }}</div>
          <div class="col-md-6"><strong>Valid Till:</strong> {{ viewingProduct.price_valid_till }}</div>
        </div>
        <div class="row mb-2" v-if="viewingProduct.grade || viewingProduct.rating">
          <div class="col-md-6" v-if="viewingProduct.grade"><strong>Grade:</strong> {{ viewingProduct.grade }}</div>
          <div class="col-md-6" v-if="viewingProduct.rating"><strong>Rating:</strong> {{ formatDecimal(viewingProduct.rating, 1) }}</div>
        </div>
        <div class="mb-2" v-if="viewingProduct.description">
          <strong>Description:</strong>
          <p>{{ viewingProduct.description }}</p>
        </div>
        <div class="mb-2" v-if="viewingProduct.specification">
          <strong>Specification:</strong>
          <p>{{ viewingProduct.specification }}</p>
        </div>
        <div class="mb-2" v-if="viewingProduct.remark_1">
          <strong>Remark 1:</strong>
          <p>{{ viewingProduct.remark_1 }}</p>
        </div>
        <div class="mb-2" v-if="viewingProduct.remark_2">
          <strong>Remark 2:</strong>
          <p>{{ viewingProduct.remark_2 }}</p>
        </div>
        <div class="text-muted small"><strong>Last Updated:</strong> {{ viewingProduct.updated_on }}</div>
      </div>
    </modal>
  </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';
import { mapGetters } from 'vuex';

export default {
    name : 'MyProfile',
    data () {
        return {
            editUrl                     : urls.Consumer.Profile.addEdit,
            editCompanyUrl              : urls.Consumer.Company.addEdit,
            industryOptions             : urls.Admin.Company.industryOptions,
            vendorCategoryOptions       : urls.Admin.Company.vendorCategoryOptions,
            servicesOptions             : urls.Admin.Company.servicesOptions,
            packageOptions              : urls.Admin.MasterData.Package.packageOptions || '/admin/package/options/', // ADD THIS LINE
            stateOptions                : [],
            countryOptions              : urls.Consumer.Company.countryOptions,
            districtOptions             : [],
            documentAddUrl              : urls.Consumer.Company.documentAdd,
            documentListUrl             : urls.Consumer.Company.documentList,
            documentDeleteUrl           : urls.Consumer.Company.documentDelete,
            productSaveUrl              : urls.Consumer.Company.productCatalogueAddEdit,
            productListUrl              : urls.Consumer.Company.productCatalogueList,
            productDeleteUrl            : urls.Consumer.Company.productCatalogueDelete,
            productDetailsUrl           : urls.Consumer.Company.productCatalogueDetails,
            productCatalogueFormatUrl   : urls.Consumer.Company.productCatalogueFormatDownload,
            productCatalogueUploadUrl   : urls.Consumer.Company.productCatalogueUpload,
            productCatalogueDownloadUrl : urls.Consumer.Company.productCatalogueDownload,
            loading                     : false,
            editProfileUrl              : null,
            editingItem                 : null,
            details                     : null,
            documents                   : [],
            documentsLoading            : false,
            documentUploading           : false,
            documentForm                : { name : '', file : null },
            addressTypeOptions          : [
                { label : 'Office', value : 'Office' },
                { label : 'Home', value : 'Home' },
                { label : 'Other', value : 'Other' }
            ],
            editingProduct : null,
            viewingProduct : null,
            reloadTrigger  : 0,
            isReloading    : false,
            rules          : {
                name                                        : { required : true },
                contact_person                              : { required : false },
                company_name                                : { required : true },
                value_of_biggest_project                    : { required : false, numeric : true, min : 0 },
                company_registration_no                     : { required : false },
                contact_number                              : { required : false, numeric : true },
                contact_e_mail_id                           : { required : false, email : true },
                industry                                    : { required : false },
                geographical_area_of_operations             : { required : false },
                services_provided                           : { required : false },
                average_annual_turnover_in_last_year        : { required : false, numeric : true, min : 0 },
                average_annual_turnover_in_last_two_years   : { required : false, numeric : true, min : 0 },
                average_annual_turnover_in_last_three_years : { required : false, numeric : true, min : 0 },
                category                                    : { required : false },
                country                                     : { required : false },
                state                                       : { required : false },
                district                                    : { required : false }
            },
            productRules : {
                name             : { required : true },
                price            : { required : true, min : 0.01 },
                quantity         : { required : true, numeric : true, min : 1 },
                price_valid_till : { required : false }
                // rating           : { required : true, numeric : true, min : 0, max : 10 }
            },
            // Product table fields for VueTableCard
            productFields : [
                { name : 'name', title : 'Product Name' },
                { name : 'brand', title : 'Brand' },
                { name : 'price', title : 'Price (₹)' },
                { name : 'quantity', title : 'Quantity' },
                { name : 'unit', title : 'Unit' },
                { name : 'location', title : 'Location' },
                { name : 'price_valid_till', title : 'Valid Till' },
                // { name : 'rating', title : 'Rating' },
                { name : 'grade', title : 'Grade' },
                // { name : 'updated_on', title : 'Last Updated' },
                { name : 'remark_1', title : 'Remark 1' },
                { name : 'remark_2', title : 'Remark 2' },
                {
                    name       : '__slot:actions',
                    title      : 'Actions',
                    titleClass : 'text-right',
                    dataClass  : 'text-right'
                }
            ]
        };
    },
    computed : {
        ...mapGetters(['currentUser']),
        canProductCatalogue () {
            const flag = this.currentUser?.packages?.product_catelogue;
            return flag === true || flag === 'true';
        }
    },
    mounted () {
        this.initializeUrls();
        this.loadInitialData();
    },
    watch : {
        reloadTrigger () {
            console.log('Auto-reload triggered');
        }
    },
    methods : {
        initializeUrls () {
            this.documentAddUrl = urls.Consumer && urls.Consumer.Company && urls.Consumer.Company.documentAdd ? urls.Consumer.Company.documentAdd : '/company/company/documents-add/';
            this.documentListUrl = urls.Consumer && urls.Consumer.Company && urls.Consumer.Company.documentList ? urls.Consumer.Company.documentList : '/company/company/documents-list/';
            this.documentDeleteUrl = urls.Consumer && urls.Consumer.Company && urls.Consumer.Company.documentDelete ? urls.Consumer.Company.documentDelete : '/company/company/documents-delete/';
            console.log('Document URLs initialized:', { add : this.documentAddUrl, list : this.documentListUrl, delete : this.documentDeleteUrl });
        },
        allowOnlyNumbers (event) {
            // Allow: backspace, delete, tab, escape, enter, arrow keys
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', '.'];
            if (allowedKeys.includes(event.key)) return;

            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            if (event.ctrlKey || event.metaKey) return;

            // Block if not a digit
            if (!/^\d$/.test(event.key)) {
                event.preventDefault();
            }
        },
        loadInitialData () {
            this.loadDetails();
        },
        reloadAllData () {
            if (this.isReloading) return;
            console.log('Reloading all data...');
            this.isReloading = true;
            this.loadDetails();
            setTimeout(() => { this.loadDocuments(); }, 300);
            setTimeout(() => {
                if (this.$refs.productTable) {
                    this.$refs.productTable.refreshTable();
                }
                this.isReloading = false;
            }, 600);
        },
        forceReload () {
            this.reloadTrigger++;
            this.reloadAllData();
        },
        formatDecimal (value, decimalPlaces = 2) {
            if (value === null || value === undefined || value === '') return '0';
            const num = parseFloat(value);
            if (isNaN(num)) return '0';
            return num.toFixed(decimalPlaces).replace(/\.?0+$/, '');
        },
        formatCurrency (value) {
            if (value === null || value === undefined || value === '') return '₹0';
            const num = parseFloat(value);
            if (isNaN(num)) return '₹0';
            return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits : 2, maximumFractionDigits : 2 });
        },
        formatDate (dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', { year : 'numeric', month : 'short', day : 'numeric' });
        },
        formatCurrencyInput (event, fieldName, isProduct = false) {
            let value = event.target.value;
            value = value.replace(/[^\d.]/g, '');
            const decimalParts = value.split('.');
            if (decimalParts.length > 2) value = decimalParts[0] + '.' + decimalParts.slice(1).join('');
            if (decimalParts.length === 2 && decimalParts[1].length > 2) value = decimalParts[0] + '.' + decimalParts[1].substring(0, 2);
            event.target.value = value;
            if (isProduct) {
                if (this.$refs.productForm) this.$refs.productForm.setModelValue(fieldName, value);
            } else {
                if (this.$refs.editForm) this.$refs.editForm.setModelValue(fieldName, value);
            }
        },
        validateIntegerInput (event, fieldName) {
            let value = event.target.value;
            value = value.replace(/[^\d]/g, '');
            if (value.length > 1 && value[0] === '0') value = value.replace(/^0+/, '');
            event.target.value = value;
            if (this.$refs.productForm) this.$refs.productForm.setModelValue(fieldName, value);
        },
        validateDecimalInput (event, fieldName) {
            let value = event.target.value;
            value = value.replace(/[^\d.]/g, '');
            const decimalParts = value.split('.');
            if (decimalParts.length > 2) value = decimalParts[0] + '.' + decimalParts.slice(1).join('');
            if (decimalParts.length === 2 && decimalParts[1].length > 2) value = decimalParts[0] + '.' + decimalParts[1].substring(0, 2);
            if (value.length > 1 && value[0] === '0' && value[1] !== '.') value = value.replace(/^0+/, '');
            event.target.value = value;
            if (this.$refs.productForm) this.$refs.productForm.setModelValue(fieldName, value);
        },
        validateRatingInput (event, fieldName) {
            let value = event.target.value;
            value = value.replace(/[^\d.]/g, '');
            const decimalParts = value.split('.');
            if (decimalParts.length > 2) value = decimalParts[0] + '.' + decimalParts.slice(1).join('');
            if (decimalParts.length === 2 && decimalParts[1].length > 1) value = decimalParts[0] + '.' + decimalParts[1].substring(0, 1);
            if (value.length > 1 && value[0] === '0' && value[1] !== '.') value = value.replace(/^0+/, '');
            const numValue = parseFloat(value);
            if (!isNaN(numValue) && numValue > 10) value = '10';
            event.target.value = value;
            if (this.$refs.productForm) this.$refs.productForm.setModelValue(fieldName, value);
        },
        validateDecimalField (fieldName, isProduct = false) {
            let model;
            if (isProduct) {
                model = this.$refs.productForm ? this.$refs.productForm.getModel() : null;
            } else {
                model = this.$refs.editForm ? this.$refs.editForm.getModel() : null;
            }
            if (!model) return;
            let value = model[fieldName];
            if (value === '' || value === null || value === undefined) return;
            const num = parseFloat(value);
            if (!isNaN(num)) {
                if (fieldName === 'rating') {
                    value = num.toFixed(1);
                } else {
                    value = num.toFixed(2);
                }
                if (isProduct) {
                    if (this.$refs.productForm) this.$refs.productForm.setModelValue(fieldName, value);
                } else {
                    if (this.$refs.editForm) this.$refs.editForm.setModelValue(fieldName, value);
                }
            }
        },
        loadStateOptions (item) {
            if (this.$refs.editForm.getModelValue('country') === null) this.$refs.editForm.setModelValue('country', '');
            this.$refs.editForm.setModelValue('state', '');
            this.$refs.editForm.setModelValue('district', '');
            this.stateOptions = [];
            this.districtOptions = [];
            const that = this;
            axios.form(urls.Admin.Company.stateOptions, { country : item }).then(function (response) {
                const json = response.data;
                that.stateOptions = json.data;
                that.districtOptions = [];
            });
        },
        loadDistrictOptions (item) {
            this.districtOptions = [];
            if (this.$refs.editForm.getModelValue('state') === null) this.$refs.editForm.setModelValue('state', '');
            this.$refs.editForm.setModelValue('district', '');
            const that = this;
            axios.form(urls.Admin.Company.districtOption, { state : item }).then(function (response) {
                const json = response.data;
                that.districtOptions = json.data;
            });
        },
        checkIfNullValue (item) {
            if (this.$refs.editForm.getModelValue('district') === null) this.$refs.editForm.setModelValue('district', '');
        },
        onDocumentFileChange (e) {
            this.documentForm.file = e.target.files[0];
            console.log('File selected:', this.documentForm.file?.name);
        },
        addDocument () {
            if (!this.details || !this.details.company_id) {
                this.$toast.error('Company details are not loaded. Please refresh the page.');
                return;
            }
            this.resetDocumentForm();
            this.$refs.documentModal.show();
        },
        submitDocument () {
            if (!this.documentForm.name) {
                this.$notify('Document name is required', 'Warning', { type : 'warning' });
                return;
            }

            if (!this.documentForm.file) {
                this.$notify('Please select a file to upload', 'Warning', { type : 'warning' });
                return;
            }

            if (!this.details || !this.details.company_id) {
                this.$notify('Company ID is not available', 'Error', { type : 'error' });
                return;
            }

            const duplicateDoc = this.documents.find(
                doc => doc.name.toLowerCase().trim() === this.documentForm.name.toLowerCase().trim()
            );

            if (duplicateDoc) {
                this.$notify(
                    'A document with this name already exists. Please use a different name.',
                    'Warning',
                    { type : 'warning' }
                );
                return;
            }

            const formData = new FormData();
            formData.append('name', this.documentForm.name);
            formData.append('document', this.documentForm.file);
            formData.append('company', this.details.company_id);

            this.documentUploading = true;

            const that = this;

            axios.post(this.documentAddUrl, formData, {
                headers : { 'Content-Type' : 'multipart/form-data' }
            })
                .then(res => {
                    if (res.data && (res.data.error === false || res.data.success === true)) {
                        that.$notify('Document uploaded successfully', 'Success', { type : 'success' });
                        that.$refs.documentModal.close();
                        that.resetDocumentForm();
                        that.loadDocuments();
                    } else {
                        let errorMessage = 'Failed to upload document';

                        if (res.data.errors && typeof res.data.errors === 'object') {
                            const firstError = Object.values(res.data.errors)[0];
                            errorMessage = firstError || errorMessage;
                        } else if (res.data.message) {
                            errorMessage = res.data.message;
                        }

                        that.$notify(errorMessage, 'Warning', { type : 'warning' });
                    }
                })
                .catch(err => {
                    console.error('Error uploading document:', err);
                    that.$notify('Failed to upload document', 'Error', { type : 'error' });
                })
                .finally(() => {
                    that.documentUploading = false;
                });
        },
        closeDocumentModal () {
            if (this.$refs.documentModal) this.$refs.documentModal.close();
            this.resetDocumentForm();
        },
        resetDocumentForm () {
            this.documentForm = { name : '', file : null };
            if (this.$refs.documentFileInput) this.$refs.documentFileInput.value = '';
        },
        loadDocuments () {
            const that = this;
            that.documentsLoading = true;
            if (!that.details || !that.details.company_id) {
                console.warn('Company ID not available, skipping document load');
                that.documentsLoading = false;
                that.documents = [];
                return;
            }
            if (!this.documentListUrl) {
                console.error('Document list URL not configured');
                that.documentsLoading = false;
                return;
            }
            console.log('Loading documents...');
            axios.get(this.documentListUrl, { params : { search : '' } })
                .then(function (response) {
                    if (!response || !response.data) {
                        that.documents = [];
                        that.documentsLoading = false;
                        return;
                    }
                    const json = response.data;
                    if (json.status === true || json.error === false) {
                        that.documents = json.data && Array.isArray(json.data) ? json.data : [];
                        console.log('Documents loaded:', that.documents.length);
                    } else {
                        that.documents = [];
                    }
                    that.documentsLoading = false;
                })
                .catch(function (error) {
                    console.error('Error loading documents:', error);
                    that.documents = [];
                    that.documentsLoading = false;
                });
        },
        viewDocument (doc) {
            const documentUrl = doc.document || doc.document_url;
            if (documentUrl) {
                window.open(documentUrl, '_blank');
            } else {
                this.$toast.error('Document URL not available');
            }
        },
        confirmDeleteDocument (doc) {
            if (confirm('Are you sure you want to delete "' + doc.name + '"?')) {
                this.deleteDocument(doc);
            }
        },

        deleteDocument (doc) {
            const that = this;

            console.log('Deleting document:', doc);

            const formData = new FormData();
            formData.append('id', doc.id);

            axios.post(this.documentDeleteUrl, formData)
                .then(function (response) {
                    console.log('Delete response:', response);

                    const json = response.data || {};

                    if (json.error === false || json.success === true || json.status === true) {
                        that.$notify(
                            json.message || 'Document deleted successfully',
                            'Success',
                            { type : 'success' }
                        );

                        that.loadDocuments();

                        console.log('Document deleted, reloading documents...');
                    } else {
                        that.$notify(
                            json.message || 'Failed to delete document',
                            'Warning',
                            { type : 'warning' }
                        );
                    }
                })
                .catch(function (error) {
                    console.error('Error deleting document:', error);

                    let errorMessage = 'Failed to delete document';

                    if (error.response && error.response.data) {
                        const errorData = error.response.data;
                        if (errorData.message) {
                            errorMessage = errorData.message;
                        } else if (errorData.errors && typeof errorData.errors === 'object') {
                            const firstError = Object.values(errorData.errors)[0];
                            errorMessage = firstError || errorMessage;
                        }
                    }

                    that.$notify(errorMessage, 'Error', { type : 'error' });
                });
        },
        loadDetails () {
            const that = this;
            that.loading = true;
            axios.get(urls.Consumer.Profile.details)
                .then(function (response) {
                    const json = response.data;
                    if (json.error === false) {
                        that.details = json.data;
                        if (that.details.country) {
                            axios.form(urls.Admin.Company.stateOptions, { country : that.details.country }).then(function (response) {
                                const json = response.data;
                                that.stateOptions = json.data;
                            });
                        }
                        if (that.details.state) {
                            axios.form(urls.Admin.Company.districtOption, { state : that.details.state }).then(function (response) {
                                const json = response.data;
                                that.districtOptions = json.data;
                            });
                        }
                        that.loading = false;
                        setTimeout(function () { that.loadDocuments(); }, 300);
                    }
                })
                .catch(function (error) {
                    console.error('Error loading profile details:', error);
                    that.loading = false;
                });
        },
        formSuccess (response) {
            const refs = this.$refs;
            if (response.data) {
                this.details.name = response.data.name;
                this.details.address = response.data.address;
                this.details.is_primary_address = response.data.is_primary_address;
                this.details.address_type = response.data.address_type;
            }
            refs.editProfile.close();
            this.editingItem = null;
            this.$toast.success('Profile updated successfully');
            const that = this;
            setTimeout(function () { that.forceReload(); }, 500);
        },
        formCompanySuccess (response) {
            const refs = this.$refs;
            if (response.data && response.data.data && response.data.data.data) {
                this.details = response.data.data.data;
            } else if (response.data) {
                this.details = response.data;
            }
            refs.editCompany.close();
            this.editingItem = null;
            this.$toast.success('Company details updated successfully');
            const that = this;
            setTimeout(function () { that.forceReload(); }, 500);
        },
        setEdit (item) {
            this.editingItem = Object.assign({}, item);
            this.$refs.editProfile.show();
        },
        // FIXED: Handle package object properly
        setCompanyEdit (item) {
            this.editingItem = Object.assign({}, item);
            this.editingItem.id = item.company_id;
            this.editingItem.services_provided = item.service_provided;

            // Handle package - extract ID if it's an object
            if (item.package && typeof item.package === 'object') {
                this.editingItem.package = item.package.id || '';
            } else {
                this.editingItem.package = item.package || '';
            }

            // Handle category - ensure it's an array
            if (item.category && !Array.isArray(item.category)) {
                this.editingItem.category = [item.category];
            }

            console.log('Editing company with data:', this.editingItem);
            this.$refs.editCompany.show();
        },
        downloadProductFormat () {
            const that = this;
            axios.get(this.productCatalogueFormatUrl)
                .then(function (response) {
                    const json = response.data;
                    if (json.error === false && json.data && json.data.file_url) {
                        window.open(json.data.file_url, '_blank');
                    } else if (json.url) {
                        window.open(json.url, '_blank');
                    } else {
                        that.$toast.error(json.message || 'Product Catalogue File Not Found');
                    }
                })
                .catch(function (error) {
                    console.error('Download error:', error);
                    that.$toast.error('Format download failed');
                });
        },
        downloadProductCatalogue () {
            if (!this.details || !this.details.company_id) {
                this.$notify('Company ID not available', 'Error', { type : 'error' });
                return;
            }

            const formData = new FormData();
            formData.append('id', this.details.company_id);

            axios
                .post(this.productCatalogueDownloadUrl, formData)
                .then((res) => {
                    const data = res.data;

                    // ❌ NO PRODUCTS
                    if (!data.success) {
                        this.$notify(
                            data.message || 'No Product Available',
                            'Warning',
                            { type : 'warning' }
                        );
                        return;
                    }

                    // ✅ SUCCESS → DOWNLOAD FILE
                    if (data.pdf_url) {
                        const fileUrl = data.pdf_url.startsWith('http')
                            ? data.pdf_url
                            : `${window.location.origin}${data.pdf_url}`;

                        const link = document.createElement('a');
                        link.href = fileUrl;
                        link.setAttribute('download', 'product_catalogue.pdf');
                        document.body.appendChild(link);
                        link.click();
                        link.remove();

                        this.$notify(
                            'Product catalogue downloaded successfully',
                            'Success',
                            { type : 'success' }
                        );
                    } else {
                        this.$notify(
                            'File URL not found',
                            'Error',
                            { type : 'error' }
                        );
                    }
                })
                .catch(() => {
                    this.$notify(
                        'Failed to download catalogue',
                        'Error',
                        { type : 'error' }
                    );
                });
        },
        uploadProductCatalogue (event) {
            const file = event.target.files[0];
            if (!file) return;

            const that = this;

            const validTypes = [
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ];

            if (!validTypes.includes(file.type)) {
                that.$notify(
                    'Invalid file type. Please upload an Excel file (.xls or .xlsx).',
                    'Error',
                    { type : 'error' }
                );
                if (that.$refs.productUploadInput) that.$refs.productUploadInput.value = '';
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                that.$notify(
                    'File size exceeds 10MB limit.',
                    'Error',
                    { type : 'error' }
                );
                if (that.$refs.productUploadInput) that.$refs.productUploadInput.value = '';
                return;
            }

            const formData = new FormData();
            formData.append('product_catalogue_file', file);

            axios.post(this.productCatalogueUploadUrl, formData, {
                headers : { 'Content-Type' : 'multipart/form-data' }
            })
                .then(function (response) {
                    if (!response || !response.data) {
                        that.$notify('No response from server.', 'Error', { type : 'error' });
                        return;
                    }

                    const json = response.data;

                    // ❌ ERROR / FAILED CASES
                    if (json.error === true || json.success === false) {
                        // 🔴 EXISTING EMPTY FILE MESSAGE (DO NOT REMOVE)
                        if (
                            json.errors &&
                    json.errors.File &&
                    json.errors.File.toLowerCase().includes('empty')
                        ) {
                            that.$notify(
                                'Excel file is empty.',
                                'Warning',
                                { type : 'warning' }
                            );
                            return;
                        }

                        // 🟡 NEW: HEADER ONLY EXCEL CASE
                        if (
                            json.message &&
                    json.message.toLowerCase().includes('only') &&
                    json.message.toLowerCase().includes('header')
                        ) {
                            that.$notify(
                                'Excel file contains only headers. Please add product data.',
                                'Warning',
                                { type : 'warning' }
                            );
                            return;
                        }

                        // 🔸 OTHER VALIDATION ERRORS
                        if (json.errors && typeof json.errors === 'object') {
                            const firstError = Object.values(json.errors)[0];
                            const msg = Array.isArray(firstError) ? firstError[0] : firstError;

                            that.$notify(msg, 'Warning', { type : 'warning' });
                            return;
                        }

                        that.$notify(
                            json.message || 'Upload failed.',
                            'Warning',
                            { type : 'warning' }
                        );
                        return;
                    }

                    // ⚠️ PARTIAL SUCCESS
                    if (json.warning === true) {
                        that.$notify(
                            json.message || 'Some products already exist.',
                            'Warning',
                            { type : 'warning' }
                        );

                        if (json.uploaded_count && json.uploaded_count > 0) {
                            that.$notify(
                                `${json.uploaded_count} product(s) uploaded successfully.`,
                                'Success',
                                { type : 'success' }
                            );
                        }

                        if (that.$refs.productTable) {
                            that.$refs.productTable.refreshTable();
                        }
                        return;
                    }

                    // ✅ SUCCESS
                    if (json.success === true || json.error === false) {
                        that.$notify(
                            json.message || 'Product catalogue uploaded successfully.',
                            'Success',
                            { type : 'success' }
                        );

                        if (that.$refs.productTable) {
                            that.$refs.productTable.refreshTable();
                        }
                        return;
                    }

                    that.$notify(
                        'Unexpected response from server.',
                        'Warning',
                        { type : 'warning' }
                    );
                })
                .catch(function () {
                    that.$notify(
                        'Upload failed. Please try again.',
                        'Error',
                        { type : 'danger' }
                    );
                })
                .finally(function () {
                    if (that.$refs.productUploadInput) {
                        that.$refs.productUploadInput.value = '';
                    }
                });
        },
        addProduct () {
            this.editingProduct = null;
            this.$refs.productModal.show();
        },
        editProduct (item) {
            const that = this;
            axios.form(this.productDetailsUrl, { id : item.id })
                .then(function (response) {
                    const json = response.data;
                    if (json.error === false) {
                        const product = Object.assign({}, json.data);

                        if (product.price_valid_till) {
                            const parts = product.price_valid_till.split('-');

                            if (parts.length === 3) {
                                const day = parts[0];
                                const month = parts[1];
                                let year = parts[2];

                                if (year.length === 2) {
                                    year = '20' + year;
                                }

                                product.price_valid_till = `${year}-${month}-${day}`;
                            }
                        }
                        that.editingProduct = product;
                        that.$refs.productModal.show();
                    }
                })
                .catch(function () {
                    that.$toast.error('Failed to load product details');
                });
        },
        viewProduct (item) {
            const that = this;
            axios.form(this.productDetailsUrl, { id : item.id })
                .then(function (response) {
                    const json = response.data;
                    if (json.error === false) {
                        that.viewingProduct = json.data;
                        that.$refs.productViewModal.show();
                    }
                })
                .catch(function (error) {
                    console.error('Error loading product details:', error);
                    that.$toast.error('Failed to load product details');
                });
        },
        confirmDeleteProduct (item) {
            if (confirm('Are you sure you want to delete "' + item.name + '"?')) {
                this.deleteProduct(item);
            }
        },

        deleteProduct (item) {
            const that = this;

            const formData = new FormData();
            formData.append('id', item.id);

            console.log('Deleting product:', item);

            axios.post(this.productDeleteUrl, formData)
                .then(function (response) {
                    console.log('Delete response:', response);

                    const json = response.data || {};

                    if (json.error === false || json.success === true || json.status === true) {
                        that.$notify(
                            json.message || 'Product deleted successfully',
                            'Success',
                            { type : 'success' }
                        );

                        if (that.$refs.productTable) {
                            that.$refs.productTable.refreshTable();
                        }

                        console.log('Product deleted, reloading products...');
                    } else {
                        that.$notify(
                            json.message || 'Failed to delete product',
                            'Warning',
                            { type : 'warning' }
                        );
                    }
                })
                .catch(function (error) {
                    console.error('Error deleting product:', error);

                    let errorMessage = 'Failed to delete product';

                    if (error.response && error.response.data) {
                        const errorData = error.response.data;
                        if (errorData.message) {
                            errorMessage = errorData.message;
                        } else if (errorData.errors && typeof errorData.errors === 'object') {
                            const firstError = Object.values(errorData.errors)[0];
                            errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
                        }
                    }

                    that.$notify(errorMessage, 'Error', { type : 'error' });
                });
        },
        productFormSuccess (response) {
            const refs = this.$refs;
            const that = this;

            if (response && response.data) {
                const data = response.data;

                if (data.success === false || data.error === true) {
                    this.productFormError(response);
                    return;
                }

                if (data.errors && typeof data.errors === 'object') {
                    this.productFormError(response);
                    return;
                }
            }

            const wasEditing = !!this.editingProduct;

            if (refs.productModal) {
                refs.productModal.close();
            }
            this.editingProduct = null;

            const successMessage = wasEditing ? 'Product updated successfully' : 'Product added successfully';
            that.$notify(successMessage, 'Success', { type : 'success' });

            if (that.$refs.productTable) {
                that.$refs.productTable.refreshTable();
            }

            console.log('Product save successful, reloading products...');
        },

        productFormError (error) {
            // const refs = this.$refs;
            console.error('Product form error:', error);
            let errorMsg = 'Error saving product. Please try again.';

            const errorData = error.response?.data || error.data;
            console.log('Error data:', errorData);

            if (errorData && errorData.errors && typeof errorData.errors === 'object') {
                // Get first error from errors object
                const firstErrorKey = Object.keys(errorData.errors)[0];
                const firstError = errorData.errors[firstErrorKey];
                errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
            } else if (errorData && errorData.message) {
                errorMsg = errorData.message;
            }

            this.$notify(errorMsg, 'Error', { type : 'warning' });
        },
        handleUploadError (data) {
            if (data && data.errors) {
                const firstError = Object.values(data.errors)[0];
                this.$toast.error(firstError);
            } else if (data && data.message) {
                this.$toast.error(data.message);
            } else {
                this.$toast.error('Invalid Excel file');
            }
        }
    }
};
</script>

<style scoped>
.form-control {
  border-radius: 5px;
}

input[type='text'] {
  font-family: monospace;
}

input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.table {
  margin-bottom: 0;
  border-collapse: collapse;
}

.table thead th {
  background-color: #f8f9fa;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
  padding: 12px 15px;
  text-align: left;
  vertical-align: middle;
}

.table tbody td {
  padding: 12px 15px;
  vertical-align: top;
  border-bottom: 1px solid #dee2e6;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.table tbody tr:last-child td {
  border-bottom: 1px solid #dee2e6;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 400px;
}

.mr-2 {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .table thead th,
  .table tbody td {
    padding: 8px 10px;
    font-size: 0.875rem;
  }

  .text-truncate {
    max-width: 200px;
  }
}

.text-muted {
  color: #6c757d;
}

.p-3 {
  padding: 1rem;
}

.currency-input {
  position: relative;
}

.currency-input::before {
  content: '₹';
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-weight: bold;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.table td {
  vertical-align: top;
}

.d-flex {
  display: flex;
}

.gap-2 {
  gap: 0.5rem;
}

/* Fix for vue-table-card component - ensures action buttons stay at top */
:deep(.vuetable) tbody td {
  vertical-align: top !important;
  padding-top: 12px !important;
}

:deep(.vuetable) .text-right {
  vertical-align: top !important;
}

/* Additional fix for all tables in component */
:deep(table) tbody td {
  vertical-align: top !important;
}
:deep(table th),
:deep(table td:nth-child(1)),
:deep(table td:nth-child(2)),
:deep(table td:nth-child(3)),
:deep(table td:nth-child(4)),
:deep(table td:nth-child(5)),
:deep(table td:nth-child(6)),
:deep(table td:nth-child(7)),
:deep(table td:nth-child(8)){  white-space: nowrap;}
/* Ensure action buttons container stays at top */
:deep(.action-btns) {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: flex-start;
}

/* Force vertical alignment for cells containing action buttons */
:deep(td:last-child) {
  vertical-align: top !important;
}
/* ... your existing styles ... */

/* Fix for Product View Modal - wrap long specification text */
:deep(.modal-body) .mb-2 p {
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  max-width: 100%;
}

/* Additional fix specifically for specification field */
:deep(.modal-body) div[class*="mb-2"]:has(strong:contains("Specification")) p,
:deep(.modal-body) .mb-2 p {
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  max-width: 100%;
  display: block;
}
</style>
