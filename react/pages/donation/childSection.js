import {
    Typography,
    Grid,
    Avatar,
    Paper,
    Card,
    CardContent
} from "@material-ui/core";
import { getImageUrl } from "./../../src/helpers";

export default function ChildSection({ classes, data }) {
    const { image = 'images/avatar/3.jpg', firstName = '', lastName = '', comments = '' } = data
    return (
        <>
            <Grid spacing={3} align="center">
                <Grid item>
                        <Card>
                        <CardContent className={classes.cardImaga}>
                            {/* <h2>
                                Children Info
                            </h2> */}
                            <Grid container justify="center" alignItems="center">
                                <Grid container spacing={0} direction="column" alignItems="center" justify="center" >
                                    <Grid item xs={12}>
                                        <br />
                                        <Avatar variant="align-content: center" className={classes.avatar} src={getImageUrl(image)} />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} className={classes.cardBody}>
                                    <Typography variant="h5" className={classes.cardTitle}>
                                        {firstName}{' '}{lastName}
                                    </Typography>
                                    <br />
                                    {/* <Typography variant="subtitle1" className={classes.description}>
                                        {comments}
                                    </Typography> */}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}