import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import {
    TextField,
    Button,
    Stack,
    Box,
    MenuItem
} from "@mui/material";

import { useState } from "react";
import { report } from '../util/api';
function ReportPage(props) {
  const { onClose, open, reviewer, reviewee, product} = props;
  //should have reviewer, reviewee, product(optional)
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  const handleClose = () => {
    onClose();
  };

  const handleReview = async() => {
    var rev = {reviewer: reviewer, reviewee: reviewee, product: product,reason: reason, comment: comment};
    const response = await report.addReport(rev);
    if (response.ok) props.onSubmitted?.();
    onClose();
  };
  const reasonList = [
        "Fraud or Payment Issue",
        "Never Shipped Product",
        "Counterfeit Items",
        "Prohibited Items",
        "Abusive Behavior",
        "Other (Please Explain)"
    ];

  return (
    <Dialog fullWidth={true} onClose={handleClose} open={open} closeAfterTransition disableRestoreFocus={true} slotProps={{
    backdrop: {
      transitionDuration: { exit: 0 } // Speeds up the DOM teardown
    },
    paper: {
          sx: {
            p: 3, // 24px padding on all sides
          },
        },
  }}>
      <DialogTitle sx={{ textAlign: 'center' }}>Report User</DialogTitle>
       <TextField
                        fullWidth
                        required
                        select
                        label="Report Reason"
                        name="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    >
                        {reasonList.map((reason) => (
                            <MenuItem key={reason} value={reason}>
                                {reason}
                            </MenuItem>
                        ))}
                    </TextField>
      <TextField fullWidth label="Comments" value={comment} onChange={(e) => setComment(e.target.value)} sx={{ mb: "1em" }}/>
      <Stack justifyContent="space-between" width="100%" direction="row">
        <Button variant="Outlined" onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleReview}>Submit</Button>
      </Stack>

    </Dialog>
  );
}
export default ReportPage;
