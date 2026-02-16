import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Box, Typography, List, ListItem, ListItemText, IconButton, Button, Paper, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const StyledPaper = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(4),
    padding: theme.spacing(3),
    backgroundColor: '#FFF8E1',
    border: `1px solid ${theme.palette.divider}`,
}));

const SavedReports = ({ onLoadReport }) => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const savedReports = Cookies.get('saju_reports');
        if (savedReports) {
            setReports(JSON.parse(savedReports));
        }
    }, []);

    const handleDelete = (index) => {
        const updatedReports = reports.filter((_, i) => i !== index);
        setReports(updatedReports);
        Cookies.set('saju_reports', JSON.stringify(updatedReports), { expires: 365 });
    };

    const handleReset = () => {
        setReports([]);
        Cookies.remove('saju_reports');
    };

    return (
        <StyledPaper elevation={0}>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Gowun Batang", serif', fontWeight: 700, color: '#8B4513' }}>
                저장된 리포트
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {reports.length > 0 ? (
                <List dense>
                    {reports.map((report, index) => (
                        <ListItem
                            key={index}
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <Button 
                                size="small" 
                                startIcon={<VisibilityIcon />} 
                                onClick={() => onLoadReport(report.data)} 
                                sx={{ textTransform: 'none', justifyContent: 'flex-start', color:'text.primary' }}
                            >
                                {report.name}
                            </Button>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body2" color="text.secondary" align="center">저장된 리포트가 없습니다.</Typography>
            )}
            {reports.length > 0 && (
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                    <Button variant="outlined" color="error" size="small" onClick={handleReset}>전체 리셋</Button>
                </Box>
            )}
        </StyledPaper>
    );
};

export default SavedReports;
