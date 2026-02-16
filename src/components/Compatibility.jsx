import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, Chip, Button, Modal, IconButton, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PeopleIcon from '@mui/icons-material/People';
import HandshakeIcon from '@mui/icons-material/Handshake';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';

// --- 스타일 컴포넌트 정의 ---

const RecommendationCard = styled(Paper)(({ theme, type }) => {
    const colors = {
        '천생연분': { background: 'linear-gradient(145deg, #FFDDE1, #FFC2C8)', icon: '#E91E63' }, // 핑크
        '좋은 궁합': { background: 'linear-gradient(145deg, #D4E7FE, #B7D8FF)', icon: '#2196F3' }, // 블루
        '친구 같은 궁합': { background: 'linear-gradient(145deg, #D7F9E9, #B2F3D5)', icon: '#4CAF50' }, // 그린
    };

    return {
        padding: theme.spacing(3),
        height: '100%',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        background: colors[type]?.background || '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.3s ease, boxShadow 0.3s ease',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: theme.shadows[10],
        }
    };
});

const TypeChip = styled(Chip)(({ theme, type }) => {
     const colors = {
        '천생연분': { backgroundColor: '#E91E63', color: '#fff' },
        '좋은 궁합': { backgroundColor: '#2196F3', color: '#fff' },
        '친구 같은 궁합': { backgroundColor: '#4CAF50', color: '#fff' },
    };
    return {
        ...colors[type],
        fontWeight: 'bold',
        marginBottom: theme.spacing(2),
        boxShadow: `0 2px 8px -2px ${colors[type]?.backgroundColor || '#000'}`,
    };
});

const IljuTypography = styled(Typography)(({ theme }) => ({
    fontFamily: '"Gowun Batang", serif',
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: theme.spacing(1),
}));

const DescriptionTypography = styled(Typography)(({ theme }) => ({
    fontFamily: '"Gowun Dodum", sans-serif',
    lineHeight: 1.7,
    color: '#555',
    textAlign: 'center',
    flexGrow: 1,
    marginBottom: theme.spacing(2),
}));

const IconWrapper = styled(Box)(({ theme, type }) => {
    const colors = {
        '천생연분': '#E91E63',
        '좋은 궁합': '#2196F3',
        '친구 같은 궁합': '#4CAF50',
    };
    return {
        textAlign: 'center',
        color: colors[type] || '#000',
        marginBottom: theme.spacing(1.5),
    };
});

const modalStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: 500, bgcolor: '#FFF8E1', boxShadow: 24, p: 4, borderRadius: 2, border: '1px solid #8B4513' };

const iconMap = {
    '천생연분': <FavoriteIcon fontSize="large" />,
    '좋은 궁합': <HandshakeIcon fontSize="large" />,
    '친구 같은 궁합': <PeopleIcon fontSize="large" />,
};


// --- 메인 컴포넌트 ---
const Compatibility = ({ recommendations }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedIlgan, setSelectedIlgan] = useState(null);

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
            <Grid container spacing={3}>
                {recommendations.map((rec, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <RecommendationCard type={rec.type}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TypeChip label={rec.type} type={rec.type} />
                                </Box>
                                <IconWrapper type={rec.type}>
                                    {iconMap[rec.type]}
                                 </IconWrapper>
                                <IljuTypography variant="h5">
                                    {rec.ilju}
                                </IljuTypography>
                                <DescriptionTypography variant="body2">
                                    {rec.compatibilityDescription}
                                </DescriptionTypography>
                                <Box sx={{ textAlign: 'center', mt: 'auto' }}>
                                    <Button 
                                        size="small" 
                                        startIcon={<InfoOutlinedIcon />} 
                                        onClick={() => handleOpenModal(rec)}
                                        sx={{ color: '#5D4037', '&:hover': { backgroundColor: 'rgba(93, 64, 55, 0.04)' } }}
                                    >
                                        자세히 보기
                                    </Button>
                                </Box>
                            </Box>
                        </RecommendationCard>
                    </Grid>
                ))}
            </Grid>

            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
            >
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
