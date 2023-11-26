import {Grid, IconButton, Typography} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const DetailField = (props) => {
  const handleEdit = () => {
    props.setModalType(props.field);
    props.setOpen(true);
  }
  return (
    <Grid container item direction="column">
      <Grid item>
        <Grid container alignItems="center">
          <Typography variant={props.fieldVar}>{props.field}</Typography>
          { props.isOwner &&
            <IconButton onClick={handleEdit}>
              <EditIcon color="secondary"/>
            </IconButton>
          }
        </Grid>
      </Grid>
      <Grid item>
        <Typography variant={props.valVar}>{props.val}</Typography>
      </Grid>
    </Grid>
  );
}

export default DetailField;