import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Paper, Grid, Button, Divider, Chip, Tabs, Tab, Modal, IconButton, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ShareIcon from '@mui/icons-material/Share';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getSaju } from '../utils/saju.js';
import { sajuDict } from '../utils/saju-dict.js';
import Compatibility from './Compatibility'; // 궁합 컴포넌트 임포트
import TojeongResult from './TojeongResult'; // 토정비결 결과 컴포넌트

// --- 스타일 정의 ---

const StyledRoot = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(3, 0),
  backgroundColor: '#F5F5DC',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D2B48C' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,

  '@media print': {
    backgroundColor: '#FFFFFF',
    padding: 0,
    backgroundImage: 'none',
    '& .no-print': { display: 'none' },
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 900,
  margin: '0 auto',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  '@media print': {
    boxShadow: 'none',
    border: 'none',
    padding: theme.spacing(2),
    margin: 0,
    maxWidth: '100%',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    backdropFilter: 'none',
  },
}));

const ActionButton = styled(Button)(({ theme, color = 'primary' }) => ({
    backgroundColor: color === 'primary' ? '#8B4513' : '#B22222',
    color: '#FFFFFF',
    '&:hover': {
        backgroundColor: color === 'primary' ? '#A0522D' : '#DC143C',
    },
    padding: theme.spacing(1.5),
    fontWeight: 'bold',
}));

const TitleTypography = styled(Typography)({ fontFamily: '"Gowun Batang", serif', fontWeight: '700', color: '#8B4513', textAlign: 'center' });
const SectionTitle = styled(Typography)(({ theme }) => ({ fontFamily: '"Gowun Batang", serif', fontWeight: '700', borderLeft: '4px solid #8B4513', paddingLeft: theme.spacing(2), marginBottom: theme.spacing(3) }));
const modalStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: 500, bgcolor: '#FFF8E1', boxShadow: 24, p: 4, borderRadius: 2, border: '1px solid #8B4513', maxHeight: '80vh', overflowY: 'auto' };

// --- 컴포넌트 정의 ---

const TermModal = ({ open, handleClose, termData }) => {
    if (!termData) return null;
    const { category, key, hangeul } = termData;
    const dictEntry = sajuDict[category];
    const termInfo = dictEntry?.terms[key];

    return (
        <Modal open={open} onClose={handleClose} className="no-print">
            <Box sx={modalStyle}>
                <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8, color: '#8B4513' }}><CloseIcon /></IconButton>
                <TitleTypography variant="h5" component="h2" gutterBottom>{hangeul} ({key})</TitleTypography>
                <Divider sx={{ my: 2, borderColor: 'rgba(139, 69, 19, 0.2)' }} />
                <Typography sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>{termInfo || '설명을 찾을 수 없습니다.'}</Typography>
            </Box>
        </Modal>
    );
};

const ClickableTerm = ({ term, onClick }) => (
    <Chip
        label={term.hangeul}
        onClick={() => onClick(term)}
        variant="outlined"
        size="small"
        sx={{ cursor: 'pointer', mx: 0.5, borderColor: '#2E8B57', color: '#2E8B57', fontWeight: 'bold', '&:hover': { backgroundColor: 'rgba(46, 139, 87, 0.1)' } }}
    />
);

const ContentRenderer = ({ content, onClickTerm }) => {
    if (!content) return null;
    return (
        <>
            {content.map((part, index) => {
                if (part.type === 'term') return <ClickableTerm key={index} term={part} onClick={onClickTerm} />;
                return <span key={index}>{part.value}</span>;
            })}
        </>
    );
};

