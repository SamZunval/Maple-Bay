import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Rating from '@mui/material/Rating';
import {
    TextField,
    Button,
    Stack,
    Box,
} from "@mui/material";

import { useState } from "react";
import { review } from '../util/api';
function ReviewPage(props) {
  const { onClose, open, reviewer, reviewee, product} = props;
  //should have reviewer, reviewee, product
  const [value, setValue] = React.useState(1);
  const [comment, setComment] = useState("");

  const handleClose = () => {
    onClose();
  };

  const handleReview = async() => {
    var rev = {reviewer: reviewer, reviewee: reviewee, product: product,comment: comment, value: value};
    await review.addReview(rev);
    onClose();
  };

  return (
    <Dialog fullWidth={true} onClose={handleClose} open={open} closeAfterTransition disableRestoreFocus={true} slotProps={{
    backdrop: {
      transitionDuration: { exit: 0 } // Speeds up the DOM teardown
    }
  }}>
      <DialogTitle sx={{ textAlign: 'center' }}>Review</DialogTitle>
      <div
          style={{
            display: 'flex',
            flexDirection: 'column', // Stacks text and stars vertically
            alignItems: 'center',    // Centers items horizontally
            justifyContent: 'center',
            my: 2,                   // Adds vertical margin
          }}
        >
            <Rating
            name="rating-object"
            value={value}
            size="large"
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            />
        </div>
      <TextField fullWidth label="Comments" value={comment} onChange={(e) => setComment(e.target.value)} sx={{ mb: "1em" }}/>
      <Stack justifyContent="space-between" width="100%" direction="row">
        <Button variant="Outlined" onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleReview}>Submit</Button>
      </Stack>

    </Dialog>
  );
}
export default ReviewPage;
