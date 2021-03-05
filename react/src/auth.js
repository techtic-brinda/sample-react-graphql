import Router from 'next/router'
import { setCurrentUser, setUserToken } from './store/actions/auth';
import { connect } from 'react-redux';
import { getCookie } from './utils/cookie';

export function withAuth(PageComponent, { ssr = false } = {}) {
    const WithAuth = ({ ...pageProps }) => {
        return (<PageComponent {...pageProps} />)
    }

    // Set the correct displayName in development
    if (process.env.NODE_ENV !== 'production') {
        const displayName =
            PageComponent.displayName || PageComponent.name || 'Component'

        if (displayName === 'App') {
            console.warn('This withAuth HOC only works with PageComponents.')
        }

        WithAuth.displayName = `withAuth(${displayName})`
    }


    WithAuth.getInitialProps = async ctx => {

        const pageProps = PageComponent.getInitialProps && (await PageComponent.getInitialProps(ctx))
        const token = getCookie('token', ctx.req);
        let user = null;

        if (ctx.isServer) {
            if (!token) {
                ctx.res.writeHead(302, { Location: '/login' });
                ctx.res.end();
            } else {
                try {
                    user = getCookie('user', ctx.req);
                    user = decodeURIComponent(user);
                    user = JSON.parse(user);
                } catch (error) {
                    
                }
            }
        } else {
            if (!token) {
                Router.push('/login')
            }else{
                try {
                    user = JSON.parse(getCookie('user'));
                } catch (error) {
                    
                }
            }
        }

        return {
            ...pageProps,
            token,
            user
        }
    }

    const mapDispatchToProps = dispatch => {
        return {
            setUserToken: (token) => dispatch(setUserToken(token)),
            setCurrentUser: (user) => dispatch(setCurrentUser(user)),
            logoutUser: () => dispatch(logoutUser()),
        }
    }

    return connect(null, mapDispatchToProps)(WithAuth)
}