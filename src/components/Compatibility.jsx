import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, Button, Modal, IconButton, Divider, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';

// --- 스타일 컴포넌트 정의 (이미지 기반 레이아웃) ---

const RecommendationContainer = styled(Paper)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    padding: 0,
    marginBottom: theme.spacing(2.5),
    boxShadow: 'none',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden', // Ensure children with borders fit correctly
}));

const TopSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '100%',
}));

const BottomSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    width: '100%',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
}));

const TypeBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1, 2),
    width: '30%',
    maxWidth: '150px',
    borderRight: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
}));

const IljuBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1, 2),
    display: 'flex',
    alignItems: 'center',
}));

const DescriptionBox = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        paddingRight: 0,
        marginBottom: theme.spacing(2),
    },
}));

const ActionBox = styled(Box)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        textAlign: 'center',
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
                <RecommendationContainer key={index} variant="outlined">
                    <TopSection>
                        <TypeBox>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                                {rec.type}
                            </Typography>
                        </TypeBox>
                        <IljuBox>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {rec.ilju}
                            </Typography>
                        </IljuBox>
                    </TopSection>
                    
                    <Divider />

                    <BottomSection>
                        <DescriptionBox>
                            <Typography variant="body2" color="text.secondary">
                                {rec.compatibilityDescription}
                            </Typography>
                        </DescriptionBox>
                        <ActionBox>
                            <Button 
                                size="small" 
                                variant="outlined"
                                startIcon={<InfoOutlinedIcon />}
                                onClick={() => handleOpenModal(rec)}
                                sx={{ color: 'text.primary', borderColor: 'grey.400' }}
                            >
                                자세히 보기
                            </Button>
                        </ActionBox>
                    </BottomSection>
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
