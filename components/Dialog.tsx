import React from 'react';
import {
    createStyles,
    Theme,
    withStyles,
    WithStyles,
    makeStyles,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import { getDateFromLogs } from '../utils/calendar';
import { db } from '../firebase';
import Router from 'next/router';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            width: '500px',
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

const useStyles = makeStyles((theme) => ({
    flexWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
}));

export interface DialogTitleProps extends WithStyles<typeof styles> {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default function CustomizedDialogs({
    onDeleteClick,
    open,
    setOpen,
    currentLogs,
}) {
    const classes = useStyles();
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const onEditClick = (id) => {
        Router.push(`/submit/${id}`);
    };

    return (
        <div>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {currentLogs.length && getDateFromLogs(currentLogs[0])}
                    の記録
                </DialogTitle>
                <DialogContent dividers>
                    {currentLogs.map((log, index) => {
                        return (
                            <div key={index} className={classes.flexWrapper}>
                                <ul>
                                    <li>
                                        授業日時：{log.date.hour()}時
                                        {log.date.minute()}分
                                    </li>
                                    <li>授業回数：{log.count}回</li>
                                    <li>授業時間：{log.time}分</li>
                                    <li>
                                        サービス：
                                        {log.englishService.id}
                                    </li>
                                </ul>
                                <div>
                                    <Tooltip title="記録を編集">
                                        <IconButton
                                            onClick={() =>
                                                onEditClick(
                                                    currentLogs[index].id
                                                )
                                            }
                                            aria-label="edit"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="記録を削除">
                                        <IconButton
                                            onClick={() =>
                                                onDeleteClick(
                                                    currentLogs[index].id
                                                )
                                            }
                                            aria-label="delete"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </div>
                        );
                    })}
                    <Typography gutterBottom></Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
