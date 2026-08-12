import store from '@/store';

const getUserName = function (name) {
    if (!name) return '';

    if (name.length > 10) {
        return name.substring(0, 10) + '..';
    } else {
        return name;
    }
};

// Helper function to check if a package is enabled
const isEnabled = (value) => value === true || value === 'true';

const getMenu = function () {
    const user = store.getters.currentUser || {};
    console.log('user in getMenu:', user);
    // admin login null issue fix
    user.packages = user.packages || {};

    /* ================= ADMIN MENU ================= */
    const adminMenu = [
        {
            icon : 'fa fa-tachometer',
            text : 'Dashboard',
            link : '/app/' // Admin directly goes to /app/ which shows AdminHome
        },
        {
            icon  : 'fa fa-database',
            text  : 'Admin Master Data',
            link  : '#',
            items : [
                { text : 'Master Data', link : '/app/master-data/' },
                { text : 'Profile Master Data', link : '/app/profile-master-data/' },
                { text : 'Role', link : '/app/role/' },
                { text : 'Terms and Conditions', link : '/app/terms/' },
                { text : 'Packages', link : '/app/packages/' }
            ]
        },
        {
            icon : 'fa fa-building',
            text : 'Company',
            link : '/app/company-list/'
        },
        {
            icon : 'fa fa-newspaper-o',
            text : 'Standard Templates',
            link : '/app/standard-templates/'
        },
        {
            icon  : 'fa fa-desktop',
            text  : 'Website',
            link  : '#',
            items : [
                { text : 'Training Video', link : '/website/training-video/' },
                { text : 'Knowledge Hub', link : '/website/knowledge-hub/' }
            ]
        },
        {
            icon  : 'fa fa-file-archive-o',
            text  : 'Reports',
            link  : '#',
            items : [
                { text : 'User Reports', link : '/app/user-reports/' },
                { text : 'User Acquisition Reports', link : '/app/user-acquisition-reports/' },
                { text : 'My Template Reports', link : '/app/my-template-reports/' },
                { text : 'Standard Template Reports', link : '/app/standard-template-reports/' },
                { text : 'Company Reports', link : '/app/company-reports/' }
            ]
        },
        { type : 'separator' },
        {
            icon  : 'fa fa-user-o',
            text  : getUserName(user.name),
            title : user.name,
            link  : '#',
            items : [
                { text : 'Change Password', link : '/app/change-password/' },
                { text : 'Logout', link : '/app/logout/' }
            ]
        }
    ];

    /* ================= USER MENU ================= */

    const templateItems = [
        ...(isEnabled(user.packages.customised_templates)
            ? [{ text : 'My Templates', link : '/app/my-template/' }]
            : []),

        ...(isEnabled(user.packages.standard_template)
            ? [{ text : 'Standard Templates', link : '/app/standard-templates/' }]
            : [])
    ];

    // ✅ Check if projectwise dashboard is enabled
    // dashboard = true: Shows Dashboard.vue (Projectwise Dashboard)
    // dashboard = false: Shows ConsumerHome.vue (Standard Dashboard)
    const isProjectwiseDashboard = isEnabled(user.packages.dashboard);

    // ✅ Check if projectwise tender tab is enabled
    const isProjectwiseTenderTab = isEnabled(user.packages.projectwise_tendertab);

    const menu = [
        // Dashboard link based on package
        {
            icon : 'fa fa-tachometer',
            text : 'Dashboard',
            link : isProjectwiseDashboard ? '/app/dashboard' : '/app/'
            // dashboard = true: /app/dashboard (Project-wise Dashboard.vue)
            // dashboard = false: /app/ (Standard ConsumerHome.vue)
        },

        // Show Users tab only if users package is enabled
        ...(isEnabled(user.packages.users) ? [{
            icon : 'fa fa-users',
            text : 'Users',
            link : '/app/company-user-list/'
        }] : []),

        // ✅ Show Projects tab ONLY when projectwise_tendertab is TRUE
        ...(isProjectwiseTenderTab ? [{
            icon  : 'fa fa-folder',
            text  : 'Projects',
            link  : '#',
            items : [
                { text : 'Projects', link : '/app/project/' }
            ]
        }] : []),

        // ✅ Show Tender tab ONLY when projectwise_tendertab is FALSE
        ...(!isProjectwiseTenderTab && isEnabled(user.packages.tender_tab) ? [{
            icon  : 'fa fa-pencil-square-o',
            text  : 'Tender',
            link  : '#',
            items : [
                { text : 'Tenders', link : '/app/tender/' },
                ...(isEnabled(user.packages.archived_tenders)
                    ? [{ text : 'Archived Tenders', link : '/app/archived/tender/' }]
                    : [])
            ]
        }] : []),

        ...(isEnabled(user.packages.vendor_tab) ? [{
            icon : 'fa fa-retweet',
            text : 'Market Place',
            link : '/app/my-contacts/'
        }] : []),

        ...(isEnabled(user.packages.my_bids) ? [{
            icon : 'fa fa-check-square-o',
            text : 'My Bid',
            link : '/app/my-bid/'
        }] : []),

        ...(templateItems.length > 0 ? [{
            icon  : 'fa fa-newspaper-o',
            text  : 'Templates',
            link  : '#',
            items : templateItems
        }] : []),

        {
            icon : 'fa fa-bell-o',
            text : 'Notification',
            link : '/app/message/'
        },

        {
            icon  : 'fa fa-file-archive-o',
            text  : 'Reports',
            link  : '#',
            items : [
                { text : 'User Reports', link : '/app/consumer/user-reports/' },
                { text : 'Tender Reports', link : '/app/consumer/tender-reports/' },
                { text : 'Bid Reports', link : '/app/consumer/bid-reports/' },
                { text : 'My Template Reports', link : '/app/consumer/my-template-reports/' },
                { text : 'My Contacts', link : '/app/consumer/my-contact-reports/' },
                { text : 'Standard Template Reports', link : '/app/consumer/standard-template-reports/' }
            ]
        },

        { type : 'separator' },

        {
            icon  : 'fa fa-user-o',
            text  : getUserName(user.name),
            title : user.name,
            link  : '#',
            items : [
                { text : 'Profile', link : '/app/my-profile/' },
                { text : 'Change Password', link : '/app/change-password/' },
                { text : 'Logout', link : '/app/logout/' }
            ]
        }
    ];

    // ✅ ADMIN always gets adminMenu
    if (user.admin === true) {
        return adminMenu;
    }

    return menu;
};

export default getMenu;
