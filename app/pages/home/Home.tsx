import * as delay from 'delay';

import {
  MotionStyle,
  Variants,
  motion,
  useAnimationControls,
} from 'framer-motion';
import * as React from 'react';

import SequenceDisplay from '@app/components/SequenceDisplay';

import getRandomSequence from '@app/toolkits/getRandomSequence';
import {} from '@mui/material';

function RandomSequence(props: { length: number }) {
  const [sequence] = React.useState(getRandomSequence(props.length));

  return (
    <SequenceDisplay
      hydrophilicity="b"
      hydrophobicity="y"
      mutateColorTag="r"
      originColorTag="g"
      sequence={sequence}
      mutatePoints={[]}
      mutateRatio={0}
    />
  );
}

function MutateSequence(props: { length: number }) {
  const [sequence] = React.useState(getRandomSequence(props.length));

  return (
    <SequenceDisplay
      hydrophilicity="g"
      hydrophobicity="g"
      mutateColorTag="r"
      originColorTag="g"
      sequence={sequence}
      mutatePoints={[...new Array(props.length).keys()]}
      mutateRatio={0.5}
    />
  );
}

const sequenceVariants: Variants = {
  open: {
    transition: {
      duration: 0.6,
    },
    opacity: [0, 1, 1],
    pathLength: [0, 1, 1],
    fillOpacity: [0, 0, 1],
    filter: 'hue-rotate(0deg)',
  },
  close: {
    pathLength: 0,
    fillOpacity: 0,
    opacity: 0,
    filter: 'hue-rotate(0deg)',
  },
};

const outer = {
  height: '100vh',
  width: '100vw',
  //
  backgroundColor: 'rgba(0, 200, 200, 1)',
};

const atomsphere: MotionStyle = {
  height: '100%',
  width: '100%',
  //
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  //
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const A: MotionStyle = {
  width: '80vw',
  height: '80vh',
  //
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const uniref50Squences: Variants = {
  open: {
    height: '20vmin',
    transition: {
      duration: 0.1,
      delayChildren: 0.1,
      staggerChildren: 0.01,
      when: 'beforeChildren',
    },
    //
    scale: 1,
    opacity: 1,
    y: 0,
  },
  close: {
    width: '100%',
    height: '0em',
    //
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4vh',
    opacity: 0,
    scale: 1,
    y: 0,
  },
  use: {
    opacity: 0,
    scale: 0,
    y: '36vh',
    transition: {
      duration: 0.6,
    },
  },
};

const uniref50sequencesText: Variants = {
  close: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 'bolder',
    fontSize: '2vw',
    lineHeight: '8vh',
    //
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
  },
  open: {
    opacity: 1,
  },
};

const sequences: MotionStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-around',
  gap: '2vmin',
};

const ellipsis: Variants = {
  close: {
    color: 'rgba(0, 0, 0, 0.9)',
    fontFamily: 'monospace',
    fontWeight: 1000,
    //
    y: -16,
    opacity: 0,
    fontSize: '2vw',
    textAlign: 'center',
  },
  open: {
    y: 0,
    opacity: 1,
  },
};

const unirepText: Variants = {
  close: {
    flex: 1,
    //
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    //
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '2vw',
    fontWeight: 'bolder',
    opacity: 0,
  },
  open: {
    opacity: 1,
  },
};

const unirepToTrain: Variants = {
  close: {
    scale: 0.6,
    //
    flex: 1,
    width: '21vmin',
    //
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    //
    justifySelf: 'center',
  },
  open: {
    width: '30vw',
  },
};

const unirepToTrainContainer: MotionStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  //
  width: '100%',
  //
  position: 'relative',
};

