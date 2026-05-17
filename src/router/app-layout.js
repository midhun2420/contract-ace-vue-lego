import gurads from '@/router/guards';
import store from '@/store';

// Admin Components
import Editor from '../views/Editor';
import AdminHome from '../views/CustomHomePage/AdminHome';

// Master Data Section
import MasterData from '../views/Admin/MasterData/MasterData';
import ProfileMasterData from '../views/Admin/MasterData/ProfileMasterData/ProfileMasterData';
import Role from '../views/Admin/Role/Role';
import StandardTemplates from '../views/Admin/StandardTemplates/StandardTemplate';
import Package from '../views/Admin/Packages/Package.vue';

// Company Section
import Company from '../views/Admin/Company/Company';
import CompanyDetails from '../views/Admin/Company/CompanyDetails';

// User Section
import UsersList from '../views/Admin/Users/Users';
import CompanyUsersList from '../views/Consumer/Users/Users';
import UserDetails from '../views/Admin/Users/UserDetails';

// Website
import KnowledgeHubList from '../views/Admin/KnowledgeHub/KnowledgeHubList';
import TrainingVideoList from '../views/Admin/TrainingVideo/TrainingVideoList';

import Tender from '../views/Consumer/Tender/Tender';
import ArchiveTender from '../views/Consumer/Tender/ArchiveTender';
import MyBid from '../views/Consumer/Bids/MyBids';
import MyTemplate from '../views/Consumer/MyTemplates/MyTemplate';
import Message from '../views/Consumer/Messages';
import MyProfile from '../views/Consumer/Profile/MyProfile';
import ChangePassword from '../views/Auth/ChangePassword';
import Logout from '../views/Auth/Logout';
import TenderDetails from '../views/Consumer/Tender/TenderDetails';
import BidDetails from '../views/Consumer/Bids/BidDetails';
import DetailsPage from '../views/Consumer/MyContacts/DetailsPage';
import ViewPage from '../views/Consumer/MyContacts/ViewPage';
import TermsAndCondition from '../views/Admin/MasterData/TermsAndCondition';
import MyTemplatePreview from '../views/Consumer/MyTemplates/MyTemplatePreview';
import MyTemplateDetails from '../views/Consumer/MyTemplates/MyTemplateDetails';
import StandardTemplateDetails from '../views/Admin/StandardTemplates/StandardTemplateDetails';
import StandardTemplatePreview from '../views/Admin/StandardTemplates/StandardTemplatePreview';
import StandardTemplateEditor from '../views/Admin/StandardTemplates/StandardTemplateEditor';
import StandardTemplateBidPreview from '../views/Admin/StandardTemplates/StandardTemplateBidPreview';
import TenderPreview from '../views/Consumer/Tender/TenderPreview';
import BidPreview from '../views/Consumer/Bids/BidPreview';
import BidderDetails from '../views/Consumer/Tender/BidderDetails';
import BidderAnalysis from '../views/Consumer/Tender/Analysis/ViewPage';
import BiddersChat from '../views/Consumer/Tender/BiddersChat';
import BiddersChats from '../views/Consumer/Bids/BiddersChat';

// Admin Reports
import UserReports from '../views/Admin/Reports/UserReports';
import UserAcquisitionReports from '../views/Admin/Reports/UserAcquisitionReports';
import StandardTemplateReports from '../views/Admin/Reports/StandardTemplateReports';
import CompanyReports from '../views/Admin/Reports/CompanyReports';
import MyTemplateReports from '../views/Admin/Reports/MyTemplateReports';

// Consumer Reports
import ConsumerUserReports from '../views/Consumer/Reports/UserReports';
import ConsumerTenderReports from '../views/Consumer/Reports/TenderReports';
import MyContactReports from '../views/Consumer/Reports/MyContactReports';
import ConsumerStandardTemplateReports from '../views/Consumer/Reports/StandardTemplateReports';
import ConsumerMyTemplateReports from '../views/Consumer/Reports/MyTemplateReports';
import ConsumerBidReports from '../views/Consumer/Reports/BidReports';
import Projects from '../views/Consumer/Project/Projects.vue';
import ProjectDetails from '../views/Consumer/Project/ProjectDetails.vue';
import Dashboard from '../views/Dashboard2/Dashboard.vue';
import ConsumerHome from '../views/CustomHomePage/ConsumerHome.vue';

