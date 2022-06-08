import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import React from "react";
import {Notification} from "./Subscribe";

export  default function ListNotifications({notifications}: {notifications: Array<Notification>}) {
    return <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell align="center">Time</TableCell>
                    <TableCell align="center">Transaction Hash</TableCell>
                    <TableCell align="center">Title</TableCell>
                    <TableCell align="center">Body</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {notifications.map((notification, index) => (
                    <TableRow
                        key={notification.title + index}
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                        <TableCell align="center">{notification.time.toLocaleTimeString()}</TableCell>
                        <TableCell align="center">{notification.transactionHash}</TableCell>
                        <TableCell align="center">{notification.title}</TableCell>
                        <TableCell align="center">{notification.body}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>;
}