function PartA() {
  const [left, setLeft] = React.useState<null | React.ReactElement>(null);
  const [right, setRight] = React.useState<null | React.ReactElement>(null);
  const [describe, setDescribe] = React.useState<null | React.ReactElement>(
    null,
  );

  const uniref50SequencesContorl = useAnimationControls();
  const unirepControl = useAnimationControls();
  const unirepTextControl = useAnimationControls();
  const slotControl = useAnimationControls();
  const unirep50TextControl = useAnimationControls();

  const enter = React.useCallback(async () => {
    await unirepControl.start('open');
    await uniref50SequencesContorl.start('open');
    await unirepTextControl.start('open');

    await delay(2000);

    await unirepTextControl.start('close');

    await uniref50SequencesContorl.start('use');
    await unirepControl.start({
      filter: 'hue-rotate(45deg)',
    });

    await uniref50SequencesContorl.start({
      height: 0,
    });
    await uniref50SequencesContorl.set({
      display: 'none',
    });

    await (async () => {
      unirepControl.start({
        x: '-16vw',
      });
      unirep50TextControl.start({ display: 'inline' });
      unirep50TextControl.start({ opacity: 1 });
    })();

    await delay(2000);

    await unirep50TextControl.start({ opacity: 0 });
    await unirep50TextControl.start({ display: 'none' });
    await unirepControl.start({ x: 0 });

    setLeft(<>目标蛋白的相关序列</>);
    setRight(<>能抓取功能序列的Unirep</>);

    await uniref50SequencesContorl.set('close');
    await uniref50SequencesContorl.start('open');

    await unirepTextControl.start('open');
    await unirep50TextControl.start('open');

    await delay(2000);

    await unirepTextControl.start('close');
    await unirep50TextControl.start('close');

    await uniref50SequencesContorl.start('use');

    await unirepControl.start({
      filter: 'hue-rotate(90deg)',
    });

    await uniref50SequencesContorl.start({
      height: 0,
    });
    await uniref50SequencesContorl.set({
      display: 'none',
    });

    // await slotControl.start({
    //  flex: 0,
    // });

    setDescribe(
      <>
        此时Unirep已经通过目标蛋白序列的训练而
        <br />
        微调成为了具有抓取目标蛋白功能序列的能力的eUnirep
      </>,
    );

    await unirepControl.start({ x: '-100%' });

    await unirep50TextControl.start({ display: 'block', opacity: 1 });
    await unirep50TextControl.start('open');
  }, []);

  React.useEffect(() => {
    setLeft(<>Uniref50数据库中的氨基酸序列</>);
    setRight(<>待训练的Unirep</>);
    setDescribe(
      <>
        预训练赋予Unirep抓取
        <br />
        能表征蛋白质特定功能序列的能力
      </>,
    );
  }, []);

  React.useEffect(() => {
    if (uniref50SequencesContorl) {
      enter();
    }
  }, [uniref50SequencesContorl]);

  return (
    <motion.div id="outer" style={outer}>
      <motion.div
        id="atomsphere"
        style={atomsphere}
        css={{
          background: 'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2))',
        }}
      >
        <motion.div id="partA" style={A}>
          <motion.div
            animate={uniref50SequencesContorl}
            initial="close"
            variants={uniref50Squences}
            transition={{
              duration: 0.6,
            }}
          >
            <motion.span
              animate={unirepTextControl}
              initial="close"
              variants={uniref50sequencesText}
              transition={{
                duration: 0.6,
              }}
            >
              {left}
            </motion.span>
            <motion.div style={sequences}>
              {new Array(3).fill('slot').map((item, index) => {
                return (
                  <RandomSequence
                    key={`${item}_${index.toString()}`}
                    length={10}
                  />
                );
              })}
              <motion.div
                transition={{
                  duration: 0.6,
                }}
                variants={ellipsis}
              >
                ......
              </motion.div>
            </motion.div>
            <motion.div
              transition={{
                duration: 0.6,
              }}
              style={{
                flex: 1,
              }}
            >
              &nbsp;
            </motion.div>
          </motion.div>

          <motion.div
            transition={{
              duration: 0.6,
            }}
            style={unirepToTrainContainer}
          >
            <motion.div
              transition={{
                duration: 0.6,
              }}
              animate={slotControl}
              style={{
                flex: 1,
              }}
            />
            <motion.div
              transition={{
                duration: 0.6,
                delayChildren: 1,
              }}
              animate={unirepControl}
              initial="close"
              variants={unirepToTrain}
            >
              <motion.svg viewBox="0 0 425.7 425">
                <motion.path
                  transition={{
                    duration: 0.6,
                  }}
                  custom={1}
                  variants={sequenceVariants}
                  fill="#4CAF50"
                  stroke="#000000"
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="10"
                  d="
	M410.2,84.1l-197.3,69.3L15.5,84.1L212.8,15L410.2,84.1z"
                />
                <motion.path
                  transition={{
                    duration: 0.6,
                  }}
                  custom={2}
                  variants={sequenceVariants}
                  fill="#66BB6A"
                  stroke="#000000"
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="10"
                  d="
	M410.2,84.1v256l-197.3,69.3v-256L410.2,84.1z"
                />
                <motion.path
                  transition={{
                    duration: 0.6,
                  }}
                  custom={3}
                  variants={sequenceVariants}
                  fill="#81C784"
                  stroke="#000000"
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="10"
                  d="
	M212.8,153.5v256L15.5,340.1v-256L212.8,153.5z"
                />
              </motion.svg>
            </motion.div>
            <motion.span
              transition={{
                duration: 0.6,
              }}
              animate={unirepTextControl}
              initial="close"
              variants={unirepText}
            >
              {right}
            </motion.span>
            <motion.span
              transition={{
                duration: 0.6,
              }}
              style={{
                position: 'absolute',
                x: '16vw',
                display: 'none',
                opacity: 0,
                //
                fontSize: '2vw',
                fontWeight: 'bolder',
                lineHeight: '8vh',
                //
                color: 'whitesmoke',
              }}
              animate={unirep50TextControl}
            >
              {describe}
            </motion.span>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function PartBSequence() {
  return (
    <motion.div
      style={{
        width: '100%',
        height: '100%',
        //
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}
      animate="open"
      initial="close"
      variants={{
        open: {
          transition: {
            duration: 0.1,
            delayChildren: 0.1,
            staggerChildren: 0.01,
            when: 'beforeChildren',
          },
          //
          scale: 1,
          opacity: 1,
          y: 0,
        },
        close: {
          height: '0em',
          //
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4vh',
          opacity: 0,
          scale: 1,
          y: 0,
        },
      }}
      transition={{
        duration: 0.6,
      }}
    >
      <motion.div
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around',
          gap: '2vmin',
        }}
      >
        {new Array(3).fill('slot').map((item, index) => {
          return (
            <MutateSequence key={`${item}_${index.toString()}`} length={10} />
          );
        })}
      </motion.div>
    </motion.div>
  );
}

function PartB() {
  return (
    <motion.div
      id="outer"
      style={{
        height: '100vh',
        width: '100vw',
        //
        backgroundColor: 'rgba(200, 200, 0, 1)',
      }}
    >
      <motion.div
        id="atomsphere"
        style={{
          height: '100%',
          width: '100%',
          //
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          //
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        css={{
          background: 'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2))',
        }}
      >
        <PartBSequence />
      </motion.div>
    </motion.div>
  );
}

function Home() {
  return <PartA />;
}

export default Home;
