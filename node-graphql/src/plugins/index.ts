// tslint:disable-next-line: max-line-length
import { UserPlugins, UserType, UserForgotPassword, UserStripe, UserStripeCard, UserStripeSuccess, UserStripeSession, UserContacUs, UserStripeGetCard, AdminUserRegister, UserProfileChangePassword } from './users';
import { OrphanImport, OrphanSearch } from './orphan';
import { Sponsers } from './sponser';
import { DashboardNewOrphans, myOrphanSearch } from './dashboard';
import { Reports } from './report';
import { BlogsPlugins, BlogSearch, UnassignBlogCategoryAfterRemove } from './blogs';
import UploadFieldPlugin from './upload-field-plugin';
import { NotificationPlugins, NotificationSchemaPlugins, AddNotification, UpdateAllNotification } from './notifications';

export const Plugins = [
    ...UserPlugins,
    ...BlogsPlugins,
    ...NotificationPlugins,
    UploadFieldPlugin,
];

export const CustomSchemaType = [
    UserType,
    AdminUserRegister,
    UserForgotPassword,
    UserStripe,
    UserStripeCard,
    UserStripeGetCard,
    UserContacUs,
    OrphanImport,
    UserStripeSession,
    UserStripeSuccess,
    UserProfileChangePassword,
    ...NotificationSchemaPlugins,
    OrphanSearch,
    BlogSearch,
    Sponsers,
    Reports,
    AddNotification,
    DashboardNewOrphans,
    myOrphanSearch,
    UpdateAllNotification,
    UnassignBlogCategoryAfterRemove,
];
