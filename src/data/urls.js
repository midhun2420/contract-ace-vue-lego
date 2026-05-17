// @/data/urls.js - COMPLETE URLS FILE WITH DOCUMENT MANAGEMENT

const prod = process.env.NODE_ENV === 'production';

let baseUrl;
if (prod) {
    baseUrl = '/';
} else {
    baseUrl = '/';
}

export default {
    auth : {
        authUser       : baseUrl + 'users/auth-user/',
        login          : baseUrl + 'users/login/',
        logout         : baseUrl + 'users/logout/',
        status         : baseUrl + 'users/status/',
        changePassword : baseUrl + 'users/change-password/'
    },
    forgotPassword : {
        sentOtp        : baseUrl + 'users/forgot-password/send-mail/',
        validateOtp    : baseUrl + 'users/forgot-password/validate-otp/',
        changePassword : baseUrl + 'users/forgot-password/change-password/'
    },
    Admin : {
        Reports : {
            userList                     : baseUrl + 'users/admin/user-report/list/',
            userListDownload             : baseUrl + 'users/admin/user-report/download/',
            userAcquisitionList          : baseUrl + 'users/admin/acquisition-report/list/',
            userAcquisitionChartList     : baseUrl + 'users/admin/acquisition-report/chart/',
            userAcquisitionListDownload  : baseUrl + 'users/admin/acquisition-report/download/',
            companyList                  : baseUrl + 'users/admin/company-report/list/',
            companyListDownload          : baseUrl + 'users/admin/company-report/download/',
            standardTemplateList         : baseUrl + 'users/admin/standard-template-report/list/',
            standardTemplateListDownload : baseUrl + 'users/admin/standard-template-report/download/',
            myTemplateList               : baseUrl + 'users/admin/my-template-report/list/',
            myTemplateListDownload       : baseUrl + 'users/admin/my-template-report/download/'
        },
        DashBoard : {
            details     : baseUrl + 'users/dashboard/',
            addEvent    : baseUrl + 'users/calendar/create/',
            deleteEvent : baseUrl + 'users/calendar/delete/'
        },
        MasterData : {
            Role : {
                addEdit          : baseUrl + 'users/role/create/',
                details          : baseUrl + 'users/role/permission-list/',
                delete           : baseUrl + 'users/role/delete/',
                changePermission : baseUrl + 'users/role/permission-add/'
            },
            Package : {
                list             : baseUrl + 'master-data/package/list/',
                addEdit          : baseUrl + 'master-data/package/add-edit/',
                enableDisable    : baseUrl + 'master-data/package/enable-disable/',
                featureList      : baseUrl + 'master-data/package/feature-list/',
                featureAdd       : baseUrl + 'master-data/package/feature-add/',
                featureDelete    : baseUrl + 'master-data/package/feature-delete/',
                changePermission : baseUrl + 'master-data/package/change-permission/',
                packageOptions   : baseUrl + 'master-data/package/vue-select/'
            },
            Terms : {
                add  : baseUrl + 'master-data/terms-and-condition/create/',
                view : baseUrl + 'master-data/terms-and-condition/list/'
            },
            Country : {
                addEdit : baseUrl + 'master-data/country/create/',
                list    : baseUrl + 'master-data/country/list/',
                delete  : baseUrl + 'master-data/country/delete/'
            },
            State : {
                addEdit        : baseUrl + 'master-data/state/create/',
                list           : baseUrl + 'master-data/state/list/',
                delete         : baseUrl + 'master-data/state/delete/',
                countryOptions : baseUrl + 'master-data/country/vue-select/'
            },
            District : {
                addEdit         : baseUrl + 'master-data/district/create/',
                list            : baseUrl + 'master-data/district/list/',
                delete          : baseUrl + 'master-data/district/delete/',
                stateOptions    : baseUrl + 'master-data/state/vue-select/',
                districtOptions : baseUrl + 'master-data/district/vue-select/'
            },
            VendorCategory : {
                addEdit : baseUrl + 'master-data/vendor-category/create/',
                list    : baseUrl + 'master-data/vendor-category/list/',
                delete  : baseUrl + 'master-data/vendor-category/delete/'
            },
            ProfileMasterData : {
                Industry : {
                    addEdit : baseUrl + 'master-data/industry/create/',
                    list    : baseUrl + 'master-data/industry/list/',
                    delete  : baseUrl + 'master-data/industry/delete/'
                },
                Service : {
                    addEdit : baseUrl + 'master-data/service/create/',
                    list    : baseUrl + 'master-data/service/list/',
                    delete  : baseUrl + 'master-data/service/delete/'
                },
                AreaOfService : {
                    addEdit : baseUrl + 'master-data/area-of-service/create/',
                    list    : baseUrl + 'master-data/area-of-service/list/',
                    delete  : baseUrl + 'master-data/area-of-service/delete/'
                }
            }
        },
        Company : {
            orderUpdate : baseUrl + 'company/company/order-create/',
            addEdit     : baseUrl + 'company/company-information/create/',
            list        : baseUrl + 'company/company-information/list/',
            details     : baseUrl + 'company/company-information/details/',
            suspend     : baseUrl + 'company/company/suspend/',
            delete      : baseUrl + 'company/company/delete/',
            update      : baseUrl + 'company/company-information/update/',

            vendorCategoryOptions  : baseUrl + 'master-data/vendor-category/vue-select/',
            industryOptions        : baseUrl + 'master-data/industry/vue-select/',
            areaOfOperationOptions : baseUrl + 'master-data/area-of-service/vue-select/',
            servicesOptions        : baseUrl + 'master-data/service/vue-select/',
            stateOptions           : baseUrl + 'master-data/state/vue-select/',
            countryOptions         : baseUrl + 'master-data/country/vue-select/',
            districtOption         : baseUrl + 'master-data/district/vue-select/'
        },
        StandardTemplate : {
            import  : baseUrl + 'tender/standard-template-import/',
            details : baseUrl + 'tender/standard-template/details/',
            list    : baseUrl + 'tender/standard-template/list/',
            addEdit : baseUrl + 'tender/standard-template/create/',
            delete  : baseUrl + 'tender/standard-template/delete/',
            publish : baseUrl + 'tender/standard-template/publish/'
        },
        User : {
            addEdit  : baseUrl + 'users/company-user/create/',
            editRole : baseUrl + 'users/role/edit/',
            list     : baseUrl + 'users/list/',
            details  : baseUrl + 'users/user-details/',
            suspend  : baseUrl + 'users/suspend/',
            delete   : baseUrl + 'users/delete/',

            reportRoleOptions : baseUrl + 'users/report-role/vue-select/',
            roleOptions       : baseUrl + 'users/role/vue-select/',
            companyOptions    : baseUrl + 'company/company/vue-select/'
        },
        Website : {
            KnowledgeHub : {
                Vuelist        : baseUrl + 'website/faq/table/list/',
                list           : baseUrl + 'website/faq/list/',
                add            : baseUrl + 'website/faq/add/edit/',
                EnableOrDiable : baseUrl + 'website/faq/enable-disable/',
                delete         : baseUrl + 'website/faq/delete/'
            },
            TrainingVideo : {
                Vuelist        : baseUrl + 'website/video/table/list/',
                list           : baseUrl + 'website/video/list/',
                add            : baseUrl + 'website/video/add/edit/',
                EnableOrDiable : baseUrl + 'website/video/enable-disable/',
                delete         : baseUrl + 'website/video/delete/'
            },
            ContactUs : {
                Vuelist : baseUrl + 'website/enquiry/table/list/',
                list    : baseUrl + 'website/faq/list/',
                add     : baseUrl + 'website/enquiry/add/edit/'
            }
        }
    },
    Consumer : {
        Reports : {
            userList                     : baseUrl + 'users/user-report-list/',
            userListDownload             : baseUrl + 'users/user-report/',
            tenderList                   : baseUrl + 'users/tender-report-list/',
            tenderSummaryDownload        : baseUrl + 'users/tender-report/',
            tenderDetailedDownload       : baseUrl + 'users/tender-detail-report/',
            bidList                      : baseUrl + 'users/my-bid-list/',
            bidListDownload              : baseUrl + 'users/my-bid-report/',
            standardTemplateList         : baseUrl + 'tender/standard-template/list/',
            standardTemplateListDownload : baseUrl + 'users/standard-template-report/',
            myTemplateList               : baseUrl + 'tender/my-template/list/',
            myTemplateListDownload       : baseUrl + 'users/my-template-report/',
            vendorList                   : baseUrl + 'users/mycontact-report-list/',
            vendorListUserDownload       : baseUrl + 'users/mycontact-report/'
        },
        DashBoard : {
            details  : baseUrl + 'users/dashboard/',
            addEvent : baseUrl + 'users/add-event/'
        },
        Registration : {
            personalDetails : baseUrl + 'users/create/',
            companyDetails  : baseUrl + 'users/registration/'
        },
        Message : {
            list : baseUrl + 'users/messages/'
        },
        MyContact : {
            myContactList        : baseUrl + 'users/my-contact/list/',
            companyList          : baseUrl + 'users/my-contact/company-list/',
            addToMyContacts      : baseUrl + 'users/my-contact/create/',
            removeFromMyContacts : baseUrl + 'users/my-contact/delete/',

            tenderNumberOptionsUrl : baseUrl + 'users/send-invitation/tender-vue-select/',
            createInvitation       : baseUrl + 'users/create-invitation/',
            sendInvitation         : baseUrl + 'users/send-invitation/',
            sendInvitationDelete   : baseUrl + 'users/send-invitation-delete/',
            sendInvitationList     : baseUrl + 'users/send-invitation-list/'
        },
        Tender : {
            unlockBidder    : baseUrl + 'tender/bid/unlock/',
            archiveTender   : baseUrl + 'tender/tender/archive/',
            archiveList     : baseUrl + 'tender/archive/tender/list/',
            create          : baseUrl + 'tender/tender-create/',
            getJson         : baseUrl + 'tender/tender-export/',
            save            : baseUrl + 'tender/tender-save/',
            delete          : baseUrl + 'tender/tender/delete/',
            list            : baseUrl + 'tender/tender/list/',
            amendList       : baseUrl + 'tender/archive-amend/tender/list/',
            details         : baseUrl + 'tender/tender/details/',
            closeDate       : baseUrl + 'tender/tender-closed-date-update/',
            uploadFile      : baseUrl + 'tender/tender-attachments/create/',
            uploadFileList  : baseUrl + 'tender/tender-attachments/list/',
            deleteFile      : baseUrl + 'tender/tender-attachments/delete/',
            uploadExcelFile : baseUrl + 'tender/tender-save-excel/',

            importFile                   : baseUrl + 'tender/tender-import/',
            Print                        : baseUrl + 'tender/pdf-download/',
            DownloadAnalysis             : baseUrl + 'tender/analysis-download/',
            TechnicalAnalysisView        : baseUrl + 'tender/technical-analysis/',
            ChartAnalysisView            : baseUrl + 'tender/chart-analysis/',
            CumulativeAnalysisView       : baseUrl + 'tender/cumulative-analysis/',
            ComparisonAmountAnalysisView : baseUrl + 'tender/comparison-amount-analysis/',
            ComparisonAnalysisView       : baseUrl + 'tender/comparison-analysis/',
            FinalizeBidder               : baseUrl + 'tender/finalize/',
            FinalizedBiddersList         : baseUrl + 'tender/analysis-finalize/',

            bidderResponseList : baseUrl + 'tender/submitted-bidders/list/',
            bidderList         : baseUrl + 'tender/bidders/list/',
            bidderAdd          : baseUrl + 'tender/tender/publish/',
            bidderDelete       : baseUrl + 'tender/bidder/delete/',
            bidderOptions      : baseUrl + 'company/company/vue-select/',

            cancelTender  : baseUrl + 'tender/tender/cancel/',
            publishTender : baseUrl + 'tender/tender/publish/',
            inviteTender  : baseUrl + 'tender/bid/create/',
            saveTender    : baseUrl + 'tender/tender/details/',
            sendMessage   : baseUrl + 'tender/chat-create/',
            chat          : baseUrl + 'tender/chat-list/',
            printChat     : baseUrl + 'tender/chat-print/'
        },
        Company : {
            addEdit : baseUrl + 'company/company-information/update/',
            list    : baseUrl + 'company/company-information/list/',
            details : baseUrl + 'company/company-information/details/',
            delete  : baseUrl + 'company/company/delete/',

            // ======================================
            // PRODUCT CATALOGUE URLs
            // ======================================
            productCatalogueAddEdit        : baseUrl + 'company/company/product-catalogue-add/',
            productCatalogueList           : baseUrl + 'company/company/product-catalogue-list/',
            vendorCatalogueList            : baseUrl + 'company/company/vendor-catalogue-list/',
            productCatalogueDelete         : baseUrl + 'company/company/product-catalogue-delete/',
            productCatalogueVueSelect      : baseUrl + 'company/company/product-catalogue-vue-select/',
            productCatalogueDetails        : baseUrl + 'company/company/product-catalogue-details/',
            productCatalogueFormatDownload : baseUrl + 'company/company/product-catalogue-format/',
            productCatalogueUpload         : baseUrl + 'company/company/product-catalogue-upload/',
            productCatalogueDownload       : baseUrl + 'company/company/catalogue-download/',

            // ======================================
            // COMPANY OPTIONS
            // ======================================
            vendorCategoryOptions  : baseUrl + 'master-data/vendor-category/vue-select/',
            industryOptions        : baseUrl + 'master-data/industry/vue-select/',
            areaOfOperationOptions : baseUrl + 'master-data/area-of-service/vue-select/',
            servicesOptions        : baseUrl + 'master-data/service/vue-select/',
            stateOptions           : baseUrl + 'master-data/state/vue-select/',
            countryOptions         : baseUrl + 'master-data/country/vue-select/',
            districtOptions        : baseUrl + 'master-data/district/vue-select/',

            // ======================================
            // DOCUMENT MANAGEMENT URLs - NEW
            // ======================================
            documentAdd       : baseUrl + 'company/company/documents-add/',
            documentList      : baseUrl + 'company/company/documents-list/',
            documentDelete    : baseUrl + 'company/company/documents-delete/',
            documentEdit      : baseUrl + 'company/company/documents-edit/',
            documentVueSelect : baseUrl + 'company/company/documents-vue-select/'

        },

        User : {
            addEdit : baseUrl + 'users/company-user/create/',
            list    : baseUrl + 'users/list/',
            details : baseUrl + 'users/details/',

            roleOptions    : baseUrl + 'users/role/vue-select/',
            companyOptions : baseUrl + 'company/company/vue-select/',
            generateOTPUrl : baseUrl + 'users/otp-send/',
            verifyOtpUrl   : baseUrl + 'users/otp-validation/'
        },
        Profile : {
            addEdit     : baseUrl + 'users/profile/update/',
            details     : baseUrl + 'users/user-profile-details/',
            roleOptions : baseUrl + 'users/role/vue-select/'
        },

        Vendor : {
            list                   : baseUrl + '',
            details                : baseUrl + '',
            vendorCategoryOptions  : baseUrl + 'master-data/vendor-category/vue-select/',
            areaOfOperationOptions : baseUrl + 'master-data/area-of-service/vue-select/'
        },
        MyTemplate : {
            details : baseUrl + 'tender/my-template/details/',
            list    : baseUrl + 'tender/my-template/list/',
            addEdit : baseUrl + 'tender/my-template/create/',
            delete  : baseUrl + 'tender/my-template/delete/',
            suspend : baseUrl + 'tender/my-template/suspend/'
        },
        MyBid : {
            submitBid          : baseUrl + 'tender/bid/accept/',
            rejectTender       : baseUrl + 'tender/bid/reject/',
            list               : baseUrl + 'tender/bid/list/',
            details            : baseUrl + 'tender/bid/details/',
            tender_bid_details : baseUrl + 'tender/bid-tender/details/',
            bidUpdate          : baseUrl + 'tender/bid/update/',
            chat               : baseUrl + 'tender/chat-list/',
            Print              : baseUrl + 'tender/pdf-download/',
            printChat          : baseUrl + 'tender/print-chat/'
        },
        Projects : {
            addedit    : baseUrl + 'company/company/projects-add/',
            list       : baseUrl + 'company/company/projects-list/',
            delete     : baseUrl + 'company/company/projects-delete/',
            details    : baseUrl + 'company/company/projects-details/',
            Select     : baseUrl + 'company/company/projects-vue-select/',
            Count      : baseUrl + 'company/company/project-count/',
            SelectView : baseUrl + 'company/company/projects-exclude-vue-select/'
        }
    }
};
