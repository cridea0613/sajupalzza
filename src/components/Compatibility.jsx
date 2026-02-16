import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, Button, Modal, IconButton, Divider, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';

// --- 스타일 컴포넌트 정의 (레이아웃 변경) ---

const RecommendationRow = styled(Paper)(({ theme, type }) => {
    const typeColors = {
        '천생연분': theme.palette.error.light,
        '좋은 궁합': theme.palette.info.light,
        '친구 같은 궁합': theme.palette.success.light,
    };

    return {
        padding: theme.spacing(2, 3),
        marginBottom: theme.spacing(2.5),
        borderLeft: `5px solid ${typeColors[type] || theme.palette.grey[400]}`,
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        '&:hover': {
            boxShadow: theme.shadows[6],
            transform: 'translateY(-3px)',
        },
    };
});

const TypeTypography = styled(Typography)(({ theme, type }) => {
    const typeColors = {
        '천생연분': theme.palette.error.main,
        '좋은 궁합': theme.palette.info.main,
        '친구 같은 궁합': theme.palette.success.main,
    };
    return {
        fontWeight: 'bold',
        color: typeColors[type] || theme.palette.text.primary,
        fontFamily: '"Gowun Batang", serif',
    };
});

const IljuTypography = styled(Typography)(({ theme }) => ({
    fontFamily: '"Gowun Batang", serif',
    fontWeight: '700',
    color: theme.palette.text.secondary,
}));

const DescriptionTypography = styled(Typography)(({ theme }) => ({
    fontFamily: '"Gowun Dodum", sans-serif',
    lineHeight: 1.6,
    color: theme.palette.text.primary,
}));

const modalStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: 500, bgcolor: '#FFF8E1', boxShadow: 24, p: 4, borderRadius: 2, border: '1px solid #8B4513' };


// --- 메인 컴포넌트 ---
const Compatibility = ({ recommendations }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedIlgan, setSelectedIlgan] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleOpenModal = (rec) => {
        setSelectedIlgan(rec);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedIlgan(null);
    };

    if (!recommendations || recommendations.length === 0) {
        return <Typography>추천 궁합 정보를 찾을 수 없습니다.</Typography>;
    }

    return (
        <Box sx={{ mt: 4 }}>
            {recommendations.map((rec, index) => (
                <RecommendationRow key={index} type={rec.type} elevation={2}>
                    <Grid container alignItems="center" spacing={{ xs: 2, sm: 3 }}>
                        {/* 왼쪽 섹션 */}
                        <Grid item xs={12} sm={3} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <TypeTypography variant="subtitle1" type={rec.type}>
                                {rec.type}
                            </TypeTypography>
                            <IljuTypography variant="h6">
                                {rec.ilju}
                            </IljuTypography>
                        </Grid>
                        
                        {/* 중앙 섹션 */}
                        <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'center' } }}>
                            <DescriptionTypography variant="body2">
                                {rec.compatibilityDescription}
                            </DescriptionTypography>
                        </Grid>

                        {/* 오른쪽 섹션 */}
                        <Grid item xs={12} sm={3} sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
                            <Button 
                                size="small" 
                                variant="outlined"
                                startIcon={<InfoOutlinedIcon />}
                                onClick={() => handleOpenModal(rec)}
                                sx={{ 
                                    color: '#5D4037', 
                                    borderColor: 'rgba(93, 64, 55, 0.3)',
                                    '&:hover': { 
                                        backgroundColor: 'rgba(93, 64, 55, 0.04)',
                                        borderColor: 'rgba(93, 64, 55, 0.5)',
                                    } 
                                }}
                            >
                                자세히 보기
                            </Button>
                        </Grid>
                    </Grid>
                </RecommendationRow>
            ))}

            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8, color: '#8B4513' }}><CloseIcon /></IconButton>
                    <Typography variant="h5" component="h2" sx={{ fontFamily: '"Gowun Batang", serif', fontWeight: '700', color: '#8B4513' }} gutterBottom>
                        {selectedIlgan?.ilju}
                    </Typography>
                    <Divider sx={{ my: 2, borderColor: 'rgba(139, 69, 19, 0.2)' }} />
                    <Typography sx={{ mt: 2, fontFamily: '"Gowun Dodum", sans-serif' }}>
                        {selectedIlgan?.ilganDescription}
                    </Typography>
                </Box>
            </Modal>
        </Box>
    );
};

export default Compatibility;
