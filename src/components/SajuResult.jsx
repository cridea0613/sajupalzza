import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Paper, Grid, Button, Divider, Chip, Tabs, Tab, Modal, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { getSaju } from '../utils/saju.js';
import { sajuDict } from '../utils/saju-dict.js';
import ViewAgendaOutlined from '@mui/icons-material/ViewAgendaOutlined';
import WindowOutlined from '@mui/icons-material/WindowOutlined';

// --- 디자인 시스템 기반 스타일 컴포넌트 정의 ---

const StyledRoot = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(3, 0),
  backgroundColor: '#F5F5DC', // Beige (토)
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D2B48C' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  fontFamily: '"Gowun Batang", serif',
  fontWeight: '700',
  color: '#8B4513', 
  textAlign: 'center',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontFamily: '"Gowun Batang", serif',
    fontWeight: '700',
    borderLeft: '4px solid #8B4513', 
    paddingLeft: theme.spacing(2),
    marginBottom: theme.spacing(3),
}));

const BackButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#B22222', // Firebrick (화)
    '&:hover': {
        backgroundColor: '#DC143C', // Crimson (화)
    },
    padding: theme.spacing(1.5),
    fontWeight: 'bold',
}));

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 500,
    bgcolor: '#FFF8E1', // Light Yellow (토)
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    border: '1px solid #8B4513',
    maxHeight: '80vh',
    overflowY: 'auto'
};

// --- 컴포넌트 정의 ---

const TermModal = ({ open, handleClose, termData }) => {
    if (!termData) return null;
    const { category, key, hangeul } = termData;
    const dictEntry = sajuDict[category];
    const termInfo = dictEntry?.terms[key];

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8, color: '#8B4513' }}>
                    <CloseIcon />
                </IconButton>
                <TitleTypography variant="h5" component="h2" gutterBottom>
                    {hangeul} ({key})
                </TitleTypography>
                <Divider sx={{ my: 2, borderColor: 'rgba(139, 69, 19, 0.2)' }} />
                {/* 폰트 스타일은 theme에서 상속받도록 하드코딩 제거 */}
                <Typography sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
                    {termInfo || '설명을 찾을 수 없습니다.'}
                </Typography>
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
        sx={{
            cursor: 'pointer', 
            mx: 0.5, 
            borderColor: '#2E8B57', // SeaGreen (목)
            color: '#2E8B57',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: 'rgba(46, 139, 87, 0.1)' }
        }}
    />
);

// ContentRenderer가 더 이상 Typography를 래핑하지 않도록 수정
// 부모의 타이포그래피 스타일을 상속받게 됩니다.
const ContentRenderer = ({ content, onClickTerm }) => {
    if (!content) return null;
    return (
        <>
            {content.map((part, index) => {
                if (part.type === 'term') {
                    return <ClickableTerm key={index} term={part} onClick={onClickTerm} />;
                }
                return <span key={index}>{part.value}</span>;
            })}
        </>
    );
};

