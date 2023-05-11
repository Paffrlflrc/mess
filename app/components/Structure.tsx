import 'react-circular-progressbar/dist/styles.css';

import {
  AnimationControls,
  motion,
  useDragControls,
  useAnimationControls,
} from 'framer-motion';
import * as React from 'react';
import { List as MovableList, arrayMove } from 'react-movable';

import ReactResizeDetector from 'react-resize-detector';

import { Layout, Space, Switch } from 'antd';
import { Divider, IconButton, List, ListItem, Typography } from '@mui/material';

import {
  Close,
  DragHandle,
  Layers,
  RestartAlt,
  Upload,
} from '@mui/icons-material';

import Mol from '@app/classes/Mol';
import handleUpload from '@app/functions/handleUpload';

const { Content, Sider } = Layout;

function LayersDrawer(props: {
  handleClose: () => void;
  open: boolean;
  mols: { [id: string]: Mol };
  handleChange: (molsIdArray: string[]) => void;
}) {
  return (
    <motion.div
      initial="close"
      animate={props.open ? 'open' : 'close'}
      variants={{
        open: {
          scaleX: 1,
        },
        close: {
          scaleX: 0,
        },
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        //
        zIndex: 2,
        height: '100%',
        width: '50vw',
        minWidth: 300,
        transformOrigin: 'left',
        //
        backgroundColor: 'whitesmoke',
        boxShadow: '0 0 3px 3px rgba(0, 0, 0, 0.3)',
      }}
    >
      <motion.div>
        <IconButton
          onClick={() => {
            props.handleClose();
          }}
        >
          <Close />
        </IconButton>
      </motion.div>
      <MovableList
        onChange={({ oldIndex, newIndex }) => {
          props.handleChange(
            arrayMove(Object.keys(props.mols), oldIndex, newIndex),
          );
        }}
        values={Object.keys(props.mols)}
        renderList={({ children, props: listProps }) => (
          <List
            sx={{
              zIndex: 3,
              padding: 0,
            }}
            {...listProps}
          >
            {children}
          </List>
        )}
        renderItem={({ value, props: itemProps }) => (
          <ListItem
            sx={{
              zIndex: 3,
              padding: 0,
            }}
            {...itemProps}
          >
            <Typography
              sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 600 }}
            >
              {value}
            </Typography>
            <Switch
              onChange={(cheched: boolean) => {
                if (!cheched) {
                  props.mols[value].h();
                } else {
                  props.mols[value].sfh();
                }
              }}
              defaultChecked
            />
          </ListItem>
        )}
      />
    </motion.div>
  );
}

const StructureWindow = React.forwardRef<
  HTMLDivElement,
  {
    mols: { [id: string]: Mol };
    handleClose: () => void;
    animationControl: (animationControl: AnimationControls) => void;
    renderFromUpload: (file: string) => void;
    handleSort: (mols: { [id: string]: Mol }) => void;
  }
>((props, ref) => {
  const [layersDrawerOpen, setLayersDrawerOpen] = React.useState(false);

  const resizeDetectorRef = React.useRef(null);

  const structureWindowDragControl = useDragControls();
  const structureWindowAnimationControl = useAnimationControls();

  React.useEffect(() => {
    props.animationControl(structureWindowAnimationControl);
  }, [structureWindowAnimationControl]);

  return (
    <>
      <LayersDrawer
        handleClose={() => setLayersDrawerOpen(false)}
        handleChange={(newMolsIdArray) => {
          const newMols: { [id: string]: Mol } = {};
          newMolsIdArray.forEach((molId) => {
            newMols[molId] = props.mols[molId];
          });
          props.handleSort(newMols);
        }}
        open={layersDrawerOpen}
        mols={props.mols}
      />
      <ReactResizeDetector
        refreshMode="throttle"
        refreshRate={100}
        targetRef={resizeDetectorRef}
      >
        {({ height, width }) => (
          <motion.div
            animate={structureWindowAnimationControl}
            ref={resizeDetectorRef}
            style={{
              height: window.innerHeight,
              width: window.innerWidth,
              maxHeight: window.innerHeight,
              maxWidth: window.innerWidth,
              //
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: -1,
              //
              resize: 'both',
              overflow: 'hidden',
              //
              boxShadow: '0 0 0.3rem 0.1rem rgba(0, 0, 0, 0.314)',
            }}
            drag
            dragConstraints={{
              left: 0,
              top: 0,
              bottom: window.innerHeight - height,
              right: window.innerWidth - width,
            }}
            dragListener={false}
            dragControls={structureWindowDragControl}
          >
            <motion.div
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: 'whitesmoke',
              }}
            >
              <Layout
                style={{
                  height,
                  width,
                }}
              >
                <motion.div
                  style={{
                    width: '100%',
                    height: 'min-content',
                    zIndex: 1,
                    backgroundColor: 'transparent',
                  }}
                >
                  <motion.span
                    onPointerDown={(event) => {
                      structureWindowDragControl.start(event);
                    }}
                  >
                    <IconButton>
                      <DragHandle />
                    </IconButton>
                  </motion.span>
                  <IconButton
                    onClick={() => {
                      props.handleClose();
                    }}
                  >
                    <Close />
                  </IconButton>
                </motion.div>
                <Content>
                  <motion.div
                    style={{
                      height: height || window.innerHeight,
                      width: (width || window.innerWidth) - 40,
                    }}
                    ref={ref}
                  />
                </Content>
                <Sider
                  theme="light"
                  width="fit-content"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Space
                    direction="vertical"
                    split={
                      <Divider
                        sx={{
                          background: 'black',
                        }}
                        orientation="horizontal"
                        variant="middle"
                      />
                    }
                  >
                    <IconButton
                      onClick={async () => {
                        setLayersDrawerOpen(false);
                        const file = await handleUpload();
                        props.renderFromUpload(file);
                      }}
                    >
                      <Upload />
                    </IconButton>
                    <IconButton
                      onClick={() => setLayersDrawerOpen(!layersDrawerOpen)}
                    >
                      <Layers />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        Object.values(props.mols).forEach((mol) => {
                          mol.reset();
                        });
                      }}
                    >
                      <RestartAlt />
                    </IconButton>
                  </Space>
                </Sider>
              </Layout>
            </motion.div>
          </motion.div>
        )}
      </ReactResizeDetector>
    </>
  );
});

export default React.memo(StructureWindow);
