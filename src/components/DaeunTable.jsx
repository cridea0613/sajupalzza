
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

// 십신별 운세 설명을 포함하는 객체입니다.
const sipsinDescription = {
    "비견": "자존심과 독립심이 강해지는 시기입니다. 새로운 시작이나 동업에 유리하지만, 고집으로 인한 다툼을 주의해야 합니다.",
    "겁재": "경쟁심이 강해지고 재물에 대한 욕심이 커집니다. 주변 사람들과의 경쟁이나 재물 다툼이 발생할 수 있습니다.",
    "식신": "창의적인 활동이나 표현력이 좋아지는 시기입니다. 의식주가 풍족해지고 안정적인 삶을 누릴 수 있습니다.",
    "상관": "기존의 틀을 깨고 새로운 것을 추구하려는 성향이 강해집니다. 변화와 혁신을 통해 발전할 수 있지만, 구설수를 조심해야 합니다.",
    "편재": "활동 무대가 넓어지고 재물운이 상승하는 시기입니다. 사업이나 투자를 통해 큰 재물을 얻을 수 있는 기회입니다.",
    "정재": "안정적이고 꾸준한 재물 활동이 기대되는 시기입니다. 결혼이나 안정적인 직장 생활에 유리합니다.",
    "편관": "책임감이 막중해지고 도전적인 과제를 마주하게 됩니다. 명예를 얻을 수 있는 기회이기도 합니다.",
    "정관": "사회적 지위가 상승하고 명예를 얻게 되는 시기입니다. 승진이나 합격의 기쁨을 누릴 수 있습니다.",
    "편인": "학문이나 예술, 종교 등 정신적인 분야에 대한 깊은 탐구가 이루어지는 시기입니다.",
    "정인": "학업에 성취가 따르고, 윗사람의 도움이나 인정을 받아 안정적인 환경에서 발전하는 시기입니다.",
};

const DaeunTable = ({ periods }) => {
  if (!periods || periods.length === 0) {
    return <Typography>대운 정보를 계산할 수 없습니다.</Typography>;
  }

  return (
    <TableContainer component={Paper} sx={{ my: 2, borderRadius: 2, boxShadow: 3 }}>
      <Table aria-label="daeun table">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.main' }}>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>나이</TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>대운</TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>십신</TableCell>
            <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold', minWidth: '250px' }}>운세</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {periods.map((period, index) => (
            <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>{`${period.age}세`}</TableCell>
              <TableCell align="center">{period.daeun}</TableCell>
              <TableCell align="center">{period.sipsin}</TableCell>
              <TableCell align="left">{sipsinDescription[period.sipsin]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DaeunTable;
