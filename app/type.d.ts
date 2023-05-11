declare module '*.svg' {
  import * as React from 'react';

  const content: (props: React.SVGProps<SVGElemet>) => React.ReactElement;
  export default content;
}

declare module 'seqalign';
