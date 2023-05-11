import { motion } from 'framer-motion';
import * as React from 'react';

import { Tooltip } from '@mui/material';

import { randomBernoulli } from 'd3-random';

enum Swatch {
  'b' = '#6cbef6',
  'g' = '#81e29e',
  'r' = '#dd636e',
  'y' = '#ecbd6b',
}

const swatch: { [tag: string]: string } = {};
const swatchValues = Object.values(Swatch);
Object.keys(Swatch).forEach((key, index) => {
  swatch[key] = swatchValues[index];
});

const HYDROPHILICITY = ['S', 'T', 'Y', 'C', 'N', 'Q', 'D', 'E', 'R', 'K', 'H'];
const HYDROPHOBICITY = ['G', 'A', 'V', 'L', 'I', 'P', 'F', 'W', 'M'];

function SequenceDisplay(props: {
  hydrophilicity: string;
  hydrophobicity: string;
  mutateColorTag: string;
  mutatePoints: number[];
  mutateRatio: number;
  originColorTag: string;
  sequence: string[];
}) {
  return (
    <motion.svg viewBox={`0 0 ${1.6 + 10 * props.sequence.length} 11.6`}>
      {props.sequence.map((unit, index) => (
        <Tooltip arrow title={unit} key={index.toString() + unit}>
          <motion.rect
            variants={{
              open: {
                scale: 1,
              },
              close: {
                scale: 0,
              },
            }}
            //
            x={`${0.8 + 10 * index}`}
            y="0.8"
            fill={(() => {
              let colorTag = props.originColorTag;
              if (HYDROPHILICITY.includes(unit.toUpperCase())) {
                colorTag = props.hydrophilicity;
              }
              if (HYDROPHOBICITY.includes(unit.toUpperCase())) {
                colorTag = props.hydrophobicity;
              }
              if (props.mutatePoints.includes(index)) {
                if (randomBernoulli(props.mutateRatio)()) {
                  colorTag = props.mutateColorTag;
                }
              }
              return swatch[colorTag];
            })()}
            stroke="#000000"
            strokeWidth="1.6"
            strokeLinejoin="round"
            width="10"
            height="10"
          />
        </Tooltip>
      ))}
    </motion.svg>
  );
}

export default SequenceDisplay;
