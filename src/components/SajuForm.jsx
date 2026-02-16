import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Paper, Typography, Grid, InputLabel, Select, MenuItem, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';

// --- 디자인 시스템 기반 스타일 컴포넌트 정의 ---

// 배경: 흙(土)의 기운. 차분한 베이지 컬러와 전통 문양.
const StyledRoot = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#F5F5DC', // Beige (토)
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D2B48C' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
}));

// 입력 폼: 금(金)의 기운. 깨끗하고 정돈된 느낌.
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  maxWidth: 500,
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
}));

// 헤드라인: 명조체, 금(金)의 색상으로 신뢰감 표현.
const TitleTypography = styled(Typography)(({ theme }) => ({
  fontFamily: '"Gowun Batang", serif',
  fontWeight: '700',
  color: '#8B4513', // SaddleBrown (금/토의 조화)
  textAlign: 'center',
  marginBottom: theme.spacing(3),
}));

// 입력 필드: 목(木)의 기운. 성장과 시작.
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#FFFFFF',
    '&.Mui-focused fieldset': {
      borderColor: '#2E8B57', // SeaGreen (목)
    },
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#FFFFFF',
      '&.Mui-focused fieldset': {
        borderColor: '#2E8B57', // SeaGreen (목)
      },
    },
  }));

// 분석 버튼: 화(火)의 기운. 열정과 행동 유도.
const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#B22222', // Firebrick (화)
  '&:hover': {
    backgroundColor: '#DC143C', // Crimson (화)
  },
  padding: theme.spacing(1.5),
  fontWeight: 'bold',
}));

const SajuForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');

  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [timeUnknown, setTimeUnknown] = useState(false);

  const [isSubmittable, setIsSubmittable] = useState(false);

  useEffect(() => {
    const isDateFilled = year && month && day;
    const isTimeFilled = hour !== '' && minute !== '';
    
    if (name && isDateFilled && (isTimeFilled || timeUnknown)) {
        setIsSubmittable(true);
    } else {
        setIsSubmittable(false);
    }
  }, [name, year, month, day, hour, minute, timeUnknown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSubmittable) return;

    // birthDate를 이 시점에 최종적으로 생성
    const birthDate = timeUnknown 
        ? new Date(year, month - 1, day, 0, 0)
        : new Date(year, month - 1, day, hour, minute);

    navigate('/result', {
        state: {
          name,
          birthDate: birthDate.toISOString(),
          gender,
          timeUnknown, // 시간 모름 상태 전달
        },
    });
  };

  const handleTimeUnknownChange = (event) => {
    const isChecked = event.target.checked;
    setTimeUnknown(isChecked);
    if (isChecked) {
      setHour('');
      setMinute('');
    }
  };

  const yearOptions = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const dayOptions = year && month ? Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => i + 1) : [];
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  return (
    <StyledRoot>
      <StyledPaper>
        <TitleTypography variant="h4" component="h1">
          사주 정보 입력
        </TitleTypography>
        <Typography align="center" sx={{ mb: 3, fontFamily: '\"Gowun Dodum\", sans-serif' }}>
            이름과 생년월일시를 입력하고 AI가 분석하는 당신의 운명을 확인해보세요.
         </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                required
                label="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <StyledFormControl fullWidth required>
                <InputLabel>년</InputLabel>
                <Select value={year} onChange={(e) => { setYear(e.target.value); setMonth(''); setDay(''); }} label="년">
                  {yearOptions.map(y => <MenuItem key={y} value={y}>{y}년</MenuItem>)}
                </Select>
              </StyledFormControl>
            </Grid>
            <Grid item xs={6} sm={4}>
              <StyledFormControl fullWidth required disabled={!year}>
                <InputLabel>월</InputLabel>
                <Select value={month} onChange={(e) => { setMonth(e.target.value); setDay(''); }} label="월">
                  {monthOptions.map(m => <MenuItem key={m} value={m}>{m}월</MenuItem>)}
                </Select>
              </StyledFormControl>
            </Grid>
            <Grid item xs={6} sm={4}>
              <StyledFormControl fullWidth required disabled={!month}>
                <InputLabel>일</InputLabel>
                <Select value={day} onChange={(e) => setDay(e.target.value)} label="일">
                  {dayOptions.map(d => <MenuItem key={d} value={d}>{d}일</MenuItem>)}
                </Select>
              </StyledFormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <StyledFormControl fullWidth required disabled={!day || timeUnknown}>
                <InputLabel>시</InputLabel>
                <Select value={hour} onChange={(e) => { setHour(e.target.value); }} label="시">
                  {hourOptions.map(h => <MenuItem key={h} value={h}>{h}시</MenuItem>)}
                </Select>
              </StyledFormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StyledFormControl fullWidth required disabled={!day || timeUnknown}>
                <InputLabel>분</InputLabel>
                <Select value={minute} onChange={(e) => setMinute(e.target.value)} label="분">
                  {minuteOptions.map(m => <MenuItem key={m} value={m}>{m}분</MenuItem>)}
                </Select>
              </StyledFormControl>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={timeUnknown}
                            onChange={handleTimeUnknownChange}
                            sx={{ color: '#B22222', '&.Mui-checked': { color: '#B22222' } }}
                        />
                    }
                    label="시간 모름"
                />
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ mb: 1, mt: 2, color: '#696969' }}>성별</FormLabel>
                <RadioGroup row value={gender} onChange={(e) => setGender(e.target.value)}>
                  <FormControlLabel value="male" control={<Radio sx={{ color: '#B22222', '&.Mui-checked': { color: '#B22222' } }} />} label="남자" />
                  <FormControlLabel value="female" control={<Radio sx={{ color: '#B22222', '&.Mui-checked': { color: '#B22222' } }} />} label="여자" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <SubmitButton
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={!isSubmittable}
              >
                분석 결과 보기
              </SubmitButton>
            </Grid>
          </Grid>
        </Box>
      </StyledPaper>
    </StyledRoot>
  );
};

export default SajuForm;