const Layout = () => import(/* webpackChunkName: "layout" */ '../layouts/MainLayout');
const About = () => import(/* webpackChunkName: "home" */ '../views/About');

export default {
    path        : '/',
    name        : 'DashboardLayout',
    redirect    : '/app/',
    component   : Layout,
    beforeEnter : gurads.loggedInGuard,
    children    : [
        {
            path        : '/app/',
            name        : 'Home',
            component   : null, // Dynamic component based on user type
            beforeEnter : (to, from, next) => {
                const user = store.getters.currentUser;

                // Admin directly shows AdminHome at /app/
                if (user?.admin === true) {
                    // Set component to AdminHome and continue
                    to.matched[to.matched.length - 1].components.default = AdminHome;
                    next();
                    return;
                }

                // User: Check dashboard package
                if (user?.packages?.dashboard === true || user?.packages?.dashboard === 'true') {
                    // Project-wise Dashboard
                    to.matched[to.matched.length - 1].components.default = Dashboard;
                } else {
                    // Standard Dashboard
                    to.matched[to.matched.length - 1].components.default = ConsumerHome;
                }
                next();
            }
        },
        {
            path      : '/app/admin/dashboard',
            name      : 'AdminDashboard',
            component : AdminHome
        },
        {
            path      : '/app/dashboard',
            name      : 'UserDashboard',
            component : Dashboard
        },
        {
            path      : '/app/editor/',
            name      : 'Editor',
            component : Editor
        },
        {
            path      : '/app/logout/',
            name      : 'Logout',
            component : Logout
        },
        {
            path      : '/app/change-password/',
            name      : 'ChangePassword',
            component : ChangePassword
        },
        {
            path      : '/app/master-data/',
            name      : 'MasterData',
            component : MasterData
        },
        {
            path      : '/app/profile-master-data/',
            name      : 'ProfileMasterData',
            component : ProfileMasterData
        },
        {
            path      : '/app/role/',
            name      : 'Role',
            component : Role
        },
        {
            path      : '/app/packages/',
            name      : 'Package',
            component : Package
        },
        {
            path      : '/app/terms/',
            name      : 'TermsAndConditions',
            component : TermsAndCondition
        },
        {
            path      : '/app/standard-templates/',
            name      : 'StandardTemplates',
            component : StandardTemplates
        },
        {
            path      : '/app/company-list/',
            name      : 'Company',
            component : Company
        },
        {
            path      : '/app/company/:id/details/',
            name      : 'CompanyDetails',
            component : CompanyDetails
        },
        {
            path      : '/app/my-contacts/:id/details/',
            name      : 'MyContactsDetailsPage',
            component : DetailsPage
        },
        {
            path      : '/app/my-contacts/',
            name      : 'MyContacts',
            component : ViewPage
        },
        {
            path      : '/app/user-list/',
            name      : 'UsersList',
            component : UsersList
        },
        {
            path      : '/app/project/',
            name      : 'Projects',
            component : Projects
        },
        {
            path      : '/app/project/:id/details/',
            name      : 'ProjectDetails',
            component : ProjectDetails
        },
        {
            path      : '/app/company-user-list/',
            name      : 'CompanyUsersList',
            component : CompanyUsersList
        },
        {
            path      : '/app/user/:id/details/',
            name      : 'UserDetails',
            component : UserDetails
        },
        {
            path      : '/app/parent/:id/tender/',
            name      : 'ParentTender',
            component : Tender
        },
        {
            path      : '/app/tender/',
            name      : 'Tender',
            component : Tender
        },
        {
            path      : '/app/archived/tender/',
            name      : 'ArchiveTender',
            component : ArchiveTender
        },
        {
            path      : '/app/archived-tender/:id/details/',
            name      : 'ArchivedTenderDetails',
            component : TenderDetails
        },
        {
            path      : '/app/archived/parent/:id/tender/', // ← unique path
            name      : 'ArchivedAmendTenders',
            component : () => import('@/views/Consumer/Tender/ArchivedAmendTenders.vue')
        },
        {
            path      : '/app/tender/:id/details/',
            name      : 'TenderDetails',
            component : TenderDetails
        },
        {
            path      : '/app/tender/:id/details/:goto/',
            name      : 'TenderDetailsWithGoto',
            component : TenderDetails
        },
        {
            path      : '/app/tender/:id/preview/',
            name      : 'TenderPreview',
            component : TenderPreview
        },
        {
            path      : '/app/archived-tender/:id/preview/',
            name      : 'ArchivedTenderPreview',
            component : TenderPreview
        },
        {
            path      : '/app/bid/:id/preview/',
            name      : 'BidPreview',
            component : BidPreview
        },
        {
            path      : '/app/bidder/:id/details/',
            name      : 'BidderDetails',
            component : BidderDetails
        },
        {
            path      : '/app/bidder/:id/analysis/',
            name      : 'BidderAnalysis',
            component : BidderAnalysis
        },
        {
            path      : '/app/bidder/:id/chat/',
            name      : 'BidderChat',
            component : BiddersChats
        },
        {
            path      : '/app/bidder/:id/chat/:t_id/',
            name      : 'BidderChatWithTender',
            component : BiddersChat
        },
        {
            path      : '/app/my-template/:id/preview/',
            name      : 'MyTemplatePreview',
            component : MyTemplatePreview
        },
        {
            path      : '/app/my-template/:id/details/',
            name      : 'MyTemplateDetails',
            component : MyTemplateDetails
        },
        {
            path      : '/app/standard-template/:id/details/',
            name      : 'StandardTemplateDetails',
            component : StandardTemplateDetails
        },
        {
            path      : '/app/standard-template/:id/preview/',
            name      : 'StandardTemplatePreview',
            component : StandardTemplatePreview
        },
        {
            path      : '/app/standard-template/:id/editor/',
            name      : 'StandardTemplateEditor',
            component : StandardTemplateEditor
        },
        {
            path      : '/app/standard-template/:id/bid-view/',
            name      : 'StandardTemplateBidPreview',
            component : StandardTemplateBidPreview
        },
        {
            path      : '/app/bid/:id/details/',
            name      : 'BidDetails',
            component : BidDetails
        },
        {
            path      : '/app/my-bid/',
            name      : 'MyBid',
            component : MyBid
        },
        {
            path      : '/app/my-template/',
            name      : 'MyTemplate',
            component : MyTemplate
        },
        {
            path      : '/app/message/',
            name      : 'Message',
            component : Message
        },
        {
            path      : '/app/my-profile/',
            name      : 'MyProfile',
            component : MyProfile
        },
        {
            path      : '/app/user-reports/',
            name      : 'UserReports',
            component : UserReports
        },
        {
            path      : '/app/user-acquisition-reports/',
            name      : 'UserAcquisitionReports',
            component : UserAcquisitionReports
        },
        {
            path      : '/app/company-reports/',
            name      : 'CompanyReports',
            component : CompanyReports
        },
        {
            path      : '/app/standard-template-reports/',
            name      : 'StandardTemplateReports',
            component : StandardTemplateReports
        },
        {
            path      : '/app/my-template-reports/',
            name      : 'MyTemplateReports',
            component : MyTemplateReports
        },
        {
            path      : '/app/consumer/user-reports/',
            name      : 'ConsumerUserReports',
            component : ConsumerUserReports
        },
        {
            path      : '/app/consumer/tender-reports/',
            name      : 'ConsumerTenderReports',
            component : ConsumerTenderReports
        },
        {
            path      : '/app/consumer/my-contact-reports/',
            name      : 'MyContactReports',
            component : MyContactReports
        },
        {
            path      : '/app/consumer/standard-template-reports/',
            name      : 'ConsumerStandardTemplateReports',
            component : ConsumerStandardTemplateReports
        },
        {
            path      : '/app/consumer/my-template-reports/',
            name      : 'ConsumerMyTemplateReports',
            component : ConsumerMyTemplateReports
        },
        {
            path      : '/app/consumer/bid-reports/',
            name      : 'ConsumerBidReports',
            component : ConsumerBidReports
        },
        {
            path      : '/about/',
            name      : 'About',
            component : About
        },
        {
            path      : '/website/knowledge-hub/',
            name      : 'KnowledgeHubList',
            component : KnowledgeHubList
        },
        {
            path      : '/website/training-video/',
            name      : 'TrainingVideoList',
            component : TrainingVideoList
        },
        {
            path      : '/company/',
            name      : 'CompanyPage',
            component : () => import(/* webpackChunkName: "home" */ '../views/Company')
        }
    ]
};
