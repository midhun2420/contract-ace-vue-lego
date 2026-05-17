import Modal from 'lego-framework/src/ajax/ConfirmPostModal';
export default {
    extends : Modal,
    props   : {
        // color: { type: String, default: 'danger-700' },
        width             : { type : String, default : '30r' },
        title             : { type : String, default : 'Delete' },
        headerColor       : { type : String, default : 'danger' },
        bodyColor         : { type : String, default : 'danger' },
        dialog            : { type : Boolean, default : true },
        okButton          : { type : String, default : 'Delete' },
        cancelButton      : { type : String, default : 'No' },
        okButtonColor     : { type : String, default : 'danger' },
        cancelButtonColor : { type : String, default : 'success' }
    }
};
