import Button from 'lego-framework/src/components/Button';
import DropdownButton from 'lego-framework/src/components/DropdownButton';
import DropDownItem from 'lego-framework/src/components/DropDownItem';
import Modal from 'lego-framework/src/containers/Modal';
import Tabs from 'lego-framework/src/containers/Tabs';
import Tab from 'lego-framework/src/containers/Tab';
import ClickOutside from 'lego-framework/src/directives/click-outside';
import FormInput from 'lego-framework/src/forms/FormInput';
import FormSelect from 'lego-framework/src/forms/FormSelect';
import FormCheckbox from 'lego-framework/src/forms/FormCheckbox';
import FormAjaxSelect from 'lego-framework/src/forms/FormAjaxSelect';
import FormDatePicker from 'lego-framework/src/forms/FormDatePicker';
import FormTextArea from 'lego-framework/src/forms/FormTextArea';
import FormFileInput from 'lego-framework/src/forms/FormFileInput';
import DatePicker from 'vue2-datepicker';
import StatLayout1 from '@lego/modules/stats/DashboardStats';

import Form from 'lego-framework/src/forms/PostForm';
import SimpleForm from 'lego-framework/src/forms/SimpleForm';

import VueTable from 'lego-framework/src/tables/VueTable';
import VueTableCard from 'lego-framework/src/tables/VueTableCard';
import SimpleTable from 'lego-framework/src/tables/SimpleTable';

import ErrorIcon from 'lego-framework/src/svg-icons/ErrorIcon';
import SuccessIcon from 'lego-framework/src/svg-icons/SuccessIcon';
import LoadingAnimation from 'lego-framework/src/svg-icons/LoadingAnimation';

import * as validator from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import { messages } from 'vee-validate/dist/locale/en.json';

import EditButton from 'lego-framework/src/components/EditButton';
import DeleteButton from 'lego-framework/src/components/DeleteButton';
import SaveButton from 'lego-framework/src/components/SaveButton';

import DeleteModal from '@/component/DeleteModal';

import AjaxView from 'lego-framework/src/ajax/AjaxView';
import NotificationsPlugin from 'lego-framework/src/notification';
import CustomDropdownButton from '../component/CustomDropdownButton';
import CustomPasswordInput from '../component/CustomPasswordInput';
import CheckPermission from '../component/CheckPermission';

export default {
    install : function (Vue) {
        Vue.use(ClickOutside);

        Vue.component('check-permission', CheckPermission);
        Vue.component('StatLayout1', StatLayout1);
        Vue.component('btn', Button);
        Vue.component('drop-btn', DropdownButton);
        Vue.component('custom-drop-btn', CustomDropdownButton);
        Vue.component('custom-password-input', CustomPasswordInput);
        Vue.component('drop-down-button', DropdownButton);
        Vue.component('drop-down-item', DropDownItem);
        Vue.use(NotificationsPlugin);
        Vue.component('edit-btn', EditButton);
        Vue.component('delete-btn', DeleteButton);
        Vue.component('save-btn', SaveButton);
        Vue.component('tabs', Tabs);
        Vue.component('tab', Tab);
        Vue.component('modal', Modal);
        Vue.component('delete-modal', DeleteModal);

        Vue.component('b-form', Form);
        Vue.component('s-form', SimpleForm);

        Vue.component('checkbox-input', FormCheckbox);
        Vue.component('textarea-input', FormTextArea);
        Vue.component('validated-input', FormInput);
        Vue.component('validated-select', FormSelect);
        Vue.component('validated-vue-select', FormSelect);
        Vue.component('validated-ajax-vue-select', FormAjaxSelect);
        Vue.component('validated-date-picker', FormDatePicker);
        Vue.component('validated-file-input', FormFileInput);
        Vue.component('date-picker', DatePicker);

        Vue.component('vue-table', VueTable);
        Vue.component('vue-table-card', VueTableCard);
        Vue.component('simple-table', SimpleTable);

        Vue.component('error-icon', ErrorIcon);
        Vue.component('success-icon', SuccessIcon);
        Vue.component('loading-animation', LoadingAnimation);

        Vue.component('ajax-view', AjaxView);

        Vue.component('validation-provider', validator.ValidationProvider);
        Vue.component('validation-observer', validator.ValidationObserver);

        Object.keys(rules).forEach(rule => {
            validator.extend(rule, {
                ...rules[rule], // copies rule configuration
                message : messages[rule] // assign message
            });
        });
    }
};
