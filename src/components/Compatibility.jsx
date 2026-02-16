import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, Button, Modal, IconButton, Divider, useMediaQuery } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';

// --- 스타일 컴포넌트 정의 (디자인 개선) ---

const RecommendationContainer = styled(Paper)(({ theme, type }) => {
    const typeColors = {
        '천생연분': { bg: alpha(theme.palette.error.light, 0.2), border: theme.palette.error.main },
        '좋은 궁합': { bg: alpha(theme.palette.info.light, 0.2), border: theme.palette.info.main },
        '친구 같은 궁합': { bg: alpha(theme.palette.success.light, 0.2), border: theme.palette.success.main },
    };

    return {
        border: `1px solid ${typeColors[type]?.border || theme.palette.divider}`,
        backgroundColor: typeColors[type]?.bg || theme.palette.background.paper,
        padding: 0,
        marginBottom: theme.spacing(2.5),
        boxShadow: 'none',
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
        position: 'relative',
        transition: 'box-shadow 0.3s ease',
         '&:hover': {
            boxShadow: `0 4px 12px ${alpha(typeColors[type]?.border || theme.palette.common.black, 0.2)}`,
        },
    };
});

const TopSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const BottomSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(5), // 버튼 공간 확보
    [theme.breakpoints.down('sm')]: {
        paddingBottom: theme.spacing(6),
    },
}));

const TypeBox = styled(Box)(({ theme, type }) => {
     const typeColors = {
        '천생연분': alpha(theme.palette.error.main, 0.1),
        '좋은 궁합': alpha(theme.palette.info.main, 0.1),
        '친구 같은 궁합': alpha(theme.palette.success.main, 0.1),
    };
    return {
        padding: theme.spacing(1, 2),
        width: '30%',
        maxWidth: '150px',
        borderRight: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: typeColors[type],
    };
});

const IljuBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1, 2),
    display: 'flex',
    alignItems: 'center',
}));

const ActionBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: theme.spacing(1),
    right: theme.spacing(1.5),
     [theme.breakpoints.down('sm')]: {
        bottom: theme.spacing(1),
        right: 'auto',
        left: '50%',
        transform: 'translateX(-50%)',
    },
}));

const modalStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: 500, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 };

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
            {recommendations.map((rec, index) => (
                <RecommendationContainer key={index} type={rec.type}>
                    <TopSection>
                        <TypeBox type={rec.type}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold'}}>
                                {rec.type}
                            </Typography>
                        </TypeBox>
                        <IljuBox>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {rec.ilju}
                            </Typography>
                        </IljuBox>
                    </TopSection>
                    
                    <BottomSection>
                        <Typography variant="body2" color="text.secondary">
                            {rec.compatibilityDescription}
                        </Typography>
                    </BottomSection>

                    <ActionBox>
                        <Button 
                            size="small" 
                            variant="text"
                            startIcon={<InfoOutlinedIcon fontSize="small" />}
                            onClick={() => handleOpenModal(rec)}
                            sx={{ 
                                fontSize: '0.75rem', 
                                color: 'text.secondary',
                                padding: '2px 8px',
                                minWidth: 'auto',
                                '&:hover': { 
                                    backgroundColor: 'rgba(0,0,0,0.04)' 
                                }
                            }}
                        >
                            자세히
                        </Button>
                    </ActionBox>
                </RecommendationContainer>
            ))}

            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }} gutterBottom>
                        {selectedIlgan?.ilju}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography sx={{ mt: 2 }}>
                        {selectedIlgan?.ilganDescription}
                    </Typography>
                </Box>
            </Modal>
        </Box>
    );
};

export default Compatibility;