const SajuResult = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const queryData = useMemo(() => ({
        name: searchParams.get('name'),
        birthDateISO: searchParams.get('birthDate'),
        gender: searchParams.get('gender'),
        timeUnknown: searchParams.get('timeUnknown') === 'true',
    }), [searchParams]);

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const { name, birthDateISO, gender, timeUnknown } = queryData;
        if (name && birthDateISO && gender) {
            const birthDate = new Date(birthDateISO);
            setResult(getSaju(birthDate, gender, timeUnknown));
            setLoading(false);
        } else {
            navigate('/');
        }
    }, [queryData, navigate]);

    const handleShare = () => { navigator.clipboard.writeText(window.location.href).then(() => setSnackbarOpen(true)); };
    const handlePrint = () => { window.print(); };
    const handleTermClick = (term) => { setSelectedTerm(term); setModalOpen(true); };
    
    const renderBlock = (block, index) => {
        switch (block.type) {
            case 'paragraph':
                return <Typography key={index} paragraph sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{block.content.text}</Typography>;
            case 'table':
                return (
                    <Paper key={index} variant="outlined" sx={{ mt: 2, borderColor: 'rgba(139, 69, 19, 0.2)', backgroundColor: 'transparent' }}>
                        <Box sx={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>{block.content.columns.map((col, i) => <th key={i} style={{ padding: '12px', border: '1px solid rgba(139, 69, 19, 0.2)', backgroundColor: 'rgba(139, 69, 19, 0.05)', fontFamily: '"Gowun Batang", serif' }}>{col}</th>)}</tr>
                                </thead>
                                <tbody>
                                    {block.content.rows.map((row, i) => (
                                        <tr key={i}>{row.map((cell, j) => (<td key={j} style={{ padding: '12px', border: '1px solid rgba(139, 69, 19, 0.2)', textAlign: 'center' }}>{cell.type === 'term' ? <ClickableTerm term={cell} onClick={handleTermClick} /> : cell}</td>))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>
                    </Paper>
                );
            case 'daeun_table':
                 return (
                    <Grid container spacing={2} key={index} sx={{ mt: 1 }}>
                        {block.content.periods.map((p, i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Paper elevation={0} variant="outlined" sx={{ p: 2, textAlign: 'center', borderColor: 'rgba(139, 69, 19, 0.2)', backgroundColor: 'transparent' }}>
                                    <Typography variant="h6" sx={{ fontFamily: '"Gowun Batang", serif' }}>{p.age}세</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{p.daeun}</Typography>
                                    <ClickableTerm term={p.sipsin} onClick={handleTermClick} />
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                );
            case 'tojeong_result':
                return <TojeongResult key={index} result={block.content} />;
            case 'compatibility_cards':
                return <Compatibility key={index} recommendations={block.content.recommendations} />;
            default:
                return null;
        }
    };

    if (loading) return <StyledRoot><Box sx={{display: 'flex', justifyContent:'center', pt: 10}}><CircularProgress sx={{ color: '#8B4513' }} /></Box></StyledRoot>;
    if (!result?.narrative) return <StyledRoot><Typography>결과를 생성하지 못했습니다.</Typography></StyledRoot>;

    const { narrative } = result;

    return (
        <StyledRoot>
            <StyledPaper>
                <TitleTypography variant="h4" component="h1" gutterBottom>{queryData.name}님의 사주 분석 결과</TitleTypography>
                <Divider sx={{ my: 2, borderColor: 'rgba(139, 69, 19, 0.2)' }} />

                <Box sx={{ my: 4, textAlign: 'center' }}>
                    <TitleTypography
                        variant="h5"
                        component="h2"
                        sx={{ mb: 1.5, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 1, fontSize: { xs: '1.6rem', sm: '2.0rem', md: '2.4rem' }, '& .MuiChip-root': { height: 'auto' }, '& .MuiChip-label': { fontSize: { xs: '2.4rem', sm: '3.0rem', md: '3.6rem' }, lineHeight: 1.2, padding: '0.4em 0.6em' }}}
                    >
                         <ContentRenderer content={narrative.headline.title_parts} onClickTerm={handleTermClick} />
                    </TitleTypography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }}}>
                        {narrative.headline.text}
                    </Typography>
                </Box>
                <Typography paragraph sx={{lineHeight: 1.8, fontSize: '1.1rem'}}>
                    <ContentRenderer content={narrative.summary.content} onClickTerm={handleTermClick} />
                </Typography>
                {narrative.sections.map((section, index) => (
                    <Box key={section.id || index} sx={{ my: 5 }}>
                        <SectionTitle variant="h5" component="h2"> {section.title} </SectionTitle>
                        {section.blocks.map(renderBlock)}
                    </Box>
                ))}
                 
                <Divider sx={{ my: 4, borderColor: 'rgba(139, 69, 19, 0.2)' }} className="no-print" />
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 2, mt: 3 }} className="no-print">
                    <ActionButton variant="contained" size="large" startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} color="secondary">처음으로</ActionButton>
                    <ActionButton variant="contained" size="large" startIcon={<ShareIcon />} onClick={handleShare}>링크 공유</ActionButton>
                    <ActionButton variant="contained" size="large" startIcon={<PictureAsPdfIcon />} onClick={handlePrint}>PDF로 저장</ActionButton>
                </Box>
            </StyledPaper>
            
            <TermModal open={modalOpen} handleClose={() => setModalOpen(false)} termData={selectedTerm} />

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} className="no-print">
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>링크가 클립보드에 복사되었습니다!</Alert>
            </Snackbar>
        </StyledRoot>
    );
};

export default SajuResult;
