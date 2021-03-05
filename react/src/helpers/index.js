import moment from 'moment'
import { getCookie } from '../utils/cookie';
export function redirectUser(ctx, location) {
    if (ctx.req) {
        ctx.res.writeHead(302, { Location: location });
        ctx.res.end();
    } else {
        Router.push(location);
    }
}

export function getUrl(url) {
    if (url){
        return process.env.baseUrl + "/" + url;
    }else{
        return "";
    }
}


export function parseError(error) {
    let message = "";
    if (error && error.graphQLErrors) {
        const messages = error.graphQLErrors.map(x => x.message).join('\n');

        if (messages.length === 0) {
            return null;
        }
        message = messages;
    } else {
        message = error;
    }
    return message
}

export function getImageUrl(url, type="profile") {
    if (url) {
        try {
            let imagedata = JSON.parse(url)
            if (typeof imagedata === 'object') {
                return process.env.baseUrl + imagedata.filepath;
            } else {
                return url;
            }
        } catch (error) {
            return url
        }

        //process.env.BACKEND_URL
    } else {
        if(type == "profile"){
         return process.env.baseUrl + "assets/images/avatars/profile.jpg";
        }else{
            return process.env.baseUrl + "/images/logo_placeholder.png";
        }
        
    }
}

export function getDateFormat(date) {
    if (date){
        return moment(date).format("MMMM D, YYYY");
    }else{
        return "-";
    }
}

export function getDateFormatDefualt(date) {
    if (date){
        return moment(date).format("MM/DD/YYYY");
    }else{
        return "-";
    }
}

export function getTimeFormat(date) {
    if (date){
        return moment(date).format("hh:mm a");
    }else{
        return "-";
    }
}

export function getUserStatus(row) {
    let user = getCookie('user');
    user = decodeURIComponent(user);
    user = JSON.parse(user);
    if(user){
        let status = ''
        if(user.roleName == "Champion" && row.championRequests && row.championRequests.nodes != undefined && row.championRequests.nodes.length > 0){
            const { nodes } = row.championRequests
            return status = nodes[0]['status']; 
        } else {
            return status;
        }
    }else{
        Router.push('/');
    }
}