const MonthlyTojeongBlock = ({ block, index }) => {
    const [layout, setLayout] = useState(2);

    const handleLayoutChange = (_, newValue) => {
        if (newValue !== null) setLayout(newValue);
    };

    const getGridProps = () => layout === 1 ? { xs: 12 } : { xs: 12, sm: 6 };

    return (
        <Box key={index} sx={{ mt: 2 }}>
             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Tabs value={layout} onChange={handleLayoutChange} sx={{ minHeight: 'auto' }}>
                    <Tab icon={<ViewAgendaOutlined />} value={1} sx={{ minWidth: 'auto', p: 1, color: '#8B4513' }} />
                    <Tab icon={<WindowOutlined />} value={2} sx={{ minWidth: 'auto', p: 1, color: '#8B4513' }} />
                </Tabs>
            </Box>
            <Grid container spacing={2}>
                {block.content.monthly.map((m, i) => (
                    <Grid item {...getGridProps()} key={i}>
                        <Paper variant="outlined" sx={{ p: 2, height: '100%', borderColor: 'rgba(139, 69, 19, 0.2)', backgroundColor: 'transparent' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontFamily: '"Gowun Batang", serif' }}>{m.month}월</Typography>
                             {/* 폰트 스타일은 theme에서 상속 */}
                            <Typography variant="body2" paragraph>{m.summary}</Typography>
                            <Box>{m.keywords.map((kw, j) => <Chip key={j} label={kw} size="small" sx={{ mr: 0.5, mb: 0.5, backgroundColor: 'rgba(139, 69, 19, 0.1)' }} />)}</Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

const SajuResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { name, birthDate: birthDateISO, gender } = location.state || {};
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTerm, setSelectedTerm] = useState(null);

    const handleTermClick = (term) => {
        setSelectedTerm(term);
        setModalOpen(true);
    };

    useEffect(() => {
        if (birthDateISO) {
            const birthDate = new Date(birthDateISO);
            setResult(getSaju(birthDate, gender));
            setLoading(false);
        } else {
            navigate('/');
        }
    }, [birthDateISO, gender, navigate]);

    const renderBlock = (block, index) => {
        switch (block.type) {
            case 'paragraph':
                {/* 폰트 스타일은 theme에서 상속 */}
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
                                        <tr key={i}>
                                            {row.map((cell, j) => (
                                                <td key={j} style={{ padding: '12px', border: '1px solid rgba(139, 69, 19, 0.2)', textAlign: 'center' }}>
                                                    {cell.type === 'term' ? <ClickableTerm term={cell} onClick={handleTermClick} /> : cell}
                                                </td>
                                            ))}
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
                                    {/* 폰트 스타일은 theme에서 상속 */}
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{p.daeun}</Typography>
                                    <ClickableTerm term={p.sipsin} onClick={handleTermClick} />
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                );
            case 'tojeong_summary':
                 return (
                    <Paper key={index} sx={{ p: 3, my: 2, backgroundColor: '#FFF8E1', border: '1px solid #FFECB3' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Gowun Batang", serif', color: '#8B4513' }}>올해의 총운</Typography>
                        {/* 폰트 스타일은 theme에서 상속 */}
                        <Typography paragraph>{block.content.summary}</Typography>
                        <Box>{block.content.keywords.map((kw, i) => <Chip key={i} label={kw} sx={{ mr: 1, mb: 1, backgroundColor: 'rgba(139, 69, 19, 0.1)' }} />)}</Box>
                    </Paper>
                );
            case 'tojeong_monthly':
                return <MonthlyTojeongBlock block={block} index={index} />;
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
                <TitleTypography variant="h4" component="h1" gutterBottom>
                    {name}님의 사주 분석 결과
                </TitleTypography>
                <Divider sx={{ my: 2, borderColor: 'rgba(139, 69, 19, 0.2)' }} />

                {/* --- 개선된 헤드라인 --- */}
                <Box sx={{ my: 4, textAlign: 'center' }}>
                    <TitleTypography
                        variant="h5"
                        component="h2"
                        sx={{
                            mb: 1.5,
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 1,
                            // 반응형 폰트 크기 적용으로 가시성 극대화
                            fontSize: { xs: '1.6rem', sm: '2.0rem', md: '2.4rem' },
                            // 이 안에 있는 Chip만 타겟으로 스타일을 적용합니다.
                            '& .MuiChip-root': {
                                height: 'auto',
                            },
                            '& .MuiChip-label': {
                                // 주변 텍스트보다 훨씬 큰 반응형 폰트 사이즈를 독립적으로 설정
                                fontSize: { xs: '2.4rem', sm: '3.0rem', md: '3.6rem' }, 
                                lineHeight: 1.2, 
                                padding: '0.4em 0.6em', // 폰트 크기에 비례하는 패딩
                            }
                        }}
                    >
                         <ContentRenderer content={narrative.headline.title_parts} onClickTerm={handleTermClick} />
                    </TitleTypography>
                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        gutterBottom
                        sx={{
                             // 부제도 반응형 폰트 크기 적용
                            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                        }}
                    >
                        {narrative.headline.text}
                    </Typography>
                </Box>
                
                 <Typography paragraph sx={{lineHeight: 1.8, fontSize: '1.1rem'}}>
                    <ContentRenderer content={narrative.summary.content} onClickTerm={handleTermClick} />
                </Typography>

                {narrative.sections.map((section, index) => (
                    <Box key={section.id || index} sx={{ my: 5 }}>
                        <SectionTitle variant="h5" component="h2">
                            {section.title}
                        </SectionTitle>
                        {section.blocks.map(renderBlock)}
                    </Box>
                ))}

                <Divider sx={{ my: 4, borderColor: 'rgba(139, 69, 19, 0.2)' }} />

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <BackButton variant="contained" size="large" onClick={() => navigate('/')}>
                        처음으로 돌아가기
                    </BackButton>
                </Box>
            </StyledPaper>
            <TermModal open={modalOpen} handleClose={() => setModalOpen(false)} termData={selectedTerm} />
        </StyledRoot>
    );
};

export default SajuResult;
