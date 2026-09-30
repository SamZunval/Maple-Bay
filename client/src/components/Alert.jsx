import {
    Paper,
    CardHeader,
    CardContent,
    Divider
} from '@mui/material';
import Typography from '@mui/material/Typography';
const Alert = ({alert}) => {
  if (!alert) return (<></>); // Render an empty fragment
  
  return (<Paper elevation={4} sx={{ marginTop: "0.5em" }}>
            <CardHeader title={"(" + alert.country_code + ") " + alert.country_name}  />
            <CardContent>
              <Typography gutterBottom sx={{ fontSize: 14 }}>{alert.sub_region}</Typography>
               
              { alert.advisory != "" &&
                <>
                  <Divider variant="fullWidth" />
                  <Typography gutterBottom sx={{ fontSize: 14 }}>{alert.advisory}</Typography>
                </>
              }
              { alert.date != "" &&
                <>
                  <Divider variant="fullWidth" />
                  <Typography gutterBottom sx={{ fontSize: 14 }}>{alert.date}</Typography>
                </>
              }
            </CardContent>
        </Paper>);
};

export default Alert;