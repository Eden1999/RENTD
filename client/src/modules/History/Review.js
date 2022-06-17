import React, { useState } from "react";
import axios from 'axios'
import useToken from "../../helpers/useToken";
import PropTypes from "prop-types";

import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Rating, TextField } from "@mui/material";
import { toast } from "react-toastify";

const Review = ({open, setOpen, workspace_id, orders, setOrders}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { token, setToken } = useToken();

  const handleClose = () => {
    setRating(0);
    setComment("");
    setOpen(false);
  }

  const handleWriteComment = () => {
    handleClose();

    const query = {
      workspace_id,
      comment,
      rating
    }

    axios.post(`${process.env.REACT_APP_SERVER_URL}ratings/create`, query, {
      headers: {
        token,
      }
    })
    .then((res) => {
      toast(res.data?.message)
      if(res?.data?.addedRating) { 
        let updatedOrders = orders.map((order) => {
          if(order.workspace.id === workspace_id ) {
            order.workspace.ratings = [...order.workspace.ratings, res.data.addedRating]
          }
        
          return order
        })
        setOrders(updatedOrders)
      }
    })
    .catch(err =>{
      alert(err.response.data)
  })
  }

  return (
    <Dialog open={open} onClose={() => {handleClose()}}>
        <DialogTitle>Write a review</DialogTitle>
        <DialogContent>
            <Rating name="rating"
            value={rating}
            onChange={(_, value) => {
                setRating(value);
            }}/>
            <TextField
            id="comment"
            required
            multiline
            fullWidth
            value={comment}
            className="bg-gray-100 rounded border border-gray-400 leading-normal resize-none
                w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
            placeholder="Type your comment"
            onChange={(event) => setComment(event.target.value)}
            />
    </DialogContent>
    <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleWriteComment}>Send review</Button>
    </DialogActions>
    </Dialog>
  );
};

Review.propTypes = {
    open: PropTypes.bool, 
    setOpen : PropTypes.func
};

export default Review;
