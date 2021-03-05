import {
    Typography,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    Avatar,
    ListItemIcon,
    Paper,
    ListItemText
} from "@material-ui/core";
import React, { Component, Fragment } from "react";
import { getImageUrl } from "./../../src/helpers";
class DashboardNotification extends Component {
    constructor(props) {
        super(props)
    }
    getDesscription = (row) => {
        let obj = row.data;
        if (obj != null && obj.description) {
            return (<Typography variant='body2'>{obj.description}</Typography>);
        }
        return null;
    }
    render() {
        let notifyNodes = [];
        const { notification } = this.props;
        if (notification) {
            const { edges = [] } = notification;
            if (edges.length > 0) {
                notifyNodes = edges.slice(0, 4).map((notify) => { return notify.node });
            }
        }
        return (
            <>
                <Grid item>
                    <Card>
                        <CardContent>
                            <h2>Notifications</h2>
                                {notifyNodes.length > 0 && notifyNodes.map((notify) => (
                                <List>
                                    <ListItem component={Paper} elevation={8} key={notify.id}>
                                        <ListItemIcon>
                                            <Avatar
                                                src={getImageUrl(notify.user.image)}
                                            />
                                        </ListItemIcon>
                                        <ListItemText primary={(
                                            <Fragment>
                                                <Typography variant="subtitle1" component="span">{notify.title} </Typography>
                                                <Typography variant='body1' component="span">{this.getDesscription(notify)}</Typography>
                                            </Fragment>
                                        )} />
                                    </ListItem>
                                </List>
                                ))}
                                {notifyNodes.length == 0 && (
                                    <Typography align="center">
                                        Notification not found
                                    </Typography>
                                )}
                        </CardContent>
                    </Card>
                </Grid>
            </>
        )
    }
}

export default DashboardNotification