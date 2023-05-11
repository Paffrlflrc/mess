import { motion } from 'framer-motion';
import * as React from 'react';

const SequenceArea = React.forwardRef<HTMLTextAreaElement>((props, ref) => (
  <motion.textarea
    style={{
      height: '100%',
      width: '100%',
      //
      padding: '2rem',
      //
      resize: 'none',
      border: 'none',
      outline: 'none',
      //
      backgroundColor: 'whitesmoke',
      color: 'black',
      //
      fontFamily: 'monospace',
      fontSize: '1rem',
      fontWeight: '600',
      letterSpacing: '0.2rem',
    }}
    ref={ref}
    autoFocus
    placeholder="键入序列或通过菜单上传序列的文本文件"
  />
));

export default SequenceArea;
