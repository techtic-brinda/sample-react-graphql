import authReducer from './auth';
import userProfileReducer from './user.profile';
import childrensReducer from './childrens';
import blogsReducer from './blogs';
import settingsReducer from './contact';
import sponsersReducer from './sponsers';
import notificationReducer from './notification';
import donationReducer from './donation';
import reportReducer from './report';
import headerReducer from './header';
import dashboardReducer from './dashboard';

export default {
    auth: authReducer,
    userProfile: userProfileReducer,
    childrens: childrensReducer,
    blogs: blogsReducer,
    settings: settingsReducer,
    sponsers: sponsersReducer,
    donation: donationReducer,
    notification: notificationReducer,
    report: reportReducer,
    header: headerReducer,
    dashboard: dashboardReducer,
};