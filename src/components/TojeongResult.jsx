import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

const ResultContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginTop: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    borderRadius: theme.shape.borderRadius * 2,
}));

const Section = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
    gap: theme.spacing(1),
}));

const ActionBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: alpha(theme.palette.success.light, 0.15),
    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
    borderRadius: theme.shape.borderRadius,
}));

const MonthlyListItem = styled(ListItem)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 1),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
        borderBottom: 'none',
    },
    transition: 'background-color 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.light, 0.08),
    }
}));

const MonthBox = styled(Box)(({ theme }) => ({
    width: '4.5rem',
    height: '2.5rem',
    flexShrink: 0,
    marginRight: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    borderRadius: theme.shape.borderRadius * 1.5,
    background: `linear-gradient(145deg, ${alpha(theme.palette.primary.light, 0.8)}, ${alpha(theme.palette.primary.main, 0.9)})`,
    color: theme.palette.primary.contrastText,
    boxShadow: `0 3px 8px ${alpha(theme.palette.primary.dark, 0.2)}`,
}));


const TojeongResult = ({ result }) => {
    if (!result) {
        return null;
    }

    const { general, action, monthly } = result;

    return (
        <ResultContainer>
            {/* 올해의 총운 */}
            <Section>
                <SectionTitle variant="h5">
                    <CalendarTodayIcon />
                    올해의 총운
                </SectionTitle>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    {general}
                </Typography>
            </Section>

            <Divider sx={{ my: 4 }} />

            {/* 올해의 행동 지침 */}
            <Section>
                 <SectionTitle variant="h5">
                    <CheckCircleOutlineIcon />
                    이렇게 행동하면 좋아요!
                </SectionTitle>
                <ActionBox>
                    <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.8, color: 'success.dark' }}>
                        {action}
                    </Typography>
                </ActionBox>
            </Section>

            <Divider sx={{ my: 4 }} />

            {/* 월별 운세 */}
            <Section>
                <SectionTitle variant="h5">
                   <DoubleArrowIcon />
                    월별 세운
                </SectionTitle>
                <List disablePadding>
                    {monthly.map((m, index) => (
                        <MonthlyListItem key={index} disablePadding>
                            <MonthBox>{`${m.month}월`}</MonthBox>
                            <ListItemText 
                                primary={m.fortune} 
                                primaryTypographyProps={{
                                    variant: 'body1',
                                    lineHeight: 1.7
                                }}
                            />
                        </MonthlyListItem>
                    ))}
                </List>
            </Section>

        </ResultContainer>
    );
};

export default TojeongResult;
