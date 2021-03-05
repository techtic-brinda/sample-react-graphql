import RolesPlugin from './roles';
export * from './user-schema-type';
export * from './user-schema-forgot-password-type';
export * from './user-schema-stripe-add-customer';
export * from './user-schema-stripe-card';
export * from './user-schema-stripe-get-cards';
export * from './user-schema-contac-us';
export * from './user-schema-stripe-session';
export * from './user-schema-stripe-success';
export * from './user-admin-register-schema';
export * from './user-schema-change-password';

export const UserPlugins = [
    RolesPlugin,
];
